/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export enum DiagramType {
  Class = 'Class',
  Sequence = 'Sequence',
  UseCase = 'Use Case',
  Component = 'Component'
}

export enum IntentCategory {
  Overview = 'Overview',
  Element = 'Element',
  Relationship = 'Relationship',
  Critique = 'Critique',         
  Improvement = 'Improvement', 
}

export enum UserRole {
  BlindNovice = 'Blind novice',
  Beginner = 'Beginner',
  DomainExpert = 'Domain expert',
  ModellingExpert = 'Modelling expert'
}

export enum OutputModality {
  PlainText = 'Plain textual description',
  AudioText = 'Audio summary as text'
}

export interface PromptOptions {
  diagramType: DiagramType; // Axis A – Diagram type
  intent?: IntentCategory; // Axis B – Question category/intent
  userRole: UserRole; // Axis C – User role
  outputModality: OutputModality; // Axis D – Output modality
  question?: string; // Specific user question
}

 const INTENT_SNIPPETS: Record<IntentCategory, string> = {
    [IntentCategory.Overview]:
      'Provide a concise overview of the whole diagram, its purpose, the main parts and how they fit together.',

    [IntentCategory.Element]:
      'Describe a single model element in detail. If none is specified, pick the most central element and explain it.',

    [IntentCategory.Relationship]:
      'Explain the relationships shown. When a specific relationship is mentioned, focus on that; otherwise cover the most important links.',

    [IntentCategory.Critique]:
      'Critically evaluate the diagram: point out inconsistencies, ambiguities or UML misuses and explain why they matter.',

    [IntentCategory.Improvement]:
      'Suggest concrete improvements or refinements that would enhance clarity, maintainability or alignment with best practices.'

  };

  const ROLE_SNIPPETS: Record<UserRole, string> = {
    [UserRole.BlindNovice]:
      'Optimise for a blind user: avoid visual references, keep sentences very short.',
    [UserRole.Beginner]:
      'Use simple language suitable for a beginner; avoid UML jargon and explain in plain words.',
    [UserRole.DomainExpert]:
      'Provide detailed explanations with standard domain terminology.',
    [UserRole.ModellingExpert]:
      'Focus on modelling aspects using precise UML terminology.'
  };


export function buildPromptFromUml(umlData: any, options: PromptOptions): string {
  const { diagramType, intent, userRole, outputModality, question } = options;

  let prompt = "Please describe the following: ";



  prompt += `This is a ${diagramType} diagram. `;
  if (intent) prompt +=  INTENT_SNIPPETS[intent];       
  prompt += ROLE_SNIPPETS[userRole];

  if (question && !intent) {
    prompt += `Question: ${question}.\n`;
  }


  if (outputModality === OutputModality.AudioText) {
    prompt += 'Optimise the output for audio: keep sentences short and easy to read aloud. ';
  } else {
    prompt += 'Optimise the output for on-screen reading using full sentences and paragraphs. ';
  }

  prompt += 'Here is the UML model:\n';
  prompt += JSON.stringify(umlData, null, 2);
  return prompt;
}
