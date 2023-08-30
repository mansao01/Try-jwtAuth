import express from "express";
import {getUsers, registerUser, loginUser} from "../controller/Users.js";
import {verifyToken} from "../middleware/VerifyToken.js";
import {refreshToken} from "../controller/RefreshToken.js";

const router = express.Router();

router.get("/v1/users",verifyToken, getUsers)
router.post("/v1/register",registerUser )
router.post("/v1/login",loginUser )
router.post("/v1/token",refreshToken )

export default router;