const Sequelize = require('sequelize');
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const Signup = async (req,res)=>{
    const userExists = await Users.findOne({
        where :{userName: req.body.userName}
    }) 
    if(userExists){
        res.status(403).json({Message: "user already exists"})
    }
    else{
        let { userName, password }= req.body
        const hash = bcrypt.hashSync(password, 10)
        password = hash
        await Users.create({userName,password})
        .then((user)=>{
            res.status(200).json({Message:`user created: ${user.userName}`});
        })
    }       
}

const login = (req,res)=>{
    Users.findOne({
        where:{
            userName: req.body.userName
        }
    })
    .then(user =>{
        if(bcrypt.compareSync(req.body.password,user.password)){
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: 9999

            })
            res.cookie("t",token,{expire: new Date()+9999})
            res.json({token: token})
        }
        else{
            res.status(400).json({message:"User Name or Password invalid"})
        }
    })
}

const requireSignin = expressJwt({
    secret: process.env.SECRET_KEY,
    userProperty: "auth"
})

const bleh = (req,res)=>{
    res.status(200).json({message:"hell yeah"});
}

module.exports = {Signup, login, bleh,requireSignin};