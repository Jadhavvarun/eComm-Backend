const jwt = require("jsonwebtoken");

module.exports = {
    getDecodeToken: (token) => {
        if (token) {
            try {
                let token_val = token.slice(7);
                let decoded = jwt.verify(token_val, process.env.JWT_KEY);
                return decoded;
            } catch (error) {
                
            }
        }
    }
}