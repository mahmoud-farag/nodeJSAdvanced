const cluster =  require('cluster');
const express = require('express');
const Worker = require('webworker-threads').worker



const app  =express();



app.get('/',(req,res)=>{
    const worker = new Worker(function(){
        // this is the object the the function property of
        this.onmessage = function(){
            //do some stuff
             let counter =0;
             while(counter<1e9){counter++} 
            // return back counter value after finishing            
             postMessage(counter)
        }
    })
    
    
    worker.postMessage()

    worker.onmessage=function(payload){
 
        res.send(''+payload.data)
    }
    
   
})

app.listen(3001, ()=>console.log('server up '))


