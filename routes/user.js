const { verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken')
const User = require("../models/User")
const router = require('express').Router()

router.get("/:slug", verifyTokenAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.slug });
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({ message: "User not found" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get("/", verifyTokenAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password')
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Something wrong!")

    }
})

router.put("/:id", verifyTokenAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

        console.log("userupdated:", updateUser);

        res.status(200).json(updateUser)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        const userDelete = await User.findByIdAndDelete(req.params.id)
        return res.status(201).json(`${userDelete.username} is deleted`)
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router