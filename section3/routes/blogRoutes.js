const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCach = require('../middlewares/cleanCach');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
     
      /** way 1 to implement redis */

    // const redis = require('redis');
    // const redisURL = 'redis://127.0.0.1:6379/'
    // const client = redis.createClient(redisURL);
    // const util = require('util');
    // client.get =  util.promisify(client.get);

  // try {
  //   const cachedBlogs = await  client.get(req.user.id);  
  //   if(cachedBlogs){

  //     console.log('served from redis server')
  //     return res.send(cachedBlogs)
  //   }
  // } catch (error) {
  //   console.log(error);
  // } 
   const blogs = await Blog.find({ _user: req.user.id }).redisCaching({key:req.user.id});
    res.send(blogs);

    //  client.set(req.user.id, JSON.stringify(blogs))

  });

  app.post('/api/blogs', requireLogin,cleanCach, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
 
  });
};
