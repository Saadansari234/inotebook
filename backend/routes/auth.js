const express = require("express")
const bcrypt = require('bcryptjs');
const { validationResult, body } = require('express-validator')
const User = require("../models/User")
const router = express.Router()
const jwt = require('jsonwebtoken')
const JWT_secret = 'saadisagoodb$oy'
const fetchUser= require('../Middleware/fetchuser')

//Route-1: create a user using post using /api/auth/createuser : no login required
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
        const securePassword = await bcrypt.hashSync(req.body.password, salt);
        // reating new user if the user not already existed 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword // Ensure you hash the password before saving in a real application
        })

        // generating auth token through jwt authentication where after hashing password and getting all information of user it comes will go to next step of authentication
        const data = {
            user: {
                id: user.id
            }
        }
        const AuthToken = jwt.sign(data, JWT_secret)
        console.log(AuthToken);
        res.json({ AuthToken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error")
    }
});




//Route-2: login a user using post using /api/auth/login : no login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    const { email, password } = req.body
    try {
        // asyncronasly finding that one credential which user entering for login
        const user = await User.findOne({ email });

        // if tha data user is not there it will return error .its comparing email and password
        if (!user) {
            return res.status(400).json({ error: "try to ligin with correct credentials" })
        }
        // will compare user login password hash with tored user password hash.
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({ error: "try to ligin with correct credentials" })

        }
        // syncrounasly afetr comparing give his auth token to excess his page
        const data = {
            user: {
                id: user.id
            }
        }
        const AuthToken = jwt.sign(data, JWT_secret)
        // console.log(AuthToken);
        res.json({ AuthToken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error")
    }

});



//Route-3: Get loggedin users details using post using /api/auth/getuser :  login required
router.post('/getuser', fetchUser ,async (req, res) => {
    try {
    userId= req.user.id
   const user= await User.findById(userId).select("-password")
   res.send(user)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error")
    }

});

module.exports = router



