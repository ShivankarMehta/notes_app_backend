const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email'],
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})

userSchema.pre('save', async function(next){
    const user=this;
    if(!user.isModified('password')){
        return next();
    }

    try{
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);
        next();
    } catch(error){
        next(error);
    }
})

// Static method to compare entered password with the hashed password
userSchema.statics.comparedPassword= async function (enteredPassword, hashedPassword){
    return bcrypt.compare(enteredPassword,hashedPassword);
}

const User= mongoose.model('User', userSchema);

module.exports=User;

