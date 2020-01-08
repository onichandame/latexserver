const path=require('path')
const fs=require('fs')
const fsp=fs.promises
const okitchen=require('okitchen')
const checkpath=require('checkpath')

const dft_jobs={
  name:'TableJobs',
  cols:{
    submitted_at:{
      type:'int',
      notnull:true
    },
    timeout:{
      type:'int',
      notnull:true,
      check:'timeout > 0'
    },
    project:{
      type:'text',
      notnull:true
    },
    engine:{
      type:'text',
      check:`engine LIKE 'xelatex' OR engine LIKE 'pdflatex'`
    },
    main:{
      type:'text',
      notnull:true
    },
    status:{
      type:'int',// -1: failed; 0: job done; 1: calculating; 2: received
      notnull:true,
      check:'status < 3'
    },
    started_at:{
      type:'int'
    },
    finished_at:{
      type:'int'
    }
  }
}

module.exports=function()
{
  return okitchen.init({datadir:path.resolve(__dirname,'asset')})
    .then(()=>{return initDB()})
    .then(()=>{return initDir()})
    .catch(e=>{console.log(e)})
}

function initDB(){
  return okitchen.db.addtable(dft_jobs)
    .then(()=>{return okitchen.db.checktable(dft_jobs)})
    .then(()=>{return okitchen.config.set('table',dft_jobs.name)})
}

async function initDir()
{
  const calcpath=path.resolve(await okitchen.config.get('root'),'calc')
  return okitchen.config.set('calcpath',calcpath)
    .then(()=>{return checkCalcPath()})

  function checkCalcPath()
  {
    return checkpath(calcpath,{type:'dir',permission:'w'})
      .catch(e=>{
        if(e.code=='ENOENT') return fsp.mkdir(calcpath)
        else throw e
      })
  }
}
