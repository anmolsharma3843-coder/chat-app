import mongoose from "mongoose";
const usersSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
     trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default:''
    },
     lastSeen: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});
export const User =mongoose.model("users", usersSchema);