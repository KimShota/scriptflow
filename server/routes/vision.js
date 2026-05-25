const express = require('express'); 
const router = express.Router(); 
const prisma = require('../prisma/client'); 

// initialize entire data for board
const defaultBoard = {
  nodes: {
    root: { id: 'root', label: 'Creator Vision', locked: true, children: ['what', 'who', 'uniqueness'] },
    what: { id: 'what', label: 'What', locked: true, children: ['ethos'] },
    ethos: { id: 'ethos', label: 'Your Ethos', content: '', locked: false, children: ['pillar1', 'pillar2', 'pillar3', 'pillar4'] },
    pillar1: { id: 'pillar1', label: 'Content Pillar 1', content: '', locked: false, children: [] },
    pillar2: { id: 'pillar2', label: 'Content Pillar 2', content: '', locked: false, children: [] },
    pillar3: { id: 'pillar3', label: 'Content Pillar 3', content: '', locked: false, children: [] },
    pillar4: { id: 'pillar4', label: 'Content Pillar 4', content: '', locked: false, children: [] },
    who: { id: 'who', label: 'Who', locked: true, children: ['demographics', 'psychographics'] },
    demographics: { id: 'demographics', label: 'Demographics', locked: true, children: ['regions', 'age', 'gender', 'professions'] },
    regions: { id: 'regions', label: 'Regions', content: '', locked: false, children: [] },
    age: { id: 'age', label: 'Age', content: '', locked: false, children: [] },
    gender: { id: 'gender', label: 'Gender Ratio', content: '', locked: false, children: [] },
    professions: { id: 'professions', label: 'Professions', content: '', locked: false, children: [] },
    psychographics: { id: 'psychographics', label: 'Psychographics', locked: true, children: ['struggles', 'desires', 'creators'] },
    struggles: { id: 'struggles', label: 'Struggles', content: '', locked: false, children: [] },
    desires: { id: 'desires', label: 'Desires', content: '', locked: false, children: [] },
    creators: { id: 'creators', label: 'Creators they consume', content: '', locked: false, children: [] },
    uniqueness: { id: 'uniqueness', label: 'Uniqueness', locked: true, children: ['pain', 'struggle', 'experience', 'passion'] },
    pain: { id: 'pain', label: 'Pain', content: '', locked: false, children: [] },
    struggle: { id: 'struggle', label: 'Struggle', content: '', locked: false, children: [] },
    experience: { id: 'experience', label: 'Experience', content: '', locked: false, children: [] },
    passion: { id: 'passion', label: 'Passion', content: '', locked: false, children: [] }
  }
}

// GET endpoint to get the vision board
router.get('/', async(req, res) => {
    try{
        let board = await prisma.visionBoard.findUnique({
            where: { userId: req.userId }
        }); 
        // create a board if it does not exist 
        if (!board){
            board = await prisma.visionBoard.create({
                data: {
                    userId: req.userId, 
                    data: defaultBoard
                }
            }); 
        }
        res.json(board); 
    } catch (error){
        console.error(error); 
        res.status(500).json({ error: 'Failed to get vision board' }); 
    }
}); 

// PUT endpoint to update the vision board
router.put('/', async (req, res) => {
    try {
        // get data from req body
        const { data } = req.body; 
        // update or create if not exist
        const board = await prisma.visionBoard.upsert({
            where: { userId: req.userId }, 
            update: { data }, 
            create: { userId: req.userId, data }
        }); 
        res.json(board); 
    } catch (error){
        console.error(error); 
        res.status(500).json({ error: 'Failed to update vision board' }); 
    }
}); 

module.exports = router