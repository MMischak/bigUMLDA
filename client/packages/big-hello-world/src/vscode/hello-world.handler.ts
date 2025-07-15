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
import { inject, injectable, postConstruct } from 'inversify';
import { HelloWorldActionResponse, LogModelJsonAction, LogModelJsonActionResponse, RequestHelloWorldAction } from '../common/hello-world.action.js';
import { LlmHandler } from './LLM.handler.js';

// Handle the action within the server and not the glsp client / server
@injectable()
export class HelloWorldActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private readonly toDispose = new DisposableCollection();
    private count = 0;

    @postConstruct()
     protected init(): void {
        this.toDispose.push(
            this.actionListener.registerVscodeHandledAction(HelloWorldActionResponse.KIND),
            this.actionListener.registerVscodeHandledAction(LogModelJsonActionResponse.KIND),
            this.actionListener.handleVSCodeRequest<RequestHelloWorldAction>(RequestHelloWorldAction.KIND, async message => {
                this.count += message.action.increase;
                console.log(`Hello World from VS Code: ${this.count}`);
                return HelloWorldActionResponse.create({
                    count: this.count
                });
            }),
            this.actionListener.handleVSCodeRequest<LogModelJsonAction>(LogModelJsonAction.KIND, async () => {
                const model = this.modelState.getModelState()?.getSourceModel();
                console.log('Hello World Model from VS Code:', model);
                const llmResponse = await LlmHandler(model);
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
