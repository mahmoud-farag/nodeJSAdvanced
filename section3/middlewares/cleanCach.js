const {clearCachedData}= require('../services/redis');



module.exports =async function  (req,res,next){
     await next()
    clearCachedData(req.user.id)
}