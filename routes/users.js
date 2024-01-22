const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb+srv://From_Data:From_Data@debjeet.9sx3pmn.mongodb.net/Backend-clone')
.then(()=>{
  console.log('Databass connected Succesfully.......');
}).catch((err)=>{
  console.log('Databass not connected.......',err);
})

const userShema = new mongoose.Schema(
  {
   username:{type:String},
   email:{type:String},
   name:{type:String},
   password:{type:String},
   Cpassword:{type:String},
   profileImage:{type:String},
   bio:{type:String},
   posts:[{type:mongoose.Schema.Types.ObjectId , ref:"post"}]
},
{timestamps:true})

userShema.plugin(plm);
module.exports = mongoose.model("RagisterData", userShema);

















// condt dd[

// import mongoose from "mongoose";
// import plm from "passport-local-mongoose";

// const URL= ""

// mongoose.connect(URL)
// .then(()=>console.log('Databass connected successfuly'))
// .catch((err)=>console.log(err))


// const UserShema = mongoose.Schema({
   


// },{});

// UserShema.plugin(plm);

// module.exports = mongoose.model();