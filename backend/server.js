import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
//import adminRoute from './routes/adminRoute.js'

//app config

const app=express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//middleware
app.use(express.json())
app.use(cors())

//api endpoints
//app.use('/api/admin',adminRoute)
//localhost:4000/api/admin/add-product

app.get('/', (req, res) => {
  res.send('API CONECTADO EXITOSAMENTE')
})

app.listen(port, () => console.log("Server running", port))