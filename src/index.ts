import * as path from 'path'
import * as express from 'express'
import * as cookieparser from 'cookie-parser'
import * as config from 'config'

import app from './routes/app'

import init from './init'

const port : number = config.get('port')
const root : string = config.get('root')

const app = express()

app.use(cookieparser())
app.use(express.static(path.resolve(root,'public')))

app.post('/', app)

init()
.then(()=>{
  app.listen(port)
})
