const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

// UPDATE USER
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("Account as been updated")
        }catch(err) {
            return res.status(500).json(err)
        }
    }else {
        return res.status(403).json("You can update only your account")
    }
})

// DELETE USER 
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account as been deleted")
        }catch(err) {
            return res.status(500).json(err)
        }
    }else {
        return res.status(403).json("You can delete only your account")
    }
})

// GET USER 

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    }catch(err) {
        res.status(500).json(err)
    }
})

// FOLLOW USER

router.put('/:id/follow', async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            // user -> The person we are going to follow 
            // currentUser -> ME
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push: {following: req.params.id}})
                res.status(200).json(`${user.username} has been followed`)
            } else {
                res.status(403).json(`You already follow ${user.username} `)
            }

        }catch(err) {

        }
    }else {
        res.status(403).json("you can't follow yourself")
    }
})


// UNFOLLOW USER

router.put('/:id/unfollow', async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            // user -> The person we are going to follow 
            // currentUser -> ME
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull: {following: req.params.id}})
                res.status(200).json(`${user.username} has been unfollowed`)
            } else {
                res.status(403).json(`You don't follow ${user.username} `)
            }

        }catch(err) {

        }
    }else {
        res.status(403).json("you can't unfollow yourself")
    }
})



module.exports = router;