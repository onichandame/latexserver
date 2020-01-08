const spawn = require('child-process-promise').spawn;
const path=require('path')
const fs=require('fs-extra')

// Build frontend
spawn('npm',['run','build'],{cwd:path.resolve(__dirname,'frontend')})
  .then(()=>{console.log('frontend built')})
  .catch(e=>{terminate(e)})
  .then(()=>{return fs.copy(path.resolve(__dirname,'frontend','build'),path.resolve(__dirname,'public'))})
  .then(()=>{console.log('fontend installed')})
  .catch(e=>{terminate(e)})
