const mongoose=require("mongoose")
const connection=mongoose.connect("mongodb+srv://veeresh:<password>@cluster0.lkb8reo.mongodb.net/users?retryWrites=true&w=majority")
module.exports={
    connection
}