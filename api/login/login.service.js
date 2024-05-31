const pool = require("../../config/database");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendGrid = require('@sendgrid/mail');

const LOGIN_COLUMNS = [
    'customerId',
    'firstName',
    'middleName',
    'lastName',
    'cName',
    'gender',
    'houseno',
    'floor',
    'address',
    'address2',
    'landmark',
    'city',
    'prov',
    'zip',
    'country',
    'phone',
    'emailAddress',
    'mobile',
    'mobile2',
    'company',
    'title',
    'workPhone',
    'dateOfBirth',
    'anniversary',
    'newsletter',
    'ipaddress',
    'subsms',
    'addedDate',
    'addedBy',
    'refby',
    'datasource',
    'occupation',
    'designation',
    'contactpref',
    'pref',
    'activatedon',
    'securecode',
    'active',
    'password',
    'profImage'
];


function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

module.exports = {
    create: (data, callBack) => {
        const placeholders = Object.keys(data)
            .map(key => `?`)
            .join();
        const columns = Object.keys(data).join();
        const values = Object.values(data);
    
        const query = `INSERT INTO customer (${columns}) VALUES (${placeholders})`;
    
        pool.query(query, values, (error, results, fields) => {
            if (error) {
                callBack(error);
            }
            return callBack(null, results);
        });
    },
    getUsernameIsExist: (data, callBack) => {
        pool.query(
            `SELECT EXISTS(select * from customer where emailAddress = ?) as count`,
            [
                data.emailAddress,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByUserEmail: (data, callBack) => {
        pool.query(
            `SELECT * FROM customer WHERE emailAddress = ?`,
            [
                data.emailAddress
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    
    getUserByUserId: (id, callBack) => {
        pool.query(
            `SELECT * FROM customer WHERE customerId = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    changePassword: (data, callBack) => {
        pool.query(
            `UPDATE customer SET password = ? WHERE customerId = ?`,
            [
                data.password,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    createPasswordResetToken: (email, callBack) => {
        const token = generateToken();
        const expiryDate = new Date(Date.now() + 3600000); // Token expires in 1 hour
        pool.query(
            `INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)`,
            [email, token, expiryDate],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                callBack(null, token);
            }
        );
    },

    sendPasswordResetEmail: (email, token) => {
        let transporter = nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
         port: 465,
            secure: true, 
            auth: {
                user: 'billybutcher490@gmail.com', 
                pass: 'bacx xhaz xyzt qouo' 
            }
        });
        let info = transporter.sendMail({
            from: '"Unipolar Technologies" <billybutcher490@gmail.com>', 
            to: email, 
            subject: 'Reset Your Password', 
            text: `You have requested to reset your password. Click the following link to reset your password: https://nexiblesweb.barecms.com/reset-password?token=${token}`,
            html: `<p>You have requested to reset your password. Click the following link to reset your password:</p><p><a href="https://nexiblesweb.barecms.com/reset-password?token=${token}">Reset Password</a></p>`
        });
        console.log("Message sent: %s", info.messageId);
    },

    resetPassword: (token, newPassword, callback) => {
        pool.query(
            `SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()`,
            [token],
            (error, rows, fields) => {
                if (error) {
                    console.error("Error retrieving token:", error);
                    return callback(error, null);
                }
                if (rows.length === 0) {
                    const invalidTokenError = new Error("Invalid or expired token");
                    console.error(invalidTokenError);
                    return callback(invalidTokenError, null);
                }
                bcrypt.hash(newPassword, 10, (hashError, hashedPassword) => {
                    if (hashError) {
                        console.error("Error hashing password:", hashError);
                        return callback(hashError, null);
                    }
                    pool.query(
                        `UPDATE customer SET password = ? WHERE emailAddress = ?`,
                        [hashedPassword, rows[0].email],
                        (updateError, updateResults) => {
                            if (updateError) {
                                console.error("Error updating password:", updateError);
                                return callback(updateError, null);
                            }
                            pool.query(
                                `DELETE FROM password_reset_tokens WHERE token = ?`,
                                [token],
                                (deleteError, deleteResults) => {
                                    if (deleteError) {
                                        console.error("Error deleting token:", deleteError);
                                        return callback(deleteError, null);
                                    }
                                    return callback(null, true);
                                }
                            );
                        }
                    );
                });
            }
        );
    }    
   
};
