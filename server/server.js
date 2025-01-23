import express from 'express';
import { static as serveStatic } from 'express';
import cors from 'cors';
import axios from 'axios';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const apiKey = process.env.API_KEY;
const questionsFile = join(__dirname, '../data/previousQuestions.json');

app.use(cors());
app.use(serveStatic(join(__dirname, '../public')));

app.get('/generate-question', async (req, res) => {
  try {
    let previousQuestions = [];
    if (existsSync(questionsFile)) {
      previousQuestions = JSON.parse(readFileSync(questionsFile, 'utf8'));
    } 

    const previousQuestionsText = previousQuestions.map(q => `- ${q}`).join('\n');
    const prompt = `Generate a different ice breaker question from the previous questions that you answered with 150 tokens or less:\n${previousQuestionsText}`;

    
    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
        {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
    );

    const question = response.data.candidates[0].content.parts[0].text;

    previousQuestions.push(question);
    writeFileSync(questionsFile, JSON.stringify(previousQuestions, null, 2));

    res.json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});