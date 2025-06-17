/*import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    phone:{type:String, default:'00000000000'},
    address:{type:Object, default:{line1:'',line2:''}},  
    image:{type:String, default:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik04IDdDOS42NTY4NSA3IDExIDUuNjU2ODUgMTEgNEMxMSAyLjM0MzE1IDkuNjU2ODUgMSA4IDFDNi4zNDMxNSAxIDUgMi4zNDMxNSA1IDRDNSA1LjY1Njg1IDYuMzQzMTUgNyA4IDdaIiBmaWxsPSIjMDAwMDAwIi8+DQo8cGF0aCBkPSJNMTQgMTJDMTQgMTAuMzQzMSAxMi42NTY5IDkgMTEgOUg1QzMuMzQzMTUgOSAyIDEwLjM0MzEgMiAxMlYxNUgxNFYxMloiIGZpbGw9IiMwMDAwMDAiLz4NCjwvc3ZnPg=="},
    gender:{type:String, default:"Not Selected"},
    dateb:{type:String,default:"Not Selected"}
})

const userModel = mongoose.model.user || mongoose.model('user', productSchema)

export default userModel
*/