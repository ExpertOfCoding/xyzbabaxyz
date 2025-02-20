const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username:{type:String,unique:true,required:true},
        lastphoto:String,
        password:String,
        phototaken: Number,
        peoplehelped: Number,
        daystreak:Number,
        email:{type:String,unique:true,required:true},
        reports: Array,
        points: Number,
        siralama:Number,
        userpp:String,
        league:String
    }
)

const User = mongoose.model("user",userSchema)
module.exports=User