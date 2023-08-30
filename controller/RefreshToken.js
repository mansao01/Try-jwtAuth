import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ msg: "Refresh token not found" });
        }

        const user = await UserModel.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).json({ msg: "Invalid token" });
            }

            const userId = user.id;
            const name = user.name;
            const email = user.email;

            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "30s"
            });

            res.json({ accessToken });
        });
    } catch (error) {
        res.status(400).json({ msg: "Error" });
    }
};