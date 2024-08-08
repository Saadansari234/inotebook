const express = require("express")
const { validationResult, body } = require('express-validator')
const User = require("../models/User")
const router = express.Router()

//create a user using post 
router.post('/', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password // Ensure you hash the password before saving in a real application
    })
        .then(user => res.json(user))
        .catch(err => {
            console.log(err)
            res.json({ error: "enter a unique value for email", message: err.message })
        })


});

module.exports = router