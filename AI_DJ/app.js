let express = require('express');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
let app = express()

app.use(express.static('./public'));

app.get('/', (req,res)=>{
    res.writeHead(200,{
        'Content-Type' : 'text/html'
       })
    res.sendFile('./public/index.html')
})
app.get('/download', (req, res)=>{
    const {val} = req.query
    ytdl(`${val}`)
  .pipe(fs.createWriteStream('video.mp4'));
  if(val){
    res.sendFile(__dirname+'/public/download.html')
  }
})

app.listen(5000, ()=>{
    console.log('port callback');
})