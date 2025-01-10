const express= require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../Models/User.js');
const dotenv=require('dotenv');
dotenv.config();

const router=express.Router();

const JWT_SECRET='23343rwrwerfrwfrsfvdfbvdsfvdgvdg';


router.post('/signup', async(req, res)=>{
    const {username,email,password}= req.body;
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists with this email.'})
        }

        const newUser=new User({
            username,
            email,
            password,
        })

        await newUser.save();
        res.status(201).json({message:'User registered successfully'});
    }
    catch(error){
        console.error('Error during signup:', error);  // Log the error for debugging
        res.status(500).json({ message: 'Failed to register user', error });
    }
});
 
router.get('/profile', async(req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }
        const decoded=jwt.verify(token, JWT_SECRET);
        const user=await User.findById(decoded.id, 'username email');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch(error){
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error })
    }
});

router.post('/login', async(req,res)=>{
    const {email,password} =req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({ message: 'User not found.' }); 
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid emil or password'});
        }

        const token=jwt.sign({
            id:user._id, email:user.email
        }, JWT_SECRET, {expiresIn:'1h'});

        res.cookie('token', token, {
            httpOnly:true,
            maxAge:3600000
        });
        res.status(200).json({message:'Login successful'});
    }
    catch(error){
        res.status(500).json({message:'Failed to login', error})
    }
})

router.post('/logout', (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message:'Logout successful.'});
});


module.exports=router;