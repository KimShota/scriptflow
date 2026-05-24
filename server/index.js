const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./prisma/client'); 
const scriptRoutes = require('./routes/scripts'); 
const authRoutes = require('./routes/auth'); 
const authMiddleware = require('./middleware/auth'); 
const geminiRoutes = require('./routes/gemini');
const analysisRoutes = require('./routes/analysis'); 

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: ['https://scriptflow-zeta.vercel.app', 'http://localhost:5173']
}))
app.use(express.json());

app.use('/api/auth', authRoutes); 

// protect routes with jwt authentication
app.use('/api/scripts', authMiddleware, scriptRoutes); 
app.use('/api/gemini', geminiRoutes)
app.use('/api/analysis', authMiddleware, analysisRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'ScriptFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// quick test for database connection 
// const prisma = require('./prisma/client'); 

// app.get('/test-db', async(req, res) => {
//     const users = await prisma.user.findMany(); 
//     res.json({ users }); 
// }); 