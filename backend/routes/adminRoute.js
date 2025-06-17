/*import express from 'express'
import { loginAdmin, appointmentsAdmin, appointmentCancel,addProduct,allProduct, adminDashboard } from '../controllers/adminController.js'
import { changeAvailablity } from '../controllers/productController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middlewares/multer.js'

const adminRoute = express.Router()

adminRouter.post("/login", loginAdmin)
adminRouter.post('/add-product', upload.single('image'), addProduct)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-products", authAdmin, allProduct)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)
export default adminRoute;
*/