const express = require('express')
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')

dotenv.config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser : true, useUnifiedTopology: true}, ()=> {
    console.log('Connected to DB')
} )


// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is up and running')
})
