// this folder contains business login for user related opertaions like auth , profile setting and updations

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// register user- also used in route
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        };
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "User registered successfully , Account created successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors).map(val => val.message).join(', '),
                success: false
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found, Incorrect email or password",
                success: false
            });
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Incorrect role or Account doest not exist with current role",
                success: false
            });
        };

        const tokenData = {
            userId: user._id  //fetched from database
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullName}`,
            user, // user data from the database
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

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' }).json({
            message: "Logout successfully",
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
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body;
        const file = req.file; // resume file will come here

        //cloudinary integration will come here for resume file upload

        // const skillsArray = skills.split(",");
        const skillsArray = skills ? skills.split(",") : [];

        const userId = req.userId; //userid is required to update the profile , middleware authentication
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }
        //updating user profile data , we used if condition because during updaation user can update any field or all fields, so we need to check if the field is present or not
        if (fullName) user.fullName = fullName
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        //resume will come later here...
        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        });

    } catch (error) {
        console.log(error);
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