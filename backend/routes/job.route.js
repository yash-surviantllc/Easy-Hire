import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, isAuthorized("recruiter"), postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, isAuthorized("recruiter"), getAdminJobs);
router.route("/get/:id").get(getJobById);

export default router;