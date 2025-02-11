import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {dbName: 'Edunite'})

const courseschema = new mongoose.Schema({
    cname : {
        type : String,
        required : true,
        trim : true
    },
    category : {
        type : String,
        required : true,
        trim : true
    },
    faculty: {
        type : String,
        required : true
    },
    created : {
        type : Date,
        default : Date.now
    }
})

const coursemodel = mongoose.model("courses", courseschema)

export default coursemodel