const cluster =  require('cluster');



// check if index.js is the first node instance(the master/ the cluster manager)
if(cluster.isMaster){
    // if index.js it the manager then fork(create node instance/child) 
    console.log(cluster.isMaster)

   cluster.fork()
}else{
     
    // start execute the app if its a  child node instance
    console.log(cluster.isMaster)
    const express = require('express');

    
const app  =express();


function doWork(duration){
    const start = Date.now();

    while(Date.now()-start < duration){}
}

app.get('/',(req,res)=>{
    doWork(4000)
    res.send('Hi there');
})

app.listen(3000, ()=>console.log('server up '))


}