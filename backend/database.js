import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.4', {dbName: 'Edunite'})

const userschema = new mongoose.Schema({
    username : {
        type: String,
        unique: false,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    password : String
})

const usermodel = mongoose.model("users", userschema)

console.log("MongoDB connected");


export default usermodel