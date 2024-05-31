const jwt = require("jsonwebtoken");
module.exports = {
    checkApiKey: (req, res, next) => {
        let apikey = req.get("API-Key");
        if(!apikey) {
           return res.status(400).json({
                "status":"error",
                "msg":"Missing API key in header"
            });
        }

        if(apikey == process.env.API_KEY) {
            next();
        }else{
           return res.status(400).json({
                "status":"error",
                "msg":"Invalid API key"
            });
        }
    }
};
