const jwt = require("jsonwebtoken");

const authenticate = (req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
        const decoded = jwt.verify(token, "masai");
        if(decoded){
            const userId = decoded.userId
            req.body.userId=userId
            next();
        }else{
            res.send("User already exist, please login")
        }
    }else{
        res.send("Please Login")
    }
}
module.exports={
    authenticate
}