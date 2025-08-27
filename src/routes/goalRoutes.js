import express from 'express';
import multiLevelPrompting from '../utils/multiPrompt.js';
import biasCheck from '../utils/biasCheck.js';

const router = express.Router();

router.post('/set', async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }
    if (!biasCheck(goal)) {
      return res.status(400).json({ error: "Inappropriate goal" });
    }

    const plan = await multiLevelPrompting(goal);
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set goal" });
  }
});

export default router;