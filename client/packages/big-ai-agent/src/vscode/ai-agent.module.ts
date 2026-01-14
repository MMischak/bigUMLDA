/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { AiAgentActionHandler } from './ai-agent.handler.js';
import { AiAgentProvider, AiAgentViewId } from './ai-agent.provider.js';

export function helloAgentModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(AiAgentViewId).toConstantValue(viewId);
        bind(AiAgentProvider).toSelf().inSingletonScope();
        bind(TYPES.RootInitialization).toService(AiAgentProvider);

        bind(AiAgentActionHandler).toSelf().inSingletonScope();
        bind(TYPES.Disposable).toService(AiAgentActionHandler);
        bind(TYPES.RootInitialization).toService(AiAgentActionHandler);
    });
}
