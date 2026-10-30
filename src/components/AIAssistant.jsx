const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Transaction = require('../models/Transaction');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/process-ai', async (req, res) => {
  try {
    const { message, userId } = req.body;
    console.log("New message received for Rohix:", message);

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const prompt = `
    Analyze this text and extract financial details in strict JSON format only. No markdown, no extra text.
    {
      "type": "cashIn" or "cashOut",
      "category": "Salary & Income" or "Entertainment & Leisure" or "Food & Dining" or "Transport & Logistics" or "General" or "Health & Care" or "Other",
      "amount": number,
      "description": "short text max 40 chars"
    }
    Text: "${message}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 100
      }
    });

    const aiResponseText = response.text || '{}';
    console.log("Gemini Raw Response:", aiResponseText);

    let transactionData = {};
    try {
      let cleanedJson = aiResponseText.trim();
      cleanedJson = cleanedJson.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleanedJson.indexOf('{');
      const lastBrace = cleanedJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedJson = cleanedJson.substring(firstBrace, lastBrace + 1);
      }
      transactionData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.warn("⚠️ JSON Parse failed, utilizing smart fallback...");
      const amountMatch = message.match(/\d+/);
      const isIncome = message.toLowerCase().includes('salary') || message.toLowerCase().includes('received') || message.toLowerCase().includes('got');
      
      transactionData = {
        type: isIncome ? 'cashIn' : 'cashOut',
        category: 'General',
        amount: amountMatch ? parseInt(amountMatch[0]) : 0,
        description: message
      };
    }

    const rawType = (transactionData.type || 'cashOut').toLowerCase();
    const finalType = rawType.includes('in') || rawType.includes('salary') ? 'cashIn' : 'cashOut';
    const activeUserId = userId || 'default_user_161011';

    const newTransaction = new Transaction({
      userId: activeUserId,
      type: finalType,
      category: transactionData.category || 'General',
      amount: transactionData.amount || 0,
      description: (transactionData.description || message).substring(0, 40),
      date: new Date()
    });

    await newTransaction.save();
    console.log("⚡ Transaction saved successfully to database!");

    res.status(200).json({
      success: true,
      message: `Rohix successfully recorded ₹${transactionData.amount} under ${transactionData.category || 'General'}!`,
      transaction: newTransaction
    });

  } catch (error) {
    console.error('AI Processing Error:', error);
    res.status(500).json({ success: false, error: 'Rohix encountered an issue understanding the request. Please try again.' });
  }
});
export default AIAssistant;
module.exports = router;
