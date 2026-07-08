import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        // fetching the logged in user id from the request object
        const userId = req.userId; // authentication middleware sets req.userId
        // const {id: jobId} = req.params;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // checck if the job exists 
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        // add the application to the job's applications array
        job.applications.push(newApplication._id);// applications =schema field in job model
        await job.save();
        return res.status(201).json({
            message: "Application submitted successfully",
            success: true,
            data: newApplication
        });
    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid job ID format",
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

//when fetching all the applied jobs
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.userId; // authentication middleware sets req.userId
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company', // nested populate to find company details of the job-> check in job model
                options: { sort: { createdAt: -1 } },
            }
        });

        if (!application) {
            return res.status(404).json({
                message: "No applied jobs found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Applied jobs fetched successfully",
            application,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


//admin dekhega kitna user ne apply kiya h
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
                select: '-password'
                //nested populate to find applicant details of the application-> check in application model
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
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

//status 
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body; // status can be "pending", "accepted", "rejected" , read application.model.js
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        };

        // find the application by application id and update the status
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        //update the status of the application
        application.status = status.toLowerCase(); // convert the status to lowercase to avoid case sensitivity issues
        await application.save();
        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid application ID format",
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};