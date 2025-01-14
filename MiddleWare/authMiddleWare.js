const jwt=require('jsonwebtoken');
const JWT_SECRET='23343rwrwerfrwfrsfvdfbvdsfvdgvdg';

const authenticateToken=(req,res,next) =>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Access denied.No token provided.'});
    }

    try{
        const decoded=jwt.verify(token, JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(error){
        console.error("Token verification failed:", error);
        res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports=authenticateToken;