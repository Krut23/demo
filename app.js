const express = require("express")
require("./connection")

const app= express()

app.get("/", (req,res)=>{
    res.send("good")
})



app.listen(3333,()=>{
    console.log("server run on 3333");
})


