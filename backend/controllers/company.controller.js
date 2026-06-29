import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        let existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "Company already exists with this name",
                success: false
            });
        }

        const company = await Company.create({
            name: companyName,
            userId: req.userId // we are storing the user id in the company model so that we can use it to get the companies created by the user
        });

        return res.status(201).json({
            message: "Company registered successfully",
            company,
            success: true

        });

    } catch (error) {
        console.error("Error registering company:", error);
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.userId; // we are getting the user id from the request object which is set in the isAuthenticated middleware, only authenticated user can access this route
        const companies = await Company.find({ userId }); // we are getting the companies created by the user
        if (!companies) {
            return res.status(404).json({
                message: "No companies found for this user",
                success: false
            });
        }
        return res.status(200).json({
            message: "Companies found",
            companies,
            success: true
        });
    } catch (error) {
        console.error("Error getting company:", error);
    }
}
//get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company found",
            company,
            success: true
        });
    } catch (error) {
        console.error("Error getting company by ID:", error);
    }
}

//update company
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file; // company logo file will come here

        //cloudinary integration will come here for company logo file upload

        const updateData = { name, description, website, location };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company updated successfully",
            company,
            success: true
        });

    } catch (error) {
        console.error("Error updating company:", error);
    }
}        