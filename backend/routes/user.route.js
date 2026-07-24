import express from "express";
import { register, login, updateProfile, logout, refreshToken, toggleSaveJob, getSavedJobs } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, profileUploads } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout).post(logout);
router.route("/profile/update").post(isAuthenticated, profileUploads, updateProfile); // we are using isAuthenticated middleware to check if the user is authenticated or not before updating the profile
router.route("/refresh").post(refreshToken);
router.route("/saved/toggle/:id").post(isAuthenticated, toggleSaveJob);
router.route("/saved/get").get(isAuthenticated, getSavedJobs);

export default router;