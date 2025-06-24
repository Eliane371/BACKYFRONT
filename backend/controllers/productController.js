
import productModel from "../models/productModel.js";
import appointmentModel from "../models/appointmentModel.js";


// API para reservas del productos del panel
const appointmentsProd = async (req, res) => {
    try {

        const { p_Id } = req.body
        const appointments = await appointmentModel.find({ p_Id })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API para cancelar reservas del panel de productos
const appointmentCancel = async (req, res) => {
    try {

        const { p_Id, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.p_Id === p_Id) {
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

        const { p_Id, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === p_Id) {
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

        const { p_Id } = req.body

        const prodData = await productModel.findById(p_Id)
        await productModel.findByIdAndUpdate(p_Id, { available: !prodData.available })
        res.json({ success: true, message: 'Disponibilidad cambiada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API 
const productProfile = async (req, res) => {
    try {

        const { p_Id } = req.body
        const profileData = await productModel.findById(p_Id).select('-description')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to actualizar datos productos
const updateProdProfile = async (req, res) => {
    try {

        const { p_Id, fees, available } = req.body

        await productModel.findByIdAndUpdate(p_Id, { fees, available })

        res.json({ success: true, message: 'Informacion actualizada' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API 
const productDashboard = async (req, res) => {
    try {

        const { p_Id } = req.body

        const appointments = await appointmentModel.find({ p_Id })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let usuario = []

        appointments.map((item) => {
            if (!usuario.includes(item.userId)) {
                usuario.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            usuario: usuario.length,
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