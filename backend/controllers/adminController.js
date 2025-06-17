/*import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import productModel from "../models/productModel";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Credenciales Invalidas" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API de la lista de reservas
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Reserva Cancelada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//API agregar producto
const addProduct = async (req, res) => {
    try{
        
        const{name, description, category, fees} = req.body
        const imageFile = req.file
        // Revisar si toda la informacion esta
        if (!name || !description || !category || !fees || !imageFile) {
            return res.json({ success: false, message: "Faltan Datos" })
        }
        // Agregar imagen a cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const categoryData = {
            name,
            image: imageUrl,
            description,
            category,
            fees,
            date: Date.now()
        }

        const newProducto = new productModel(categoryData)
        await newProducto.save()
        res.json({ success: true, message: 'Producto Agregado' })
    }catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API todos los productos en el panel de admin
const allProduct = async (req, res) => {
    try {

        const product = await productModel.find({}).select('-name')
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API tener informacion del panel de admin
const adminDashboard = async (req, res) => {
    try {

        const producto = await productModel.find({})
        const user = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            producto: producto.length,
            appointments: appointments.length,
            usuarios: user.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addProduct,
    allProduct,
    adminDashboard
}
*/