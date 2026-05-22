const jwt = require('jsonwebtoken'); 

module.exports = (req, res, next) => {
    try {
        // extract the token from the request header
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token){
            return res.status(401).json({ error: 'No token provided' }); 
        }

        // verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded.userId; 
        // go to routers on backend
        next(); 
    } catch (error){
        res.status(401).json({ error: 'Invalid token' }); 
    }
}