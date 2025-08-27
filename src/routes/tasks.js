import express from 'express';
import biasCheck from '../utils/biasCheck.js';
import sendEmail from '../utils/email.js';
import { OpenAI } from "@langchain/openai";

import { OPENAI_API_KEY } from '../config/env.js';

const router = express.Router();
const llm = new OpenAI({ apiKey: OPENAI_API_KEY });

router.post('/plan', async (req, res) => {
  try {
    const { goal, email } = req.body;
    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }
    if (!biasCheck(goal)) {
      return res.status(400).json({ error: "Inappropriate goal" });
    }

    const plan = await llm.call(`Break down the goal: ${goal}`);
    if (email) {
      await sendEmail(email, "Your Task Plan", plan);
    }
    
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create plan" });
  }
});

export default router;