/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BigDropdown, BigTextField, VSCodeContext } from '@borkdominik-biguml/big-components';
import { useCallback, useContext, useEffect, useState, type ReactElement } from 'react';
import { DiagramType, HelloWorldActionResponse, IntentCategory, LogModelJsonAction, LogModelJsonActionResponse, OutputModality, UserRole } from '../common/index.js';


export function HelloWorld(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);
    const [model, setModel] = useState<string | undefined>();
    const [diagramType, setDiagramType] = useState<DiagramType>(DiagramType.Class);
    const [intent, setIntent] = useState<IntentCategory>(IntentCategory.Overview);
    const [userRole, setUserRole] = useState<UserRole>(UserRole.DomainExpert);
    const [outputModality, setOutputModality] = useState<OutputModality>(OutputModality.PlainText);
    const [question, setQuestion] = useState<string>('');

    useEffect(() => {
        listenAction(action => {
            setModel("Action response");
            if (HelloWorldActionResponse.is(action)) {
                setModel("Action response setCount");
            } else if (LogModelJsonActionResponse.is(action)) {
                setModel(action.responsetext);
            }
        });
    }, [listenAction]);

    const logModel = useCallback(() => {
        setModel("called action");
        dispatchAction(
            LogModelJsonAction.create({
                promptOptions: {
                    diagramType,
                    intent,
                    userRole,
                    outputModality,
                    question: question || undefined
                }
            })
        );
    }, [dispatchAction, diagramType, intent, userRole, outputModality, question]);

    return (
        <div>
            <BigDropdown
                label='Diagram Type'
                choice={diagramType}
                choices={Object.values(DiagramType).map(v => ({ label: v, value: v }))}
                onDidChangeValue={value => setDiagramType(value as DiagramType)}
            ></BigDropdown>
            <BigDropdown
                label='Intent'
                choice={intent}
                choices={Object.values(IntentCategory).map(v => ({ label: v, value: v }))}
                onDidChangeValue={value => setIntent(value as IntentCategory)}
            ></BigDropdown>
            <BigDropdown
                label='User Role'
                choice={userRole}
                choices={Object.values(UserRole).map(v => ({ label: v, value: v }))}
                onDidChangeValue={value => setUserRole(value as UserRole)}
            ></BigDropdown>
            <BigDropdown
                label='Output'
                choice={outputModality}
                choices={Object.values(OutputModality).map(v => ({ label: v, value: v }))}
                onDidChangeValue={value => setOutputModality(value as OutputModality)}
            ></BigDropdown>
            <BigTextField label='Question' value={question} onDidChangeValue={setQuestion}></BigTextField>
            <br></br>
            <button onClick={() => logModel()}>Ask Agent</button>
            <div><span id="jsonresponse"> {model ?? "here comes text"} </span></div>
        </div>
    );
}
