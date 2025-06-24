
import productModel from "../models/productModel.js";
import appointmentModel from "../models/appointmentModel.js";


// API para reservas del productos del panel
const appointmentsProd = async (req, res) => {
    try {

        const { _id } = req.body
        const appointments = await appointmentModel.find({ _id })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API para cancelar reservas del panel de productos
const appointmentCancel = async (req, res) => {
    try {

        const { _id, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData._id === _id) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Reserva Cancelada' })
        }

        res.json({ success: false, message: 'Reserva Cancelada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { _id, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData._id === _id) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Reserva Completada' })
        }

        res.json({ success: false, message: 'Reserva Cancelada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API todos los productos de frontend
const productList = async (req, res) => {
    try {

        const product = await productModel.find({})
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API cambiar disponibilidad desde el panel
const changeAvailablity = async (req, res) => {
    try {

        const { _id } = req.body

        const productData = await productModel.findById(_id)
        await productModel.findByIdAndUpdate(_id, { available: !productData.available })
        res.json({ success: true, message: 'Disponibilidad cambiada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API 
const productProfile = async (req, res) => {
    try {

        const { _id } = req.body
        const profileData = await productModel.findById(_id).select('-description')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to actualizar datos productos
const updateProdProfile = async (req, res) => {
    try {

        const { _id, fees, available } = req.body

        await productModel.findByIdAndUpdate(_id, { fees, available })

        res.json({ success: true, message: 'Informacion actualizada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API 
const productDashboard = async (req, res) => {
    try {

        const { _id } = req.body

        const appointments = await appointmentModel.find({ _id })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let user = []

        appointments.map((item) => {
            if (!user.includes(item.userId)) {
                user.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            user: user.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    appointmentsProd,
    appointmentCancel,
    changeAvailablity,
    productList,
    productProfile,
    appointmentComplete,
    updateProdProfile,
    productDashboard
}