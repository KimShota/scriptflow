const express = require('express')
const router = express.Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const authMiddleware = require('../middleware/auth')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/correct', async (req, res) => {
  try {
    const { fields } = req.body

    if (!fields) {
      return res.status(400).json({ error: 'No content provided' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    // filter out empty fields
    const nonEmptyFields = Object.entries(fields).filter(([key, value]) => value && value.trim() !== '')

    if (nonEmptyFields.length === 0) {
      return res.status(400).json({ error: 'No content to correct' })
    }

    // build one prompt with all fields labeled
    const fieldText = nonEmptyFields.map(([key, value]) => `[${key}]\n${value}`).join('\n\n')

    const prompt = `You are a grammar and flow editor. Correct ONLY grammar mistakes and improve the flow of each section below. Do NOT change the meaning, tone, style, or content. Do NOT add or remove ideas. Return the corrected text in the exact same format with the field labels like [fieldName] preserved. Return ONLY the corrected sections with no explanation or commentary.

${fieldText}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()

    // parse the response back into fields
    const correctedFields = { ...fields }
    const sections = responseText.split(/\[(\w+)\]/).filter(Boolean)

    for (let i = 0; i < sections.length - 1; i += 2) {
      const key = sections[i].trim()
      const value = sections[i + 1].trim()
      if (correctedFields.hasOwnProperty(key)) {
        correctedFields[key] = value
      }
    }

    res.json({ correctedFields })
  } catch (err) {
    console.error('Gemini error:', err.message)
    res.status(500).json({ error: 'Failed to correct grammar', details: err.message })
  }
})

// POST endpoint to summarize chosen analyses
router.post('/summarize-analysis', async (req, res) => {
  try {
    const { analyses } = req.body; 

    if (!analyses || analyses.length === 0){
      return res.status(400).json({ error: 'No analysis provided' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' }); 

    // combine analysis text for all the creators
    const analysisText = analyses.map((a, i) => `
      Creator ${i + 1}: ${a.creatorName}
      Views: ${a.views || 'N/A'}
      Title Hook: ${a.hookTitle || 'N/A'}
      Visual Hook: ${a.hookVisual || 'N/A'}
      Verbal Hook: ${a.hookVerbal || 'N/A'}
      Story Arc: ${a.storyArc || 'N/A'}
      Pacing: ${a.pacing || 'N/A'}
      CTA: ${a.cta || 'N/A'}
      Format: ${a.format || 'N/A'}
      Duration: ${a.duration || 'N/A'}
      Audio: ${a.audio || 'N/A'}
      Notes: ${a.notes || 'N/A'}
    `).join('\n---\n')

    //create the prompt 
    const prompt = `You are an expert short-form content strategist. Analyze the following creator data and provide actionable insights.

    ${analysisText}

    Please provide:
    1. **Common Patterns** - What do these creators have in common?
    2. **Hook Strategy** - What hook approaches are most common and effective?
    3. **Pacing & Format** - What pacing and format trends do you notice?
    4. **Audio Strategy** - What audio choices are most common?
    5. **CTA Patterns** - What call-to-action approaches are used?
    6. **Key Takeaways** - What are the top 3 things to implement in your own content?

    Keep the response concise and actionable. Format with clear headings and bullet points.`

    // generate content using the model
    const result = await model.generateContent(prompt); 
    const summary = result.response.text(); 
    res.json({ summary }); 
  } catch (error){
    console.error(error); 
    res.status(500).json({ error: 'Failed to summarize using gemini' }); 
  }
}); 

module.exports = router