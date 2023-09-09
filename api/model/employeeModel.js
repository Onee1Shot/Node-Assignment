import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    mobile:Number,
    profilePicture:String,
    password:String
})

export default mongoose.model('Employee',employeeSchema);
