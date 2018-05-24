import uniqueSelector from "unique-selector";
import { parse, stringify } from "himalaya";
import { RecordingHistory, HTMLJSON, TestEnvironment } from "./common";
import Fixture from "./api/fixture";
import * as _ from "lodash";
import * as chrome from "./chrome";
import * as $ from "jquery";

import { DiffPatcher } from "jsondiffpatch";
import GlobalContext from "./contexts/global";
const patchModule = require("jsondiffpatch");
let jsondiffpatch;
if (patchModule && patchModule.create) {
    jsondiffpatch = patchModule.create();
}
// let jsondiffpatch = new DiffPatcher();

const ALLOWED_KEYBOARD_EVENTS = {
    Enter: "\n",
    Tab: "\t",
    F9: "F9"
};

function removeComments(nodes: HTMLJSON[]) {
    if (!nodes) {
        return;
    }
    return nodes.filter((node) => {
        if (node.type === "comment") {
            return false;
        } else {
            node.children = removeComments(node.children);
            return true;
        }
    });
}

let unique = (el: HTMLElement) => {
    let id = el.id;
    if (el.id.indexOf("ember") === 0) {
        el.id = "";
    }
    let options = {
        // Array of selector types based on which the unique selector will generate
        selectorTypes: ["Class", "Tag", "NthChild"]
    };
    let selector = uniqueSelector(el).replace("html > body > ", "");
    let parentFrame = el.ownerDocument.body.getAttribute("bfx-frame");
    el.id = id;
    if (selector.indexOf(">") !== -1) {
        if (document.querySelectorAll(selector).length > 1) {
            let subselector = selector.split(">").pop();
            return unique(el.parentElement) + `> ${subselector}`;
        } else {
            if (parentFrame) {
                selector = `${parentFrame} > ${selector}`;
            }
            return selector;
        }
    }
    if (parentFrame) {
        selector = `${parentFrame} > ${selector}`;
    }
    return selector;
};

function isValidKeyboardEvent(e: Event) {
    let event = <KeyboardEvent>e;
    return Object.keys(ALLOWED_KEYBOARD_EVENTS).indexOf(event.key) !== -1;
}

class PageRecorder {
    public hotkey: Function;

    private fixture: Fixture;
    private recordHTML = false;
    private isRecording = true;

    public environment: TestEnvironment = {
        variables: {}
    };
    private body = document.body;

    private _resolve: Function;
    private history: RecordingHistory[] = [];

    private _stopEventListener: EventListener;
    private _selectorEventListener: EventListener;
    private _diffEventListener: EventListener;

    constructor(history: RecordingHistory[] = [], fixture = undefined) {
        this.history = history;
        this.fixture = fixture;
    }

    private generateHTMLJSON(): HTMLJSON[] {
        if (!this.recordHTML) {
            return;
        }
        let doc = <HTMLElement>this.body.parentElement.cloneNode(true);
        let inputs = Array.from(doc.querySelectorAll("input"));
        inputs.forEach((e) => e.setAttribute("value", e.value));
        return removeComments(<HTMLJSON[]>parse(doc.outerHTML));
    }

    private mergeHTMLDiff(item: RecordingHistory): RecordingHistory {
        let output = {
            html: this.generateHTMLJSON()
        };
        let lastEvent = this.history[this.history.length - 1];
        if (lastEvent && lastEvent.html) {
            output["diff"] = jsondiffpatch.diff(lastEvent.html, output.html);
        }
        return Object.assign({}, item, output);
    }

    stopRecording(): RecordingHistory[] {
        this.isRecording = false;
        this.body.ownerDocument.removeEventListener("click", this._selectorEventListener, {
            capture: true
        });
        this.body.ownerDocument.removeEventListener("focus", this._selectorEventListener, {
            capture: true
        });
        this.body.ownerDocument.removeEventListener("change", this._diffEventListener, {
            capture: true
        });
        this.body.ownerDocument.removeEventListener("keydown", this._diffEventListener, { capture: true });
        if (this.recordHTML) {
            this.history.forEach((item) => {
                if (item.diff) {
                    delete item.html;
                }
            });
        }
        if (this.fixture && this.history.length > 0) {
            this.fixture.revision.rules = JSON.stringify(this.history);
        }
        chrome
            .setActiveRecordingSession({ history: this.history, environment: this.environment, fixture: this.fixture })
            .then(() => {
                this._resolve(this.history);
            });
        return this.history;
    }

    expectValue(selector: string, value: string) {
        let item = <RecordingHistory>{
            event: "expect",
            target: selector,
            value: value
        };
        if (this.recordHTML) {
            item = this.mergeHTMLDiff(item);
        }
        this.history.push(item);
    }

