/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import { LogModelJsonActionResponse } from '../common/ai-agent.action.js';

export const AiAgentViewId = Symbol('AiAgentViewId');

@injectable()
export class AiAgentProvider extends BIGReactWebview {
    @inject(AiAgentViewId)
    viewId: string;

    protected override cssPath = ['ai-agent', 'bundle.css'];
    protected override jsPath = ['ai-agent', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([LogModelJsonActionResponse.KIND]);

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
        this.toDispose.push(
            this.actionCache,
            this.actionListener.registerVscodeHandledAction(LogModelJsonActionResponse.KIND)
        );
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.actionListener.registerVSCodeListener(message => {
                if (
                    message.action.kind === LogModelJsonActionResponse.KIND
                ) {
                    this.webviewConnector.dispatch(message);
                }
            }),
            this.webviewConnector.onReady(() => {
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
        );
    }
}
