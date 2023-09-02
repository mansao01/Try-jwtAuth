import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll({
            attributes: ["id", "name", "email"]
        })
        res.status(200).json({
            msg: "Success",
            data: users
        })
    } catch (error) {
        res.status(500).json({msg: error.message})
        console.log(error)
    }
}

export const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Password and confirm password do not match" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        res.status(200).json({ msg: "Registration successful" });
    } catch (error) {
        // Handle specific errors
        if (error.code === 11000) {
            // Duplicate key error (e.g., email already exists)
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Handle other errors
        res.status(400).json({ msg: "Registration failed due to an error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({where: {email}});

        if (!user) {
            return res.status(400).json({msg: "Email not found"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({msg: "Wrong password"});
        }

        const {id, name} = user;
        const accessToken = jwt.sign({id, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30s"
        });

        const refreshToken = jwt.sign({id, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "7d"
        });

        await UserModel.update({refresh_token: refreshToken}, {
            where: {id}
        });
        const response = {accessToken, refreshToken};
        res.status(200).json(response);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({msg: "Internal server error"});
    }
};


export const logoutUser = async (req, res) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(400).json({error: "Refresh token not provided"});
        }

        // Check if the user exists with the given refreshToken
        const user = await UserModel.findOne(
            {
                where: {refresh_token: refreshToken}
            });

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        await user.update({refresh_token: null});

        return res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.error("Error in logoutUser:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};


export const getProfile = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Access user ID from the request

        // Fetch logged-in user's data
        const loggedInUser = await UserModel.findByPk(loggedInUserId, {
            attributes: ['name', 'email']
        });

        if (!loggedInUser) {
            return res.status(404).json({msg: "Logged-in user not found"});
        }

        res.json({
            loggedInUserName: loggedInUser.name,
            loggedInUserEmail: loggedInUser.email
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({msg: "Internal server error"});
    }
};