const express = require('express')
const router = express()


const { getUserById, getUser, userUpdate, updateStudent, getStudents  } = require("../controllers/user")
const { isSignedIn, isAuthenticated,  } = require("../controllers/auth")


router.param("userId", getUserById)


router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

router.post("/user/update/:userId", isSignedIn, isAuthenticated, updateStudent)

router.put("/user/:userId", isSignedIn, isAuthenticated, userUpdate)

router.get("/students",  getStudents)

// router.get("/users",  getUsers)
module.exports = router