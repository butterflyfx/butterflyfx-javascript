import uniqueSelector from 'unique-selector';
import Handlebars from 'handlebars';
import { ITestEnvironment } from './protos';
import { parse, stringify } from 'himalaya';
const jsondiffpatch = require('jsondiffpatch').create();

interface RecordingHistory {
    event: string;
    target: string;
    diff?: any;
    html?: HTMLJSON;
    value?: string;
}

interface HTMLJSON {
    type: string,
    tagName: string,
    attributes: { key: string, value: string }[],
    children: HTMLJSON[],
}

const ALLOWED_KEYBOARD_EVENTS = {
    "Enter": "\n",
    "Tab": "\t"
}

function removeComments(nodes: HTMLJSON[]) {
    if (!nodes) {
        return;
    }
    return nodes.filter(node => {
        if (node.type === 'comment') {
            return false;
        }
        else {
            node.children = removeComments(node.children);
            return true;
        }
    })
}

let unique = (el) => {
    let id = el.id;
    if (el.id.indexOf('ember') === 0) {
        el.id = "";
    }
    let selector = uniqueSelector(el).replace("html > body > ", "");
    el.id = id;
    if (selector.indexOf('>') !== -1) {
        if (document.querySelectorAll(selector).length > 1) {
            let subselector = selector.split('>').pop();
            return unique(el.parentNode) + `> ${subselector}`;
        }
        else {
            return selector;
        }
    }
    return selector;
}

function isValidKeyboardEvent(e: Event) {
    let event = <KeyboardEvent>e;
    return Object.keys(ALLOWED_KEYBOARD_EVENTS).indexOf(event.key) !== -1;
}

class PageRecorder {
    private recordHTML = false;

    public environment: ITestEnvironment;
    private body = document.body;

    private _resolve: Function;
    private history: RecordingHistory[] = [];

    private _stopEventListener: EventListener;
    private _selectorEventListener: EventListener;
    private _diffEventListener: EventListener;

    private generateHTMLJSON(): HTMLJSON[] {
        if (!this.recordHTML) {
            return;
        }
        let doc = <HTMLElement>this.body.parentElement.cloneNode(true)
        let inputs = Array.from(doc.querySelectorAll("input"));
        inputs.forEach((e) => e.setAttribute('value', e.value));
        return removeComments(<HTMLJSON[]>parse(doc.outerHTML));
    }

    private mergeHTMLDiff(item: RecordingHistory): RecordingHistory {
        let output = {
            html: this.generateHTMLJSON(),
        }
        let lastEvent = this.history[this.history.length - 1];
        if (lastEvent && lastEvent.html) {
            output['diff'] = jsondiffpatch.diff(lastEvent.html, output.html)
        }
        return Object.assign({}, item, output);
    }

    stopRecording(): RecordingHistory[] {
        this.body.removeEventListener('change', this._diffEventListener);
        if (this.recordHTML) {
            this.history.forEach((item) => {
                if (item.diff) {
                    delete item.html;
                }
            })
        }
        this._resolve(this.history);
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

    insertValue(selector: string, value: string) {
        let element = document.querySelector(selector)
        let result = Handlebars.compile(value.trim())(this.environment.variables)
        element.setAttribute('value', result);
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

    startRecording(body = document.body, recordHTML = true): Promise<RecordingHistory[]> {
        this.body = body;
        this.recordHTML = recordHTML;
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._stopEventListener = () => this.stopRecording();

            this._selectorEventListener = (e) => {
                let target = <Element>e.target;
                e.target['_bfxSelector'] = unique(target);
            };
            this._diffEventListener = (e) => {
                if (e.type == 'keydown' && !isValidKeyboardEvent(e)) {
                    return;
                }
                let item: RecordingHistory = {
                    event: e.type,
                    target: e.target['_bfxSelector'] || unique(e.target),
                }
                if (this.recordHTML) {
                    item = this.mergeHTMLDiff(item);
                }
                if (item.target.indexOf('basicContext') !== -1) {
                    return;
                }
                if (item.event === "change") {
                    item.value = e.target['value'];
                    let lastEvent = this.history[this.history.length - 1];
                    let lastValue = lastEvent.value || "";
                    if (this.environment) {

                        lastValue = Handlebars.compile(lastValue.trim())(this.environment.variables);
                    }
                    else {
                        lastValue = lastValue.trim();
                    }
                    // Avoid duplicate change events.
                    if (lastEvent.event === "change" && lastValue === item.value.trim()) {
                        return;
                    }
                }
                if (item.event === "keydown") {
                    item.event = "change"
                    let key = ALLOWED_KEYBOARD_EVENTS[(<KeyboardEvent>e).key];
                    item.value = e.target['value'] + key;
                }
                this.history.push(item);
                console.log(item);
            };
            this.body.addEventListener('click', this._selectorEventListener, { capture: true, passive: true });
            this.body.addEventListener('focus', this._selectorEventListener, { capture: true, passive: true });
            this.body.addEventListener('click', this._diffEventListener);
            this.body.addEventListener('change', this._diffEventListener);
            this.body.addEventListener('keydown', this._diffEventListener, { capture: true, passive: true });

        })

    }
}

export { PageRecorder, RecordingHistory } 