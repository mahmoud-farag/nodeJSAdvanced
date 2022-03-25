const redis =  require('redis');
const redisURL = 'redis://127.0.0.1:6379/';
const client = redis.createClient();
const util = require('util');

const mongoose =  require('mongoose');
const { stringify } = require('querystring');

const exec = mongoose.Query.prototype.exec;
  
mongoose.Query.prototype.redisCaching = function(props={}){
        this.useRedis=  true;
        this.keyParent = JSON.stringify(props.key || 'default')
        // to be able to make a chaining functions
        return this;
} 
mongoose.Query.prototype.exec =  async function(){

    if(!this.useRedis){
         return exec.apply(this, arguments);
    }
    //  redis custom logic
      // make redis return a promise
      client.get = util.promisify(client.get);
      client.hget = util.promisify(client.hget);

       const key = JSON.stringify(Object.assign({}, this.getQuery(), {collection: this.mongooseCollection.name}));
       const cachedBlogs = await client.hget(this.keyParent, key);
      if(cachedBlogs){
        const  document = JSON.parse(cachedBlogs);
           console.log('from redis')
        return Array.isArray(document)?
              document.map(doc=> new this.model(doc))
            :  
              new this.model(document)
       
      } 
    // original exec function implementation 
     const result = await exec.apply(this, arguments);
     client.hset(this.keyParent, key,JSON.stringify(result));
     console.log('added to redis')

   return result

}
module.exports = {
    clearCachedData(key){
          client.del(key);
    }
}




































































