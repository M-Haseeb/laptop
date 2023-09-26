const mongoose = require('mongoose');

// User schema
const secretSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    username:{
        type:String
    },
    secret:{
        type:Object
    },
    email:{
        type:String
    }


  },{timestamps:true})

const Secret=mongoose.model('secret',secretSchema);
module.exports =Secret;