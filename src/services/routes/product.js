import express from 'express';
import cors from 'cors';
import {getProducts} from "../controllers/productController.js";

const router = express.Router();
router.get("/get", cors(), getProducts);

export default router;