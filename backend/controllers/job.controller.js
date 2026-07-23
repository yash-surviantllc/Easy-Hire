import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

// when admin post a job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.userId; //userid is required to post the job , middleware authentication

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: "Invalid companyId",
                success: false
            });
        }


        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error creating job:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors).map(val => val.message).join(', '),
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// for candidate to get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company",

        }).sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Jobs fetched successfully",
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// for candidate to apply for job and get the job by id
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications" //company old ref
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        };
        return res.status(200).json({
            message: "Job fetched successfully",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

//the jobs created by admin
export const getAdminJobs = async (req, res) => {
    try {
        // it gets the admin id of the logged in admin , it help to find data for unique admins
        const adminId = req.userId;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Jobs fetched sucessfully",
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

