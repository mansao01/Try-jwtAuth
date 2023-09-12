import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize

const UserModel = db.define("User",{
    name:{
        type: DataTypes.STRING,
        unique: true
    },
    email:{
        type: DataTypes.STRING,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
    },
    refresh_token:{
        type: DataTypes.TEXT,
    }
},{
    freezeTableName: true,
})

export default UserModel