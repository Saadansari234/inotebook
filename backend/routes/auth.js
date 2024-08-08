const express = require("express")
const bcrypt = require('bcryptjs');
const { validationResult, body } = require('express-validator')
const User = require("../models/User")
const router = express.Router()
const jwt= require('jsonwebtoken')
const JWT_secret= 'saadisagoodb$oy'

//create a user using post using /api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {
    try {

        // if there are errors return bad request and error
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() });
        }
        // check if the user is already exist
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ error: "user with this emil already exist" })
        }

        // hash the password before saving in a real application
        const salt = await bcrypt.genSaltSync(10);
        const securePassword = await bcrypt.hashSync( req.body.password , salt);
        // reating new user if the user not already existed 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password:securePassword // Ensure you hash the password before saving in a real application
        })

        // 
        const data= {
            user:{
                id: user.id
            }
        }
        const AuthToken= jwt.sign(data, JWT_secret)
        console.log(AuthToken);
        res.json({AuthToken})
        // res.json(user)

    } catch (error) {
     console.error(error.message)
     res.status(500).send("some error occured")
    }
});

module.exports = router