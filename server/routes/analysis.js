const express = require('express'); 
const router = express.Router(); 
const prisma = require('../prisma/client'); 

// GET endpoint to get all the analsis
router.get('/', async (req, res) => {
    try {
        // get all the analyses from database
        const analyses = await prisma.analysis.findMany({
            where: { userId: req.userId }, 
            orderBy: { createdAt: 'desc' }
        }); 
        res.json(analyses); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Failed to fetch analysis' }); 
    }
}); 

// POST endpoint to create analysis 
router.post('/', async (req, res) => {
    try {
        // get user input from req body 
        const {
            creatorName, 
            reelLink, 
            views, 
            hookTitle, 
            hookVisual, 
            hookVerbal, 
            storyArc,
            pacing,
            cta,
            format,
            duration,
            audio,
            audioCustom,
            notes
        } = req.body;

        // create an analsis in the database
        const analysis = await prisma.analysis.create({
            data: {
                userId: req.userId,
                creatorName,
                reelLink,
                views: views ? parseInt(views) : null,
                hookTitle,
                hookVisual,
                hookVerbal,
                storyArc,
                pacing,
                cta,
                format,
                duration,
                audio,
                audioCustom,
                notes
            }
        }); 
        res.status(201).json(analysis); 
    } catch (error){
        console.error(error); 
        res.status(500).json({ error: 'Failed to create analsys' }); 
    }
}); 

// DELETE endpoint to delete an analysis 
router.delete('/:id', async (req, res) => {
    try{
        await prisma.analysis.delete({
            where: { id: parseInt(req.params.id) }
        }); 
        res.json({ message: 'Analysis deleted successfully' }); 
    } catch (error){
        console.error(error); 
        res.status(500).json({ error: 'Failed to delete an analysis' }); 
    }
}); 

module.exports = router