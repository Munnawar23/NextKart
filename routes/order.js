import express from 'express'
import { createOrder, createTransaction, getOrdersUserById } from '../controllers/order.js';
const router = express.Router()

router.post("/transaction",createTransaction);
router.get("/:userId", getOrdersUserById)
router.get("/", createOrder)

export default router;