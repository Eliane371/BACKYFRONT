import express from 'express'
import { loginAdmin, appointmentsAdmin, appointmentCancel,addProduct,allProduct, adminDashboard } from '../controllers/adminController.js'
import { changeAvailablity } from '../controllers/productController.js';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js'

const adminRouter = express.Router()

adminRouter.post("/login", loginAdmin)
adminRouter.post('/add-product', upload.single('image'), addProduct)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.post("/all-products", authAdmin, allProduct)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)
export default adminRouter;
