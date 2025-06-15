const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @param {Object} profile — Mongo document containing the student profile
 * @returns {Object} — Parsed JSON learning plan
 */
async function generateLearningPlan(profile) {
  const system = `
You are a curriculum designer. Create a learning plan in JSON only.
Use this format:
{
 "careerGoal": string,
 "totalWeeks": number,
 "lessons": [
   {
     "week": number,
     "topic": string,
     "description": string,
     "resources": [string]
   }
 ]
}
`;

  const user = `
Profile:
Career goal: ${profile.careerInterests?.[0] || 'N/A'}
Academic level: ${profile.academicLevel}
Weekly study time: ${profile.availableStudyTime?.hoursPerWeek}
Learning style: ${(profile.learningStyles || []).join(', ') || 'Any'}
Grades (JSON): ${JSON.stringify(profile.academicGrades || [])}

Instructions:
1. Plan no more than 16 weeks unless study time is >20h/week.
2. Include extra practice topics for subjects where grade < B or < 75%.
3. Match resource formats to preferred learning style when possible.
4. Keep each resource compact (max 80 chars).
Respond with only JSON using the schema above.
`;

  try {
    const result = await model.generateContent([system, user]);
    const response = result.response;
    const text = response.text();

    // Try to extract JSON in case Gemini wraps it in markdown
    const jsonMatch = text.match(/```json([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
    const rawJson = jsonMatch ? jsonMatch[1].trim() : text.trim();

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Gemini AI error:", error.message);
    throw new Error("Failed to generate learning plan");
  }
}

module.exports = { generateLearningPlan };
