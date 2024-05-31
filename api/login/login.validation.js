module.exports = {
    createUserValidation: function(req, res, next) {
        const body = req.body;
        if (!body.firstName) {
            return res.status(400).json({
                "status": "error",
                "msg": "Please enter firstName field"
            });
        } else if (!body.lastName) {
            return res.status(400).json({
                "status": "error",
                "msg": "Please enter lastName field"
            });
        } else if (!body.emailAddress) {
            return res.status(400).json({
                "status": "error",
                "msg": "Please enter email field"
            });
        } else if (!body.password) {
            return res.status(400).json({
                "status": "error",
                "msg": "Please enter userpassword field"
            });
        } else {
            next();
        }
    },
    loginValidation: function(req, res, next) {
        const body = req.body;
        if (!body.emailAddress) {
            return res.status(400).json({
                "status": "error",
                "msg": "Please enter email field"
            });
        } else if (!body.password) {
            return res.status(400).json({
                "status": "error",
                "msg": "Please enter userpassword field"
            });
        } else {
            next();
        }
    }
};
