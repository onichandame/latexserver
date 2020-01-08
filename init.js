const path=require('path')
const okitchen=require('okitchen')

module.exports=function()
{
  return okitchen.init({datadir:path.resolve(__dirname,'asset')})
    .catch(e=>{console.log(e)})
}
