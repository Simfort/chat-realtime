import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    friends: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
})

export default User