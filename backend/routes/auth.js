const express= require("express")
const router= express.Router()

router.get('/',(req, res)=>{
    obj={
        name:"thios",
        number:67
    },
    res.json(obj)
})

module.exports= router