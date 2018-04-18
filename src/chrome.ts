import * as _ from "./lib/lodash";
import { RecordingSession } from "./common";

const EXTENSION_ID = "ilmppabbifdfpdjclondiaiidmjgnnpf";
const runtime = _.get(window, "chrome.runtime");

export function sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!runtime) {
            reject(new Error("Extension not installed"));
        }
        runtime.sendMessage(EXTENSION_ID, message, (result) => {
            resolve(result);
        });
    });
}

export function hasExtensionInstalled(): Promise<boolean> {
    if (!runtime) {
        return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
        sendMessage({ action: "ping" })
            .then((result) => {
                let response = _.get(result, "action");
                if (response != "pong") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            .catch(() => {
                resolve(false);
            });
    });
}

interface TunnelOptions {
    apiKey: string;
    projectId: number;
}

export function startTunnel(payload: TunnelOptions): Promise<boolean> {
    return sendMessage({ action: "startTunnel", payload: payload });
}

export function getActiveRecordingSession(): Promise<RecordingSession> {
    return sendMessage({ action: "getActiveSession" });
}

export function setActiveRecordingSession(session: RecordingSession): Promise<RecordingSession> {
    let payload = { history: session.history, environment: session.environment, fixture: session.fixture };
    return sendMessage({ action: "setRecordingSession", payload });
}

export function stopActiveRecordingSession(): Promise<RecordingSession> {
    return sendMessage({ action: "stopRecordingSession" });
}
