import express from 'express'
import {getCreditHistory} from "../controllers/orderController.js";

const router = express.Router();
router.get("/get", getCreditHistory);

export default router;