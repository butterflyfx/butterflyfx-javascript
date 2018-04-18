import { ITestEnvironment } from "./protos";
export interface TestEnvironment extends ITestEnvironment {}

export interface RecordingHistory {
    event: string;
    target: string;
    diff?: any;
    html?: HTMLJSON;
    value?: string;
}
export interface HTMLJSON {
    type: string;
    tagName: string;
    attributes: { key: string; value: string }[];
    children: HTMLJSON[];
}

export interface RecordingSession {
    history: RecordingHistory[];
    environment: TestEnvironment;
    fixture?: any;
}
