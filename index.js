const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const dotenv = require('dotenv')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')

dotenv.config()
app.use(express.json())



mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connection Successfully!");
    })
    .catch((error) => {
        console.log(error);
    })




app.use('/api/user', authRoute)
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})