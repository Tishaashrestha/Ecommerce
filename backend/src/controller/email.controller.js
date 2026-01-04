// GET /verify-email-transporter
export const verifyEmailTransporter = async (req, res) => {
  try {
    await transporter.verify();
    res.status(200).json({ success: true, message: "Email transporter is ready to send messages." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
import { transporter } from "../lib/nodemailer.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// POST /send-segmented-email
export const sendSegmentedEmail = async (req, res) => {
  try {
    const INACTIVE_DAYS = 90;
    const HIGH_VALUE_THRESHOLD = 500;
    const now = new Date();
    const users = await User.find();
    const results = [];

    for (const user of users) {
      // Get all orders for user
      const orders = await Order.find({ user: user._id });
      let totalSpend = 0;
      let lastOrderDate = null;
      if (orders.length > 0) {
        totalSpend = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        lastOrderDate = orders.reduce((latest, order) => {
          return order.createdAt > latest ? order.createdAt : latest;
        }, orders[0].createdAt);
      }

      let segment = "other";
      let subject = "",
        text = "";

      // Inactive: no orders in last INACTIVE_DAYS
      if (
        !lastOrderDate ||
        (now - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24) > INACTIVE_DAYS
      ) {
        segment = "inactive";
        subject = "50% Off Sale on Leather Jackets!";
        text = `Hi ${user.name},\nIt's been a while since your last visit! We're offering you an exclusive 50% off on our premium leather jackets. Use code: LEATHER50 at checkout. Hurry, limited time only!`;
      }
      // High value: total spend above threshold
      else if (totalSpend >= HIGH_VALUE_THRESHOLD) {
        segment = "high-value";
        subject = "Early Access: New Fur Coats Collection";
        text = `Hi ${user.name},\nAs a valued customer, you get early access to our luxurious new fur coats collection! Shop now before anyone else and enjoy exclusive styles just for you.`;
      } else {
        // Regular customer
        subject = "Thank You! Enjoy 10% Off";
        text = `Hi ${user.name},\nThank you for shopping with us! Enjoy 10% off your next order with code: THANKYOU.`;
      }

      // Send email
      await transporter.sendMail({
        from: `"Kaya Studios" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        text,
      });
      results.push({ email: user.email, segment, sent: true });
    }
    res.status(200).json({ success: true, results });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ success: false, error: err.message, details: err });
  }
};
