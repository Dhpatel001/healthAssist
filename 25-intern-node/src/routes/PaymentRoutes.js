const router = require("express").Router();
const paymentController = require("../controllers/PaymentController");
router.post("/create_order", paymentController.create_order);
router.post("/verify_order", paymentController.verify_order);

module.exports = router;