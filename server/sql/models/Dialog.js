import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const Dialog = sequelize.define('Dialog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userOne: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userTwo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
    }
})

export default Dialog