const express= require("express")
const router= express.Router()

router.get('/',(req, res)=>{
    obj={
        name:"hello notes",
        number:67
    },
    res.json(obj)
})

module.exports= router