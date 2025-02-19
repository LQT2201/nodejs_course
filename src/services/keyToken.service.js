const { Types } = require('mongoose')
const keyTokenModel = require('../models/keytoken.model') 

class KeyTokenService {
    static createKeyToken = async({userId, publicKey,privateKey, refreshToken}) => {
        try {
            // const publicKeyString = publicKey.toString()
            // level 0
            // const tokens  = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null

            //level xxx
            const filter  = {user:userId}, update = {
                publicKey, privateKey, refreshTokensUsed:[], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }    

    static removeKeyById = async (id) => {
        return await keyTokenModel.findByIdAndDelete(id)
    }

    static findByRefreshTokenUsed =  async(refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed:refreshToken}).lean()
    }

    static findByRefreshToken =  async(refreshToken) => {
        return await keyTokenModel.findOne({refreshToken:refreshToken})
    }

    static deleteKeyById =  async(userId) => {
        return await keyTokenModel.findByIdAndDelete({user:userId})
    }
}

module.exports = KeyTokenService