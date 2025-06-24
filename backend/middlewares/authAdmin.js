import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { aToken } = req.headers
        if (!aToken) {
            return res.json({ success: false, message: 'No Autorizado, intentalo de nuevo' })
        }
        const token_decode = jwt.verify(aToken, process.env.JWT_SECRET)
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'No Autorizado, intentalo de nuevo' })
        
        }
        next();
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'No Autorizado, intentalo de nuevo' })
    }
}

export default authAdmin;

