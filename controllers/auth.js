const User = require('../models/user')
const { check, validationResult } = require("express-validator")
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')


exports.signup = (req, res) => {

    // all the errors if raised in validation part will be binded into the req part
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            return res.status(400).json({
                error: "USER email already exists"
            })
        }
    })

    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "NOT able to save user in DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id,
            role: user.role
        })
    })
}


exports.signin = (req, res) => {
    const { email, password } = req.body

    // all the errors if raised in validation part will be binded into the req part
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "USER email does not exists"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }

        //create token
        const token = jwt.sign({ _id: user._id }, "mynameisjay")
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 })

        //send response to front end
        const { _id, name, email, role, sem, dept} = user
        return res.json({ token, user: { _id, name, email, role }, profile: { sem, dept } })
    })
}



exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "user signout successful"
    })
}


// protected routes
exports.isSignedIn = expressJwt({
    secret: "mynameisjay",
    userProperty: "auth"
    // requestProperty: "auth"
})


// custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next()
}

exports.isTeacher = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not TEACHER, Access denied"
        })
    }
    next()
}


