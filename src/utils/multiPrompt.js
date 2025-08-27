import { OpenAI } from '@langchain/openai';
import { OPENAI_API_KEY } from '../config/env.js';

const llm = new OpenAI({ apiKey: OPENAI_API_KEY });

async function multiLevelPrompting(goal) {
  // Note: LangChain v0.1+ uses .invoke() instead of .call()
  const clarifiedGoal = await llm.invoke(`Rewrite as a SMART goal: ${goal}`);
  const taskBreakdown = await llm.invoke(`Break into tasks: ${clarifiedGoal}`);
  const stepByStepPlan = await llm.invoke(`Organize tasks into a timeline: ${taskBreakdown}`);
  return { clarifiedGoal, taskBreakdown, stepByStepPlan };
}

export default multiLevelPrompting;