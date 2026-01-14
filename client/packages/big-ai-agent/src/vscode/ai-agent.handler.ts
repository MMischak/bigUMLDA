/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    EXPERIMENTAL_TYPES,
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type Disposable,
    type ExperimentalGLSPServerModelState
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { readFile } from 'fs/promises';
import { inject, injectable, postConstruct } from 'inversify';
import { LogModelJsonAction, LogModelJsonActionResponse } from '../common/ai-agent.action.js';
import { LlmHandler } from './LLM.handler.js';
import { DiagramType, IntentCategory, OutputModality, UserRole } from './promptBuilder.js';

// Handle the action within the server and not the glsp client / server
@injectable()
export class AiAgentActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private readonly toDispose = new DisposableCollection();

    @postConstruct()
     protected init(): void {
        this.toDispose.push(
            this.actionListener.registerVscodeHandledAction(LogModelJsonActionResponse.KIND),
            this.actionListener.handleVSCodeRequest<LogModelJsonAction>(LogModelJsonAction.KIND, async message => {
                let model: unknown;
                console.log("------in handleVSCodeRequest:");
                console.log(message.action);
                if (message.action.umlFilePath) {
                    try {
                        console.log("try reading path");
                        model = await readFile(message.action.umlFilePath, 'utf-8');
                    } catch (error) {
                        console.error('Error reading PlantUML file:', error);
                        return LogModelJsonActionResponse.create({
                            responsetext: 'Error reading PlantUML file'
                        });
                    }
                } else {
                    console.log("in else");
                    model = this.modelState.getModelState()?.getSourceModel();
                }
                console.log('Ai Agent Model from VS Code:', model);
                const llmResponse = await LlmHandler(model, message.action.promptOptions ?? {
                    diagramType: DiagramType.Class,
                    intent: IntentCategory.Overview,
                    userRole: UserRole.DomainExpert,
                    outputModality: OutputModality.PlainText,
                    question: ''
                });
                return LogModelJsonActionResponse.create({
                    responsetext: llmResponse
                });
            })
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
