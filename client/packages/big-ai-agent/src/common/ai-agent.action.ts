/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';
import type { PromptOptions } from '../vscode/promptBuilder.js';

export interface LogModelJsonAction extends RequestAction<LogModelJsonActionResponse> {
    kind: typeof LogModelJsonAction.KIND;
    promptOptions?: PromptOptions;
    umlFilePath?: string;
}

export namespace LogModelJsonAction {
    export const KIND = 'logModelJsonAction';

    export function is(object: unknown): object is LogModelJsonAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<LogModelJsonAction, 'kind' | 'requestId'> = {}): LogModelJsonAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface LogModelJsonActionResponse extends ResponseAction {
    kind: typeof LogModelJsonActionResponse.KIND;
    responsetext?: string;
}

export namespace LogModelJsonActionResponse {
    export const KIND = 'logModelJsonActionResponse';

    export function is(object: unknown): object is LogModelJsonActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<LogModelJsonActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): LogModelJsonActionResponse {
        return {
            kind: KIND,
            responseId: '',
            responsetext: '',
            ...options
        };
    }
}
