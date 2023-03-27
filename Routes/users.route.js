const express=require("express")

const {usermodel}=require("../models/user.models")

const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()

const userrouter=express.Router()

userrouter.post("/register",async(req,res)=>{

    const{email,password,name,gender,age,city}=req.body
    try{
        bcrypt.hash(password, 5, async(err, secure_password)=>{
            if(err){
                console.log(err)
            }else{
                const user=new usermodel({email,password:secure_password,name,gender,age,city})
                await user.save()
                res.send({"msg": "registered"})
            }
        });
    }catch(err){
        res.send({"msg":"error in registration"})
        console.log(err)
    }
})

userrouter.post("/login",async (req,res)=>{


    const {email,password}=req.body
    

    try{
        const user =await usermodel.find({email})
        const hashedpassword=user[0].password
        if(user.length>0){
            bcrypt.compare(password,hashedpassword, (err,result)=>{
                if(result){
                    const token =jwt.sign({userid:user[0]._id}, process.env.key)
                    res.send({"msg":"login successfull","token":token})
                }else{
                    res.send({"msg":"error in login or wrong credentials"})
                }
            })
        }else{
            res.send({"msg":"error in login or wrong credentials"})
        }
    }
    catch(err){
        res.send({"msg":"something went wrong"})
        console.log(err)
    }
})

module.exports={
    userrouter
}
