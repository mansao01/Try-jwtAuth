import express from "express";
import {getUsers, registerUser, loginUser,logoutUser, getProfile} from "../controller/Users.js";
import {verifyToken} from "../middleware/VerifyToken.js";
import {refreshToken} from "../controller/RefreshToken.js";
import {authMiddleware} from "../middleware/Auth.js";
const router = express.Router();

router.get("/v1/users",verifyToken, getUsers)
router.get("/v1/profile",authMiddleware, getProfile)
router.post("/v1/register",registerUser )
router.post("/v1/login",loginUser )
router.post("/v1/logout",logoutUser )
router.post("/v1/token",refreshToken )

export default router;