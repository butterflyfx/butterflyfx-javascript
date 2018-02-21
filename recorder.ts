import * as DiffDOM from 'diff-dom';
import unique from 'unique-selector';
import Handlebars from 'handlebars';
import { ITestEnvironment } from './protos';

interface Differ {
    diff: Function;
}

let dd = <any>new DiffDOM();

interface RecordingHistory {
    event: string;
    target: string;
    diff: any;
    value?: string;
}

const ALLOWED_KEYBOARD_EVENTS = {
    "Enter": "\n",
    "Tab": "\t"
}

function isValidKeyboardEvent(e: Event) {
    let event = <KeyboardEvent>e;
    return Object.keys(ALLOWED_KEYBOARD_EVENTS).indexOf(event.key) !== -1;
}

class PageRecorder {
    public environment: ITestEnvironment;
    private body = document.body;
    private _originalBody: Node;
    private _resolve: Function;
    private history: RecordingHistory[] = [];

    private _stopEventListener: EventListener;
    private _selectorEventListener: EventListener;
    private _diffEventListener: EventListener;

    stopRecording(): RecordingHistory[] {
        this.body.removeEventListener('change', this._diffEventListener);
        this._resolve(this.history);
        return this.history;
    }

    expectValue(selector: string, value: string) {
        let diff = dd.diff(this._originalBody, this.body);
        this.history.push({
            event: "expect",
            target: selector,
            diff: diff,
            value: value
        });
    }

    insertValue(selector: string, value: string) {
        let diff = dd.diff(this._originalBody, this.body);
        let element = document.querySelector(selector)
        let result = Handlebars.compile(value.trim())(this.environment.variables)
        element.setAttribute('value', result);
        this.history.push({
            event: "change",
            target: selector,
            diff: diff,
            value: value
        });
    }

    startRecording(body = document.body): Promise<RecordingHistory[]> {
        this.body = body;
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            let original = this.body.cloneNode(true);
            this._originalBody = original;
            this._stopEventListener = () => this.stopRecording();

            this._selectorEventListener = (e) => {
                let target = <Element>e.target;
                e.target['_bfxSelector'] = unique(target);
            };
            this._diffEventListener = (e) => {
                if (e.type == 'keydown' && !isValidKeyboardEvent(e)) {
                    return;
                }
                let diff = dd.diff(original, this.body);
                let item: RecordingHistory = {
                    event: e.type,
                    target: e.target['_bfxSelector'] || unique(e.target),
                    diff,
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