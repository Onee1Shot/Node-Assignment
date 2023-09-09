import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import Employee from '../model/employeeModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkAuth from '../middleware/JwtToken.js';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'dnnb642du', 
    api_key: '152194549555959', 
    api_secret: 'Kvzt1hFbKAE3MbZlCf_7x5wB2p4' 
  });

//get all request
router.get('/',checkAuth,(req,res,next)=>{
    Employee.find()
    .then(result=>{
        res.status(200).json({
            Employee:result
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

// get request by id
router.get('/:id',checkAuth,(req,res,next) => {
    console.log(req.params.id);
    Employee.findById(req.params.id)
    .then(result=>{
        res.status(200).json({
            employee:result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

// post request
router.post('/register',(req,res,next)=>{
    console.log(req.body);
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
        bcrypt.hash(req.body.password,10,(err,hash) =>{
            if (err)
            {
                return res.status(500).json({
                    error:err
                })
            }
            else
            {
                 const employee = new Employee({
                 _id:new mongoose.Types.ObjectId,
                 name : req.body.name ,
                 password :  hash ,
                 email  : req.body.email,
                 mobile : req.body.mobile,
                 profilePicture : result.url
            })
            employee.save()
            .then(result => {
                res.status(200).json({
                    newEmployee:result
                })
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                    })
                })
            }
            })
    })
})


router.post('/login',(req,res,next) => {
    Employee.find({email:req.body.email})
    .exec()
    .then(Employee => {
        if(Employee.length < 1)
        {
            return res.status(401).json({
                message : 'Employee Does Not Exist'
            })
        }
        bcrypt.compare(req.body.password,Employee[0].password,(err,result)=>{
            if(!result)
            {
                return res.status(401).json({
                    message:'Password Does not Match'
                })
            }
            if(result)
            {
                const token = jwt.sign({
                    email:Employee[0].email,
                    name:Employee[0].name,
                    mobile:Employee[0].mobile
                },
                'verifytoken',
                {
                    expiresIn:"2h"
                }
                );
                res.status(200).json({
                    email:Employee[0].email,
                    name:Employee[0].name,
                    mobile:Employee[0].mobile,
                    token:token
                })
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            err:err
        })
    })
})

        
//    delete request
router.delete('/:id', checkAuth,(req, res, next)=> {
    Employee.deleteOne({_id:req.params.id})
    .then(result => {
        res.status(200).json({
            message:"employee deleted",
            result:result
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
})

// put request
router.put('/:id',checkAuth,(req,res,next) => {
    Employee.findOneAndUpdate({_id:req.params.id},{
        $set:{
            name : req.body.name ,
            email  : req.body.email,
            mobile : req.body.mobile,
            password :  req.body.password
        }
    })
    .then(result => {
        res.status(200).json({
            updated_employee:result
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})


export default router;