import express from "express";
import { registerCompany, getCompany, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, isAuthorized("recruiter"), registerCompany);
router.route("/get").get(isAuthenticated, isAuthorized("recruiter"), getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, isAuthorized("recruiter"), updateCompany);

export default router;