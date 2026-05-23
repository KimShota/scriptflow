const express = require('express'); 
const router = express.Router(); 
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/auth'); 

// create object 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

router.post('/correct', authMiddleware, async (req, res) =>{
    try {
        const { fields } = req.body; 

        // error handling if content is empty
        if (!fields){
            return res.status(400).json({ error: 'No Content Provided' }); 
        }

        // create model instance with gemini 3.5 flash
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' }); 

        const correctedFields = {}; 
        // convert JSON object into array of array so that we can iterate over it
        for (const [key, value] of Object.entries(fields)){
            if (!value || value.trim() === ''){
                correctedFields[key] = value; 
                continue; 
            }

            // create prompt with content 
            const prompt = `You are a grammar and flow editor. Your job is to correct ONLY grammar mistakes and improve the flow of the following text. Do NOT change the meaning, tone, style, or content. Do NOT add or remove ideas. Do NOT make it sound more formal or informal than the original. Only fix grammatical errors and awkward phrasing. Return ONLY the corrected text with no explanation, no preamble, and no additional commentary.

            Text to correct:
            ${value}`

            // get the result from the model
            const result = await model.generateContent(prompt); 
            // assign it to the right key
            correctedFields[key] = result.response.text().trim(); 
        }
        res.json({ correctedFields }); 
    } catch (err){
        console.error(err); 
        res.status(500).json({ error: 'Failed to correct grammar' }); 
    }
}); 

module.exports = router
