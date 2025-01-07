const mongoose= require('mongoose');

const noteSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        default:Date.now,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    color:{
        type:String, 
        default:'#000000'
    }
});

const Note= mongoose.model('Note', noteSchema)

module.exports=Note;