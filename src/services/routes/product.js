import express from 'express';
import {getProducts} from "../controllers/productController.js";

const router = express.Router();
router.get("/get", getProducts);

export default router;