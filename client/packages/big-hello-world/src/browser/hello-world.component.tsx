/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { useCallback, useContext, useEffect, useState, type ReactElement } from 'react';
import { HelloWorldActionResponse, LogModelJsonAction, LogModelJsonActionResponse, RequestHelloWorldAction } from '../common/index.js';


export function HelloWorld(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);
    const [count, setCount] = useState(0);
    const [model, setModel] = useState<string | undefined>();

    useEffect(() => {
        listenAction(action => {
            setModel("Action response");
            if (HelloWorldActionResponse.is(action)) {
                setModel("Action response setCount");
                setCount(action.count);
            } else if (LogModelJsonActionResponse.is(action)) {
                setModel(action.responsetext);
            }
        });
    }, [listenAction]);

    const increase1 = useCallback(() => {
        setModel("called increase1");
        dispatchAction(RequestHelloWorldAction.create({ increase: 1 }));
    }, [dispatchAction]);

    const increase5 = useCallback(() => {
        setModel("called increase5");
        dispatchAction(RequestHelloWorldAction.create({ increase: 5 }));
    }, [dispatchAction]);

    const logModel = useCallback(() => {
        setModel("called action");
        dispatchAction(LogModelJsonAction.create());
    }, [dispatchAction]);

    return (
        <div>
            <span>Hello World! {count}</span>
            <button onClick={() => increase1()}>Increase 1</button>
            <button onClick={() => increase5()}>Increase 5</button>
            <button onClick={() => logModel()}>Show Model</button>
            <div><span id="jsonresponse"> {model ?? "here comes text"} </span></div>
        </div>
    );
}
