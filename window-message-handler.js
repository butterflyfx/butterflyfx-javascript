"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowMessageHandler = /** @class */ (function () {
    function WindowMessageHandler(target, targetOrigin, source) {
        var _this = this;
        this.target = target || window;
        this.targetOrigin = targetOrigin || '*';
        this.responseHandlers = {};
        this.actionHandlers = {};
        this.listener = function (event) {
            _this.handleMessage(event);
        };
        source = source || window;
        source.addEventListener("message", this.listener, false);
    }
    WindowMessageHandler.prototype.addActionHandler = function (key, value) {
        if (typeof (value) !== "function") {
            throw new Error("Action handler value must be a function");
        }
        this.actionHandlers[key] = value;
    };
    WindowMessageHandler.prototype.handleMessage = function (event) {
        var data = event.data;
        var handlers = this.actionHandlers;
        if (data.action === "_response") {
            this.handleResponse(data);
        }
        else if (data.action) {
            var callback = handlers[data.action];
            var result = this.handleAction(data.action, data.payload);
            if (!data.responseId) {
                return;
            }
            if (result) {
                // Return a response using the response id given
                event.source.postMessage({ action: "_response", payload: result, responseId: data.responseId }, event.origin);
            }
        }
    };
    WindowMessageHandler.prototype.handleAction = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callback = this.actionHandlers[name];
        if (!callback) {
            return;
        }
        return callback.apply(void 0, args);
    };
    WindowMessageHandler.prototype.disconnect = function () {
        window.removeEventListener('message', this.listener);
    };
    WindowMessageHandler.prototype.handleResponse = function (data) {
        if (this.responseHandlers[data.responseId] && typeof (this.responseHandlers[data.responseId]) === "function") {
            this.responseHandlers[data.responseId](data.payload);
        }
    };
    WindowMessageHandler.prototype.sendMessage = function (action, payload, responseId) {
        var _this = this;
        if (payload === void 0) { payload = null; }
        // Genreate a unique id for this message's response
        if (!responseId) {
            responseId = Date.now() + Math.random().toString(16).substring(2);
        }
        return new Promise(function (resolve, reject) {
            _this.responseHandlers[responseId] = resolve;
            // Send a json serializable clone of the payload to ensure compatibility
            payload = JSON.parse(JSON.stringify(payload));
            _this.target.postMessage({ action: action, payload: payload, responseId: responseId }, _this.targetOrigin);
        });
    };
    return WindowMessageHandler;
}());
exports.default = WindowMessageHandler;
