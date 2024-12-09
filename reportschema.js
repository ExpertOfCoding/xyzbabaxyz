const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const reportSchema = new Schema(
    {
        classification:String,
        description:String,
        date:String,
        location_long:Number,
        location_lat:Number,
        approved:Boolean,
        fotourl:String,
        userid:String
    }
)

const Report = mongoose.model("report",reportSchema)
module.exports=Report