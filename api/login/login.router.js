
const {
    checkToken
  } = require("../../auth/token_validation");
  const { createUser, login,forgotPassword,resetPassword } = require("./login.controller");
  const { createUserValidation,loginValidation } = require("./login.validation");
  const router = require("express").Router();
  
  
  router.post("/create",createUserValidation,createUser);
  router.post("/",loginValidation, login);
  router.post("/forgot-password", forgotPassword);
  router.post("/reset-password",resetPassword);
   
  module.exports = router;