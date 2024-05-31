const { checkApiKey } = require("../../auth/apikey_validation");
const router = require("express").Router();
const { gerDataController, insertController } = require("./cart.controller");

router.get("/:c_id",checkApiKey,gerDataController)
router.post("/",checkApiKey,insertController)

module.exports = router;