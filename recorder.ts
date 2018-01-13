import * as DiffDOM from 'diff-dom';
import unique from 'unique-selector';

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

class PageRecorder {
    private body = document.body;
    private _resolve: Function;
    private history: RecordingHistory[] = [];

    private _stopEventListener: EventListener;
    private _selectorEventListener: EventListener;
    private _diffEventListener: EventListener;

    stopRecording() {
        this.body.removeEventListener('contextmenu', this._stopEventListener);
        this.body.removeEventListener('contextmenu', this._stopEventListener);
        this.body.removeEventListener('change', this._diffEventListener);
        this._resolve(this.history);
    }

    startRecording(body = document.body): Promise<RecordingHistory[]> {
        this.body = body;
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            let original = this.body.cloneNode(true);
            this._stopEventListener = () => this.stopRecording();

            this._selectorEventListener = (e) => {
                let target = <Element>e.target;
                e.target['_bfxSelector'] = unique(target);
            };
            this._diffEventListener = (e) => {
                let diff = dd.diff(original, document.body);
                let item: RecordingHistory = {
                    event: e.type,
                    target: e.target['_bfxSelector'],
                    diff,
                }
                if (item.event === "change") {
                    item.value = e.target['value'];
                }
                this.history.push(item);
                console.log(item);
            };
            this.body.addEventListener('click', this._selectorEventListener, { capture: true, passive: true });
            this.body.addEventListener('click', this._diffEventListener);
            this.body.addEventListener('change', this._diffEventListener);
            this.body.addEventListener('contextmenu', this._stopEventListener);
        })

    }
}

export { PageRecorder, RecordingHistory } 