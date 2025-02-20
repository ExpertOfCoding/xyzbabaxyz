const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const reportdeleterequestSchema = new Schema(
    {
        totalusers:Number,
        classification:String,
        description:String,
        date:String,
        location_long:Number,
        location_lat:Number,
        fotourl:String,
        rid:String,
        users:Array,
    }
)

const RDelete = mongoose.model("reportdeleterequest",reportdeleterequestSchema)
module.exports=RDelete