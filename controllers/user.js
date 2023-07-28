const User = require("../models/user")


exports.getUserById = (req, res, next, id) =>{
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user
        next()
    })
}


exports.getUser = (req, res) => {
    // TODO get back here for password
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}


exports.userUpdate = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: "You are not authorized to update this user!"
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No Order in this account"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = []
    // console.log("ORDRR",req.body)
    // console.log("AMOUNT",req.body.amount)
    // console.log("Tid",req.body.transaction_id)
    req.body.products.forEach((product) => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.amount,
            transaction_id: req.body.transaction_id
        })
    });

    //store this in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next()
        }
    )
}

exports.updateStudent = (req, res) => {
    User.findById(req.profile._id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        user.sem = req.body.sem
        user.dept = req.body.dept
        // console.log(user)
        user.save((err, u) => {
            if (err) {
                return res.status(400).json({
                    error: "NOT able to save user in DB"
                })
            }
            const { _id, username, email, role, sem, dept} = u
            return res.json({ profile : { sem, dept } })
        })
    })
}

exports.getStudents = (req, res) => {
    User.find({ role: 0 }).exec((err, stu) => {
        if(err || !stu){
            return res.status(400).json({
                error: "No Student found"
            })
        }
        return res.json(stu)
    })
}

// exports.getUsers = (req, res) => {
//     User.find().exec((err, users) => {
//         if(err || !users){
//             return res.status(400).json({
//                 error: "No users found"
//             })
//         }
//         return res.json(users)
//     })
// }