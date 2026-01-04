import { Router } from "express";
import { sendSegmentedEmail } from "../controller/email.controller.js";

const router = Router();

router.post("/send-segmented-email", sendSegmentedEmail);

export default router;
