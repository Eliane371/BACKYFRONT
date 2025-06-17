/*import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API para registro de usuario
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // verificar datos de entrada
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Informacion Faltante' })
        }

        // validar formato correo
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Ingresar un correo valido" })
        }

        // validar clave fuerte
        if (password.length < 8) {
            return res.json({ success: false, message: "Ingresa una contrasena fuerte" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API para login de usuario
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Usuario no existe" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Credenciales invalidas" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API para obtener perfil de usuario
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dateb, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dateb || !gender) {
            return res.json({ success: false, message: "Datos Faltantes" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dateb, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Perfil Actualizado' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API para reservar 
const bookAppointment = async (req, res) => {

    try {

        const { userId, p_Id, slotDate, slotTime } = req.body
        const prodData = await productModel.findById(p_Id).select("-password")

        if (!prodData.available) {
            return res.json({ success: false, message: 'No disponible' })
        }

        let slots_booked = prodData.slots_booked

        // revisar disponibilidad 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Cupo no disponible' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete prodData.slots_booked

        const appointmentData = {
            userId,
            p_Id,
            userData,
            prodData,
            amount: prodData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // guardar nuevos slots
        await doctorModel.findByIdAndUpdate(p_Id, { slots_booked })

        res.json({ success: true, message: 'Reserva Exitosa' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API para cancelar
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verificar si la cita existe
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Action no autorizada' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // liberar 
        const { p_Id, slotDate, slotTime } = appointmentData

        const prodData = await productModel.findById(docId)

        let slots_booked = prodData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await productModel.findByIdAndUpdate(p_Id, { slots_booked })

        res.json({ success: true, message: 'Reserva Cancelada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API listar reservas
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Reserva Cancelada o no encontrada' })
        }

        // Crear opciones
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation de una order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API berificar pago
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'pagado') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Pagado Exitosamente" })
        }
        else {
            res.json({ success: false, message: 'Pago Fallado' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Pago Exitoso' })
        }

        res.json({ success: false, message: 'Pago Fallado' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
}

*/