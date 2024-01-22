const mongoose = require("mongoose");

const postShema = mongoose.Schema({
    picture:String,

    caption:String,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RagisterData'
    },

    date:{
        type:Date,
        default:Date.now
    },
    likes:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"RagisterData"
        }
    ]
})

module.exports = mongoose.model('post', postShema)