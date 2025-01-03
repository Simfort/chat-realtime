import express from 'express'
import bodyParser from 'body-parser'
import User from './sql/models/User.js'
import { Op } from 'sequelize'
import addFriend from './controls/addFriend.js'
import getFriend from './controls/getFriend.js'
import cors from 'cors'
const routes = express.Router()

routes.use(bodyParser.urlencoded({ extended: false }))
routes.use(bodyParser.json())
routes.use(cors())

routes.get('/', (req, res) => {
    console.log(req.body)
    res.send('hello')
})
routes.post('/', async (req, res) => {
    const copyUser = await User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    })
    if (copyUser) {
        res.send(JSON.stringify('no'))
    } else {
        await User.create({
            username: req.body.username,
            password: req.body.password
        })
        res.send(JSON.stringify('yes'))
    }

})

routes.post('/friend', async (req, res) => {
    const users = await User.findAll({
        where: {
            username: req.body.name
        }
    })
    res.send(JSON.stringify(users))
})
routes.post('/addfriend', addFriend)
routes.post('/getfriend', getFriend)

export default routes