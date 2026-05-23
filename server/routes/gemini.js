const express = require('express')
const router = express.Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const authMiddleware = require('../middleware/auth')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/correct', authMiddleware, async (req, res) => {
  try {
    const { fields } = req.body

    if (!fields) {
      return res.status(400).json({ error: 'No content provided' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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

module.exports = router