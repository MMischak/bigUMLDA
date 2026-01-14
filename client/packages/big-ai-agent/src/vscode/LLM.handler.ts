/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import os from "os";
import path from "path";
import type { PromptOptions } from './promptBuilder.js';
import {
  buildPromptFromUml
} from './promptBuilder.js';


//const { GoogleGenerativeAI } = require("@google/generative-ai");
dotenv.config({ path: 'gem.env' });

// Function to send the prompt to Gemini and retrieve the summary
async function getSummaryFromGemini(prompt: string, apiKey: any): Promise<string> {
  // Use a separate API key for Gemini, if required
  if (!apiKey || apiKey === "<API_KEY>") {
    throw new Error('GEMINI_API_KEY is not defined in the environment.');
  }

  // Initialize the Gemini client with the API key
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: `You are a UML expert. Your Task: Respond with a paragraph of the users options or question. Follow these rules:
                1. Read the diagram and user options carefully before writing.
                2. Use the language and style asked for in the options.
                3. Do not hallucinate.
                4. Keep the response short. `,
  });

  try {
    // Send the request to Gemini's chat completions endpoint
    console.log("--------------- Prompt: ");
    console.log(prompt);
    const result = await model.generateContent({
      contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              }
            ],
          }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      }
  });

    const summary = result.response.text();
    return summary;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Main function tying everything together
export async function LlmHandler(model: unknown, options: PromptOptions, apiKey = "<API_KEY>"): Promise<string> {
  try {
    const xmlData = model;
    const tempFilePath = path.join(os.tmpdir(), "xmlData2.txt");
    fs.writeFileSync(tempFilePath, JSON.stringify(xmlData, null, 2));
    // const options: PromptOptions = {
    //   diagramType: DiagramType.Class,
    //   intent: IntentCategory.Overview,
    //   userRole: UserRole.DomainExpert,
    //   outputModality: OutputModality.PlainText,
    //   question: 'What is the central class of this model?'
    // };

    const prompt = buildPromptFromUml(xmlData, options);
    const response = await getSummaryFromGemini(prompt, apiKey);

    console.log('\n Response:\n', response);

    return response;

  } catch (error) {
    console.error('Error in processing UML file:', error);
    return 'Error fetching AI response';
  }
}
