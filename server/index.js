const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ScriptFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// quick test for database connection 
const prisma = require('./prisma/client'); 

app.get('/test-db', async(req, res) => {
    const users = await prisma.user.findMany(); 
    res.json({ users }); 
}); 