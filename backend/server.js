import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import productRouter from './routes/productRoute.js'
import adminRouter from "./routes/adminRoute.js"
import userRouter from "./routes/userRoute.js"
//app config

const app=express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//middleware
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/products', productRouter)
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
//localhost:4000/api/admin/add-product

app.get('/', (req, res) => {
  res.send('API CONECTADO EXITOSAMENTE')
})

app.listen(port, () => console.log("Server running", port))