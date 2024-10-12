const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const shopModel = require('../models/shop.model')
const keyTokenService = require('./keyToken.service')
const {getInfoData} = require('../utils')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')

/// services ///

const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}

class AccessService {

    /*
        Check this token used ?
    */
    static handleRefreshToken = async(refreshToken) => {

        const foundToken =  await keyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundToken){
            // decode xem who is this
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({userId, email})

            //xoa
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! Pls relogin')
            
        }

        const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
        console.log('holder:', holderToken)

        if(!holderToken) throw new AuthFailureError('Shop not registered 1')

        // verify
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('{2}',{userId, email})

        //check userId
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registered 2')
        
        // Cap 1 token moi
        const tokens  = await createTokenPair({userId, email},holderToken.publicKey,holderToken.privateKey)

        //update tokens
        await holderToken.updateOne({
            $set:{
                refreshToken:tokens.refreshToken
            },
            $addToSet:{
                refreshTokensUsed:refreshToken // da duoc su dung de lay token moi
            }
        })

        return {
            metadata:{
                shop:getInfoData({fileds: ['_id', 'name', 'email'], object:foundShop}),
                tokens
            }
        };
    }

    static logout = async( keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        console.log(delKey)
        return delKey
    }
    /*
        1 - Check email in dbs
        2 - Match password
        3 - Create AT and RT, save it
        4 - Generates tokens
        5- Get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
            // 1. Find shop by email
            const foundShop = await findByEmail({ email });
            if (!foundShop) throw new BadRequestError('Shop not registered');

            // 2. Compare the passwords
            const match = await bcrypt.compare(password, foundShop.password);
            if (!match) throw new AuthFailureError('Authentication error');

            // 3. Generate privateKey and publicKey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            // 4. Create tokens
            const { _id: userId } = foundShop;
            const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

            // 5. Save the tokens in the keystore
            await keyTokenService.createKeyToken({
                userId,
                privateKey,
                publicKey,
                refreshToken: tokens.refreshToken,
            });

            // 6. Return shop info and tokens
            return {
                metadata:{
                    shop:getInfoData({fileds: ['_id', 'name', 'email'], object:foundShop}),
                    tokens
                }
            };
        };
    
    static signUp = async ({name, email, password}) => {
        // try {
            // step 1: Check email exists ?

            const hodelShop = await shopModel.findOne({email}).lean()

            if(hodelShop){
                throw new BadRequestError('Error: Shop already registered')
            }

            const passwordHash = await bcrypt.hash(password,5)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles:[RoleShop.SHOP]
            })

            if (newShop) {
                // created privateKey, publicKey VERSION RSA
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem',
                //     },
                //     privateKeyEncoding:{
                //         type:'pkcs1',
                //         format:'pem'
                //     }
                // })

                //
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log("Generated RSA keys", privateKey, publicKey);

                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore){
                    throw new BadRequestError('Error: Keystore error')
                }
                
                // const publicKeyObject = crypto.createPublicKey(publicKeyString)

                //created token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log('Created token success', tokens)
                
                return  {
                    code: 201,
                    metadata:{
                        shop:getInfoData({fileds: ['_id', 'name', 'email'], object:newShop}),
                        tokens
                    }
                }
            } 

            return {
                code:200,
                metadata: null
            }


        // } catch (error) {
        //     return {
        //         code: "xxx",
        //         message:error.message,
        //         status:'error'
        //     }
        // }
    }
}

module.exports = AccessService