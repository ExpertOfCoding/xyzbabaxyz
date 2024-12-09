const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username:String,
        lastphoto:String,
        password:String,
        phototaken: Number,
        peoplehelped: Number,
        daystreak:Number,
        email:String,
        reports: Array,
        points: Number,
        siralama:Number,
        userpp:String
    }
)

const User = mongoose.model("user",userSchema)
module.exports=User