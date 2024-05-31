const {
    create,
    getUserByUserEmail,
    getUsernameIsExist,
    createPasswordResetToken, 
    sendPasswordResetEmail,
    resetPassword 
} = require("./login.service.js");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { getDecodeToken } = require("../../auth/getDecodeToken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        getUsernameIsExist(body, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: err.message || "Database connection error"
                });
            }
            if (result[0].count == 0) {
                const salt = genSaltSync(10);
                if (body.password !== "") {
                    body.password = hashSync(body.password, salt);
                }

                create(body, (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            status: "error",
                            message: err.message || "Database connection error",
                            error: err
                        });
                    }
                    return res.status(200).json({
                        status: "success",
                        data: results
                    });
                });
            } else {
                return res.status(200).json({
                    status: "error",
                    message: `${body.emailAddress} is already exist`,
                    data: "already exist"
                });
            }
        });
    },

    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    message: err.message || "Database connection error"
                });
            }
            if (!results) {
                return res.json({
                    status: 'error',
                    message: "Invalid email"
                });
            }
            if (Object.values(results).length > 0) {
                const result = compareSync(body.password, results.password);
                if (result) {
                    results.password = undefined;
                    const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
                        expiresIn: "90d"
                    });
                    return res.json({
                        status: "success",
                        message: "login successfully",
                        data: results,
                        token: jsontoken
                    });
                } else {
                    return res.json({
                        status: 'error',
                        message: "Invalid username or password"
                    });
                }
            } else {
                return res.json({
                    status: 'error',
                    message: "User not found"
                });
            }
        });
    },
    forgotPassword: (req, res) => {
        const { emailAddress } = req.body;
        getUsernameIsExist({ emailAddress }, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    message: err.message || "Database connection error"
                });
            }
            if (result[0].count === 0) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found"
                });
            }
            createPasswordResetToken(emailAddress, (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        status: "error",
                        message: err.message || "Error generating password reset token"
                    });
                }
                sendPasswordResetEmail(emailAddress, token);
                return res.status(200).json({
                    status: "success",
                    message: "Password reset instructions sent to your email address"
                });
            });
        });
    },
    resetPassword: (req, res) => {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({
                status: "error",
                message: "Token and newPassword are required"
            });
        }    
        resetPassword(token, newPassword, (err, success) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    message: "Error resetting password"
                });
            }
            if (!success) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid or expired token"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Password reset successfully"
            });
        });
    }
};
