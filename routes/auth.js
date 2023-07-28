const express = require('express')
const router = express.Router()
const { check, validationResult } = require("express-validator")
const { signout, signup, signin, isSignedIn } = require("../controllers/auth")


router.post("/signup", [
    // check("name", "username should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({ min: 3 })
], signup)

router.post("/signin", [
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({ min: 3 })
], signin)

router.get("/signout", signout)

router.get("/test", isSignedIn, (req, res) => {
    console.log(req.auth)
    res.send("successful")
})

module.exports = router