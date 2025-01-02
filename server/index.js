import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './routes.js'

const app = express()

app.use(routes)


app.listen(3000, () => console.log('http://localhost:3000'))