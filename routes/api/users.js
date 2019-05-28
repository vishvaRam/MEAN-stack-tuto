const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../Models/User');
const gravator = require('gravator');
const keys = require('../../config/key');
const jwt = require('jsonwebtoken');
const passport = require('passport');


// @route   api/user/test
// @access  Public
router.get('/test',(req,res)=>{
    res.send("User page");
});


// @route   api/user/register
// @access  Public
router.post('/register',(req,res)=>{
    User.findOne({email:req.body.email})
        .then(user =>{
            if(user){
                return res.status(400).json({email:"Email already exists"});
            }
            else{
                // Gravator 
                // const avatar = gravator.url(req.body.email);

                // Creating new User
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    //avatar,
                    password: req.body.password
                });

                // Hashing Password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) console.log(err);
                        newUser.password = hash;
                        newUser.save()
                            .then(user=>res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
});

// @route   api/user/login
// @access  Public
router.post('/login',(req,res)=>{

    const email = req.body.email;
    const password = req.body.password;

    // Find User 
    User.findOne({email:email})
    .then(user =>{
        // Check the user in DB
        if(!user){
          return  res.status(400).json({email:"Email not found"});
        }

        bcrypt.compare(password,user.password)
        .then(isTrue=>{
            if(isTrue){

                // Payload
                const payload = {id:user.id, name:user.name};

                // JWT
                jwt.sign( payload, keys.Token, { expiresIn: 6900 },(err,token)=>{
                    res.json({
                        success : "Token Creater",
                        Token : 'bearer '+ token
                    });
                    if(err){
                        console.log(err);
                    }
                });

            }
            else{
                return res.status(404)
                          .json({password:"Password is in correct"});
            }
        })
    })
});



// @route   api/user/current
// @access  Private
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        user:req.user.name,
        email:req.user.email
    });
});

module.exports= router;