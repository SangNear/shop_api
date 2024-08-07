const router = require('express').Router()
const { verifyTokenAdmin } = require('./verifyToken')
const Product = require("../models/Product")


//GET PRODUCT BY TITLE
router.get("/:slug", async (req, res) => {
    try {
        const product = await Product.findOne({ title: req.params.slug })
        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
        return res.status(400).json("Can't find this product, something wrong!")
    }
})

//GET LIST PRODUCTS
router.get('/', async (req, res) => {
    try {
        const allProducts = await Product.find()
        return res.status(200).json(allProducts)
    } catch (error) {
        console.log(error);
        return res.status(400).json("Can't get all product, something wrong!")
    }
})


// CREATE A PRODUCT
router.post("/", verifyTokenAdmin, async (req, res) => {
    try {
        const { title, desc, img, categories, size, color, price } = req.body
        if (!title || !img || !categories) {
            return res.status(400).json("Title, image and category is not empty")
        }
        const titleIsExists = await Product.findOne({ title: title })
        if (titleIsExists) {
            return res.status(500).json("Title is exists! Choose another one")
        }
        const newProduct = await Product.create({
            title,
            desc,
            img,
            categories,
            size,
            color,
            price,
        })
        await newProduct.save()

        return res.status(200).json(newProduct)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Product create failed!")
    }
})

//UPDATE A PRODUCT
router.put("/", verifyTokenAdmin, async (req, res) => {

})

module.exports = router