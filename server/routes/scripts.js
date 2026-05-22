const express = require('express'); 
const router = express.Router(); // create a router object
const prisma = require('../prisma/client'); 

// GET endpoint to get all the scripts from the database
router.get('/', async (req, res) => {
    try{
        const scripts = await prisma.script.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc'}
        }); 
        res.json(scripts); 
    } catch (error){
        res.status(500).json({ error: 'Failed to fetch scripts '}); 
    }
}); 

// GET endpoint to get a single script
router.get('/:id', async (req, res) => {
    try {
        const script = await prisma.script.findUnique({
            where: { id: parseInt(req.params.id) }
        }); 
        if (!script){
            return res.status(404).json({ error: 'Script not found' }); 
        }
        res.json(script); 
    } catch (error){
        res.status(500).json({ error: 'Failed to fetch a single script' }); 
    }
}); 

// POST endpoint to create a script 
router.post('/', async (req, res) => {
    try {
        const {
            title, 
            mission, 
            status, 
            hookTitle, 
            hookVisual, 
            hookVerbal, 
            storyProblem,
            storyPromise, 
            storyCredibility,
            storyDelivery, 
            storyCta, 
            footageNeeded,
            audio, 
            caption
        } = req.body; 

        const script = await prisma.script.create({
            data: {
                userId: req.userId,
                title, 
                mission, 
                status, 
                hookTitle, 
                hookVisual, 
                hookVerbal, 
                storyProblem,
                storyPromise, 
                storyCredibility,
                storyDelivery, 
                storyCta, 
                footageNeeded,
                audio, 
                caption
            }
        }); 
        res.status(201).json(script); 
    } catch (error){
        console.log(error); 
        res.status(500).json({ error: 'Failed to create a script' }); 
    }
}); 

// PUT endpoint to update script
router.put('/:id', async (req, res) => {
    try {
        const {
            title,
            mission,
            status,
            hookTitle,
            hookVisual,
            hookVerbal,
            storyProblem,
            storyPromise,
            storyCredibility,
            storyDelivery,
            storyCta,
            footageNeeded,
            audio,
            caption
        } = req.body

        // update a script
        const script = await prisma.script.update({
            where: { id: parseInt(req.params.id) }, 
            data: {
                title,
                mission,
                status,
                hookTitle,
                hookVisual,
                hookVerbal,
                storyProblem,
                storyPromise,
                storyCredibility,
                storyDelivery,
                storyCta,
                footageNeeded,
                audio,
                caption
            }
        }); 
        res.json(script); 
    } catch (error){
        res.status(500).json({ error: 'Failed to update a script' }); 
    }
}); 

// DELETE endpoint to delete a script
router.delete('/:id', async (req, res) => {
    try {
        await prisma.script.delete({
            where: { id: parseInt(req.params.id) }
        }); 
        res.json({ message: 'Script deleted successfully' }); 
    } catch(error){
        res.status(500).json({ error: 'Failed to delete script' }); 
    }
}); 

module.exports = router;