const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const delete_request_Schema = new Schema(
    {
        email:String,
        token:String
    }
)

const Delete_Request = mongoose.model("deleterequest",delete_request_Schema)
module.exports=Delete_Request