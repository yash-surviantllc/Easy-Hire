import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, isAuthorized("candidate"), applyJob);
router.route("/get").get(isAuthenticated, isAuthorized("candidate"), getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, isAuthorized("recruiter"), getApplicants);
router.route("/status/:id/update").post(isAuthenticated, isAuthorized("recruiter"), updateStatus);

export default router;