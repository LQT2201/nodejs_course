const apikeyModel = require('../models/apikey.model');
const { findById } = require('../services/apikey.service');
const crypto = require("node:crypto")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'Authorization'
};

const apiKey = async (req, res, next) => {
    try {

        const key = req.headers[HEADER.API_KEY]?.toString();
        
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error key'
            });
        }

        // Check API key in the database/service
        const objKey = await findById(key);
        
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error obj'
            });
        }
        
        req.objKey = objKey
        next();
        
    } catch (error) {
        console.error('Error in apiKey middleware:', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions) {
            return res.status(403).json({
                message:" permission denied"
            })
        }
        console.log('permissions::',req.objKey.permissions)

        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message:"permission denied 2"
            })
        }

        return next()
    }
    
}


module.exports = {
    apiKey,
    permission,
};
