import express from 'express';
import { getAllProducts,createProduct, updateProduct,deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteProductReview, adminGetAllProducts } from '../controllers/productController.js';
import { isAuthenticated,authorizedRoles } from '../middlerware/auth.js';

export const router=express.Router();

// admin
router.route("/admin/products").get(isAuthenticated,authorizedRoles("admin"),adminGetAllProducts);

router.route("/admin/products/new").post(isAuthenticated,authorizedRoles("admin"),createProduct);
  
router.route("/admin/products/:id")
.put(isAuthenticated,authorizedRoles("admin"),updateProduct)
.delete(isAuthenticated,authorizedRoles("admin"),deleteProduct)

// user
router.route("/products").get(getAllProducts);

router.route("/products/:id").get(getProductDetails);

router.route("/review").put(isAuthenticated,createProductReview);


router.route("/admin/reviews").get(getProductReviews).delete(isAuthenticated,deleteProductReview);
