const express=require('express');
const Note= require('../Models/Note.js');
const { mongoose } = require('mongoose');
const router=express.Router();
const authenticateToken=require('../MiddleWare/authMiddleWare.js')

router.post('/notes', authenticateToken, async (req,res)=>{
    const {title,content} =req.body;

    const newNote= new Note({
        title,
        content,
        user:req.user.id,
    });

    try{
        await newNote.save();
        res.status(201).json(newNote);
    }
    catch(error){
        res.status(500).json({message:"Failed to create note", error});
    }
});

router.get('/notes',authenticateToken,async(req,res)=>{
    try{
        const notes=await Note.find({user:req.user.id}).populate('user', 'username email');
        res.status(200).json(notes);
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch notes', error });
    }
})


router.get('/notes/:id', authenticateToken, async(req,res)=>{
    try{
        const {id}= req.params;
        if(!monggose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:'Invalid ID format'});
        }
        const note=await Note.findOne({_id:id, user:req.user.id});
        if(!note){
            return res.status(404).json({message:'Note not found'});
        }
        res.status(200).json(note);
    }
    catch(error){
        res.status(500).json({ message: 'Failed to fetch note', error });
    }
})

// Express route example for PUT /api/notes/:id
router.put('/notes/:id',authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const updatedNote = await Note.findByIdAndUpdate(
            {_id:id, user:req.user.id},
            { title, content },
            { new: true }  // Return the updated note
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(updatedNote);  // Return the updated note as response
    } catch (error) {
        console.error('Error updating note:', error);  // Log the full error
        res.status(500).json({ message: 'Error updating note', error });
    }
});





router.delete('/notes/:id',authenticateToken, async(req,res)=>{
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try{
        const deleteNote=await Note.findOneAndDelete({ _id: id, user: req.user.id });
        if(!deleteNote){
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({message:'Note deleted successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete note', error });
    }
})
module.exports=router;

