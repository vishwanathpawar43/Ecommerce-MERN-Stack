import express from "express";
import { userLogin, userRegister, userLogout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, adminGetUser, adminGetAllUsers, adminUpdateUserProfile, adminDeleteUser } from "../controllers/userController.js";
import { authorizedRoles, isAuthenticated } from "../middlerware/auth.js";

export const router=express.Router();

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/logout").get(userLogout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticated,getUserDetails);
router.route("/updatePassword").put(isAuthenticated,updatePassword);
router.route("/updateProfile").put(isAuthenticated,updateProfile);  


router.route("/admin/users").get(isAuthenticated,authorizedRoles("admin"),adminGetAllUsers);
router.route("/admin/user/:id")
.get(isAuthenticated,authorizedRoles("admin"),adminGetUser)
.put(isAuthenticated,authorizedRoles("admin"),adminUpdateUserProfile)
.delete(isAuthenticated,authorizedRoles("admin"),adminDeleteUser)


