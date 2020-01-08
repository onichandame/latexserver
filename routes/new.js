const express = require('express')
const fs=require('fs')
const fsp=fs.promises
const okitchen = require('okitchen')
const path = require('path')
const formidable=require('formidable')
const unzipper=require('unzipper')
const spawn=require('child-process-promise').spawn

var router=express.Router()

router.get('/',accept)

function accept(req,res)
{
  return parseRequest()
    .then(compile)
    .then(finalize)
    .catch(handleError)
    .then(okitchen.common.reply)

  function parseRequest()
  {
    return parseForm()
      .then(checkRequest)
      .then(registerRequest)

    function parseForm()
    {
      return new Promise(async (r,j)=>{
        let form=new formidable.IncomingForm()
        form.maxFileSize=1024*1024*1024*5
        form.uploadDir=await okitchen.config.get('calcpath')
        form.parse(req,(err,fields,files)=>{
          if(err) return j(1)
          return r({fields,files})
        })
      })
    }

    function checkRequest(form)
    {
      if(!(typeof form === 'object' && typeof form.fields === 'object' && form.files === 'object' && typeof form.files.input === 'object' && form.fields.main)) return Promise.reject(1)
      return Promise.resolve(form)
    }

    function registerRequest(form)
    {
      return register()
        .then(rename)

      async function register()
      {
        const row={}
        row.timeout=form.fields.timeout | 10000
        row.engine=form.fields.engine ? form.fields.engine : 'pdflatex'
        row.project=path.parse(form.files.input.name).name
        row.submitted_at=new Date().getTime()
        row.status=2
        return okitchen.db.insert(await okitchen.config.get('table'),row)
      }

      async function rename(id)
      {
        return fsp.rename(form.files.input.path,path.resolve(await okitchen.config.get('calcpath'),`${id}.zip`))
          .then(()=>{return id})
      }
    }
  }

  async function compile(id)
  {
    const zipfile=path.resolve(await okitchen.config.get('calcpath'),`${id.toString()}.zip`)
    const unzipdir=path.resolve(await okitchen.config.get('calcpath'),id.toString())
    if(typeof id !== 'number') return Promise.reject()
    return unzip()
      .then(run)

    function unzip()
    {
      return new Promise((r,j)=>{
        fs.createReadStream(zipfile)
          .pipe(unzipper.Extract({path:unzipdir}))
          .on('close',()=>{
            return fsp.unlink(zipfile)
          })
      })
    }

    async function run()
    {
      const {engine,main}=await okitchen.db.selectOne(await okitchen.config.get('table'),['engine','main'],`rowid=${id}`)
      return okitchen.db.update(await okitchen.config.get('table'),{started_at:new Date().getTime(),status:1},`rowid=${id}`)
        .then(()=>{return spawn('latexmk',[`--${engine}`,main],{cwd:unzipdir,env:process.env})})
        .then(async ()=>{return okitchen.db.update(await okitchen.config.get('table'),{status:0,finished_at:new Date().getTime()},`rowid=${id}`)})
        .then(()=>{return id})
        .catch(e=>{
          return okitchen.logger.warn(`${JSON.stringify(e)} caused compilation failure`)
            .then(async ()=>{return okitchen.db.update(await okitchen.config.get('table'),{status:-1,finished_at:new Date().getTime()})})
            .then(()=>{throw e})
        })
    }
  }

  async function finalize(id)
  {
    if(typeof id !== 'number') return Promise.reject()
    const filepath=path.resolve(await okitchen.config.get('calcpath'),id.toString(),`${path.parse((await okitchen.db.selectOne(await okitchen.config.get('table'),['main'],`rowid=${id}`)).main).name}.pdf`)
    res.status(200)
    res.file=filepath
  }

  function handleError(flag)
  {
    if(flag === 1){
      res.status(400).body='form not valid'
    }else{
      res.status(500).body=`server internal error: ${typeof flag === 'string' ? flag : JSON.stringify(flag)}`
    }
  }
}

module.exports=router
