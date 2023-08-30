import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({msg: "Access token not found"})
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.id
        next()
    }catch (e) {
        console.log(e)
        return res.status(401).json({msg: "Invalid token"})
    }
}