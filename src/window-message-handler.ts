export default class WindowMessageHandler {
    private target;
    private targetOrigin;
    private responseHandlers: Map<string, Function>;
    private actionHandlers: Map<string, Function>;
    private listener;

    constructor(target: Window, targetOrigin: string, source: Window) {
        this.target = target || window;
        this.targetOrigin = targetOrigin || "*";
        this.responseHandlers = <Map<string, Function>>{};
        this.actionHandlers = <Map<string, Function>>{};
        this.listener = (event: MessageEvent) => {
            this.handleMessage(event);
        };
        source = source || window;
        source.addEventListener("message", this.listener, false);
    }

    addActionHandler(key, value) {
        if (typeof value !== "function") {
            throw new Error("Action handler value must be a function");
        }
        this.actionHandlers[key] = value;
    }

    handleMessage(event: MessageEvent) {
        let data = event.data;
        let handlers = this.actionHandlers;
        if (data.action === "_response") {
            this.handleResponse(data);
        } else if (data.action) {
            let callback = handlers[data.action];
            if (!this.target && callback) {
                this.target = event.source;
            }
            let result = this.handleAction(data.action, event, data.payload);
            if (!data.responseId) {
                return;
            }
            if (result) {
                // Return a response using the response id given
                event.source.postMessage(
                    { action: "_response", payload: result, responseId: data.responseId },
                    event.origin
                );
            }
        }
    }

    handleAction(name, ...args) {
        let callback = this.actionHandlers[name];
        if (!callback) {
            return;
        }
        return callback(...args);
    }

    disconnect() {
        window.removeEventListener("message", this.listener);
    }

    handleResponse(data) {
        if (this.responseHandlers[data.responseId] && typeof this.responseHandlers[data.responseId] === "function") {
            this.responseHandlers[data.responseId](data.payload);
        }
    }

    sendMessage(action, payload = null, responseId) {
        // Genreate a unique id for this message's response
        if (!responseId) {
            responseId =
                Date.now() +
                Math.random()
                    .toString(16)
                    .substring(2);
        }
        return new Promise((resolve, reject) => {
            this.responseHandlers[responseId] = resolve;
            // Send a json serializable clone of the payload to ensure compatibility
            payload = JSON.parse(JSON.stringify(payload));
            this.target.postMessage({ action: action, payload: payload, responseId: responseId }, this.targetOrigin);
        });
    }
}
