const crypto = require("crypto");

const PaymentsController = {
  generateHash: (merchantId, orderId, amount, currency, merchantSecret) => {
    const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
    return crypto
      .createHash("md5")
      .update(`${merchantId}${orderId}${amount.toFixed(2)}${currency}${hashedSecret}`)
      .digest("hex")
      .toUpperCase();
  },

  notify: (req, res) => {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;
    const localMd5sig = PaymentsController.generateHash(
      process.env.PAYHERE_MERCHANT_ID,
      order_id,
      parseFloat(payhere_amount),
      payhere_currency,
      process.env.PAYHERE_MERCHANT_SECRET
    );

    if (localMd5sig !== md5sig || status_code !== "2") {
      return res.status(400).json({ success: false, message: "Invalid payment notification" });
    }

    // Update the database with payment success
    // Example: Update the Payment table and Enrollment
    res.status(200).json({ success: true, message: "Payment verified and processed" });
  },

  generateHashEndpoint: (req, res) => {
    const { order_id, amount, currency } = req.body;
  
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  
    if (!order_id || !amount || !currency) {
      return res.status(400).json({ success: false, message: "Invalid parameters" });
    }
  
    const hash = PaymentsController.generateHash(
      merchantId,
      order_id,
      parseFloat(amount),
      currency,
      merchantSecret
    );
  
    res.status(200).json({
      merchant_id: merchantId,
      hash,
    });
  }
};



module.exports = PaymentsController;
