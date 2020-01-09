const path=require('path')
const express = require('express')
const cookieparser=require('cookie-parser')

const init=require(path.resolve(__dirname,'init.js'))

const port=3011
/** @module App*/
const app = express()

app.use(cookieparser())
app.use(express.static(path.resolve(__dirname,'public')))

app.post('/',require(path.resolve(__dirname,'routes','new.js')))

init()
  .then(()=>{
    app.listen(port, function (){
      console.log('Listening on port '+port+'!')
    })
  })
