import express from 'express'
import cors from 'cors';
import {getCreditHistory} from "../controllers/orderController.js";

const router = express.Router();
router.get("/get", cors(), getCreditHistory);

export default router;