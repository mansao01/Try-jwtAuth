import express from 'express';
import db from './config/Database.js';
import UserModel from './models/UserModel.js';
import dotEnv from 'dotenv';
import UserRoute from './routes/UserRoute.js';
dotEnv.config()
const app = express();

try{
    await db.authenticate()
    console.log("Database connected")
    // await UserModel.sync()
}catch (error){
    console.log(error)
}

app.use(express.json())
app.use(UserRoute)


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Server start in " + PORT + " Port")
})