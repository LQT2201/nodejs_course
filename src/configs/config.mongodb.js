const config = {
    app:{
        port:process.env.DEV_APP_PORT || 3052,
    },
    db:{
        host:process.env.DEV_DB_HOST || "127.0.0.1",
        port:process.env.DEV_DB_PORT || 27017,
        name:process.env.DEV_DB_NAME || 'shopDEV'
    }
}

module.exports = config