import express from 'express'
import bodyParser from 'body-parser'
import User from './sql/models/User.js'

const routes = express.Router()

routes.use(bodyParser.urlencoded({ extended: false }))
routes.use(bodyParser.json())

routes.get('/', (req, res) => {
    console.log(req.body)
    res.send('hello')
})
routes.post('/', async (req, res) => {
    res.type('application/json')
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

export default routes