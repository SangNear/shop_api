const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
router.post("/register", async (req, res) => {
    const user = await User.findOne({ username: req.body.username })

    if (user) {
        return res.status(409).json("Username is already exists!Choose another one")
    }
    const newUser = new User({
        username: req.body.username,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
        email: req.body.email
    })

    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        console.log(error);
    }

})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return res.status(404).json("Username not exists!")
        }
        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8)


        if (hashedPass !== req.body.password) {
            return res.status(401).json("Password is not correct!")
        }
        const accessToken = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
            { expiresIn: "3d" }
        )

        const { password, ...rest } = user._doc

        return res.status(200).json({ ...rest, accessToken })
    } catch (error) {
        console.log(error);

        res.status(500).json(error)
    }
})

module.exports = router