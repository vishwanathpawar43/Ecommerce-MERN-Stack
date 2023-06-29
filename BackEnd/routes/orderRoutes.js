import  express from 'express';
import { createOrder, deleteOrder, getAllOrders, getMyOrders, getSingleOrder, updateOrder } from '../controllers/orderController.js';
import {isAuthenticated,authorizedRoles} from '../middlerware/auth.js'

export const router=express.Router();

router.route("/orders/new").post(isAuthenticated,createOrder);
router.route("/orders/my").get(isAuthenticated,getMyOrders);
router.route("/orders/:id").get(isAuthenticated,getSingleOrder);

router.route("/admin/orders").get(isAuthenticated,authorizedRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticated,authorizedRoles("admin"),updateOrder)
.delete(isAuthenticated,authorizedRoles("admin"),deleteOrder);