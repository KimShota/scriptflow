const express = require('express'); 
const router = express.Router(); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const prisma = require('../prisma/client'); 

// POST endpoint to register users 
router.post('/register', async (req, res) => {
    try{
        const { email, password } = req.body; 
        
        // check if the user already exists or not
        const existingUser = await prisma.user.findUnique({
            where: {email}
        }); 

        if (existingUser){
            return res.status(400).json({ error: 'Email already in use' }); 
        }

        // hash the password (10 times)
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        // create the user 
        const user = await prisma.user.create({
            data: {
                email, 
                password: hashedPassword
            }
        }); 

        // generate JWT token and send it to the client 
        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        ); 

        res.status(201).json({
            token, 
            user: { id: user.id, email: user.email }
        }); 
    } catch (error){
        console.log(error); 
        res.status(500).json({ error: 'Failed to register' }); 
    }
}); 

// POST endpoint to log user in
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; 

        // find the user in the database
        const user = await prisma.user.findUnique({
            where: { email }
        }); 
        if (!user){
            return res.status(400).json({ error: 'Invalid email or password' }); 
        }

        // check if the password is valid or not
        const validPassword = await bcrypt.compare(password, user.password); 
        if (!validPassword){
            return res.status(400).json({ error: 'Invalid email or password' }); 
        }

        // generate JWT token 
        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        ); 

        // send JWT token and user info to the client
        res.json({
            token, 
            user: { id: user.id, email: user.email }
        }); 

    } catch (error){
        console.log(error); 
        res.status(500).json({ error: 'Failed to login' }); 
    }
}); 

module.exports = router