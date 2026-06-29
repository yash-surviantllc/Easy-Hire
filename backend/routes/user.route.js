//  we get routers form express
import express from "express";
import { register, login, updateProfile, logout } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateProfile); // we are using isAuthenticated middleware to check if the user is authenticated or not before updating the profile

export default router;