    captureValue(selector: string, variable: string): string {
        let value = <string>$(selector).text() || ($(selector).val() as string);
        _.set(this.environment, `variables.${variable}`, value);
        let item = <RecordingHistory>{
            event: "capture",
            target: selector,
            value: variable
        };
        this.history.push(item);
        return value;
    }

    insertValue(selector: string, value: string) {
        let element = document.querySelector(selector);
        let context = new GlobalContext(this.environment);
        let result = context.parse(value.trim());
        element.setAttribute("value", result);
        let item = <RecordingHistory>{
            event: "change",
            target: selector,
            value: value
        };
        if (this.recordHTML) {
            item = this.mergeHTMLDiff(item);
        }
        this.history.push(item);
    }

    startRecording(body = document.body, recordHTML = false): Promise<RecordingHistory[]> {
        this.body = body;
        this.recordHTML = recordHTML;
        if (recordHTML) {
            try {
                this.history = JSON.parse(localStorage.getItem("bfx-history")) || [];
            } finally {
                localStorage.removeItem("bfx-history");
            }
        }
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._stopEventListener = () => this.stopRecording();

            this._selectorEventListener = (e) => {
                let target = <Element>e.target;
                e.target["_bfxSelector"] = unique(<HTMLElement>target);
                if (!this.recordHTML) {
                    this._diffEventListener(e);
                }
            };
            this._diffEventListener = (e) => {
                let context = new GlobalContext(this.environment);
                if (e.type == "keydown" && !isValidKeyboardEvent(e)) {
                    return;
                }
                let element = <HTMLElement>e.target;
                if (
                    element.className.indexOf("active") > -1 &&
                    element.parentElement.className.indexOf("active") > -1
                ) {
                    return;
                }
                let item: RecordingHistory = {
                    event: e.type,
                    target: e.target["_bfxSelector"] || unique(<HTMLElement>e.target)
                };
                if (this.recordHTML) {
                    item = this.mergeHTMLDiff(item);
                }
                if (item.target.indexOf("basicContext") !== -1) {
                    return;
                }
                if (item.event === "focus") {
                    if (!e.target["value"]) {
                        return;
                    }
                    let lastEvent = this.history[this.history.length - 1] || { value: "", event: "", target: "" };
                    if (lastEvent.target == item.target) {
                        return;
                    }
                    item.event = "change";
                }
                if (item.event === "change") {
                    item.value = e.target["value"];
                    let lastEvent = this.history[this.history.length - 1] || { value: "", event: "" };
                    let lastValue = lastEvent.value || "";
                    if (lastEvent.event === "change" && lastValue === item.value.trim()) {
                        return;
                    }
                    lastValue = context.parse(lastValue.trim());
                    // Avoid duplicate change events.
                    if (lastEvent.event === "change" && lastValue === item.value.trim()) {
                        return;
                    }
                }
                if (item.event === "keydown") {
                    item.event = "change";
                    let key = ALLOWED_KEYBOARD_EVENTS[(<KeyboardEvent>e).key];
                    if (key === "F9") {
                        if (this.hotkey) {
                            this.hotkey(e);
                        } else {
                            this.stopRecording();
                        }
                        return;
                    }
                    item.value = e.target["value"] + key;
                }
                this.history.push(item);
                chrome.setActiveRecordingSession({
                    history: this.history,
                    environment: this.environment,
                    fixture: this.fixture
                });
                console.log(item);
            };
            let bodies: HTMLElement[] = [];
            bodies.push(this.body);
            Array.from(document.body.querySelectorAll("iframe")).forEach((frame) => {
                try {
                } catch (e) {
                    let body = _.get(frame, "contentWindow.document.body");
                    if (body) {
                        let selector = "iframe" + unique(frame);
                        body.setAttribute("bfx-frame", selector);
                        bodies.push(body);
                    }
                }
            });
            window.addEventListener("beforeunload", (event) => {
                if (!this.isRecording) {
                    return;
                }
                if (this.recordHTML) {
                    localStorage.setItem("bfx-history", JSON.stringify(this.history));
                }
            });
            bodies.forEach((body) => {
                body.ownerDocument.addEventListener("click", this._selectorEventListener, {
                    capture: true,
                    passive: true
                });
                body.ownerDocument.addEventListener("focus", this._selectorEventListener, {
                    capture: true,
                    passive: true
                });
                if (this.recordHTML) {
                    body.addEventListener("click", this._diffEventListener);
                }
                body.ownerDocument.addEventListener("change", this._diffEventListener, {
                    capture: true,
                    passive: true
                });
                body.ownerDocument.addEventListener("keydown", this._diffEventListener, { capture: true });
            });
        });
    }
}

export { PageRecorder, RecordingHistory };
