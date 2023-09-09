import  Jwt  from "jsonwebtoken";


const verification = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const verify = Jwt.verify(token,'verifytoken');
        console.log(verify);
        next();
    }
    catch(error)
    {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

export default verification;