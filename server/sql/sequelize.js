import { Sequelize } from "sequelize";

const sequelize = new Sequelize('chatBase', 'root', '', {
    dialect: 'mysql',
    dialectOptions: {

    }
})
try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
} catch (e) {
    console.error('Disconnected to base:', e)
}
export default sequelize