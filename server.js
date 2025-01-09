const express= require('express');
const mongoose= require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const cookieParser = require('cookie-parser');
const noteRoutes= require('./routes/noteRoute');
const userRoutes=require('./routes/userRoute');
dotenv.config();

const app=express();
app.use(cookieParser());
app.use(cors({
    origin: '*', // Your frontend's origin
    credentials: true, // Allow cookies
}
));
app.use(express.json());
const port=3001

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
        .then(()=>console.log('MongoDB connected'))
        .catch((err)=> console.log(err));

app.get('/', (req,res)=>{
    res.send('Hello world!')
})

app.use('/api',noteRoutes)
app.use('/user',userRoutes)

app.listen(port,()=>{
    console.log(`App is Listening on port ${port}`)
})