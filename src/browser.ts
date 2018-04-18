import BaseClient from "./client";
import WindowMessageHandler from "./window-message-handler";
import { u } from "umbrellajs";
import uniqueSelector from "unique-selector";
import * as picomodal from "picomodal";
import { PageRecorder, RecordingHistory } from "./recorder";
import * as basicContext from "basiccontext";
import * as chrome from "./chrome";

import YakuPromise from "yaku";
global.Promise = YakuPromise;

import Fixture from "./api/fixture";

let WEB_HOST = window["BUTTERFLYFX_WEB_HOST"] || "https://www.butterflyfx.io";

interface CrossPlatformStyleSheet extends StyleSheet {
    insertRule;
}

interface CrossPlatformStyleElement extends HTMLStyleElement {
    styleSheet;
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

function generateStyleSheet(ruleset): CrossPlatformStyleElement {
    var style = <CrossPlatformStyleElement>document.createElement("style");
    style.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(style);
    let sheet;
    if (style.sheet) {
        sheet = <CrossPlatformStyleSheet>style.sheet;
    } else if (style.styleSheet) {
        sheet = <CrossPlatformStyleSheet>style.styleSheet;
    } else {
        return;
    }
    Object.keys(ruleset).forEach((name) => {
        let rules = ruleset[name];
        if (!sheet.insertRule) {
            sheet.addRule(name, rules);
        } else {
            sheet.insertRule(name + "{" + rules + "}", 0);
        }
    });
    return style;
}

const SELECTOR_RECORDING = "SELECTOR_RECORDING";

export default class ButterflyFX extends BaseClient {
    private _stylesheet: CrossPlatformStyleElement;
    private messageHandler;
    private lastSelectedElement: HTMLElement;

    project: number;

    generateStyleSheet() {
        this._stylesheet = generateStyleSheet({
            ".butterflyfx-fixture-selector > *": "opacity: 0.25;",
            ".butterflyfx-fixture-selector .active": "opacity: 1",
            ".butterflyfx-fixture-selector .active.selected": "border: 3px solid red !important;",
            ".butterflyfx-fixture-selector .active ~ *, .butterflyfx-fixture-selector .active > *:not(.active)":
                "opacity: 0.25"
        });
        this._stylesheet.id = "butterflyfx-fixture-stylesheet";
    }

    removeStyleSheet() {
        if (!this._stylesheet) {
            this._stylesheet = <CrossPlatformStyleElement>document.getElementById("butterflyfx-fixture-stylesheet");
        }
        this._stylesheet.parentElement.removeChild(this._stylesheet);
    }

    tunnel(address: string) {
        console.error("Tunneling not available through browser");
    }

    selectFixtureElement(highlightSelected = false): Promise<string> {
        let className = "butterflyfx-fixture-selector";
        let body = u(document.body.parentElement);
        body.addClass(className);
        let clearClasses = (el) => {
            el.removeClass("active");
            el.removeClass("selected");
            let parent = el.nodes[0];
            while (parent) {
                u(parent).removeClass("active");
                parent = parent.parentElement;
            }
        };
        let highlightSelectedFixture = (e) => {
            clearClasses(u(".active.selected"));
            let element;
            if (!(e.ctrlKey || highlightSelected)) {
                element = u(document.body);
            } else if (e.target === document.body.parentElement) {
                element = u(document.body);
            } else if (e.type === "keydown") {
                let hoveredElements = document.querySelectorAll(":hover");
                element = u(hoveredElements[hoveredElements.length - 1]);
            } else {
                element = u(e.target);
            }
            let parent = e.target.parentElement;
            while (parent) {
                u(parent).addClass("active");
                u(parent).removeClass("selected");
                parent = parent.parentElement;
            }
            element.addClass("active");
            element.addClass("selected");
            element.on("mouseout", () => {
                clearClasses(element);
            });
            this.lastSelectedElement = element.first();
        };
        return new Promise((resolve, reject) => {
            let showFixtureDialog = (e) => {
                e.preventDefault();
                body.removeClass(className);
                body.off("mouseover", highlightSelectedFixture);
                body.off("keydown", highlightSelectedFixture);
                document.body.removeEventListener("click", showFixtureDialog, true);
                body.off("contextmenu", showFixtureDialog);
                let element = u(e.target);
                element.trigger("mouseout");
                if (e.type === "contextmenu") {
                    e.stopPropagation();
                    resolve(SELECTOR_RECORDING);
                } else if (
                    this.lastSelectedElement !== document.body &&
                    this.lastSelectedElement !== document.body.parentElement
                ) {
                    clearClasses(u(e.target));
                    let selector = unique(e.target).replace("html > body > ", "");
                    e.stopPropagation();
                    resolve(selector);
                } else {
                    e.stopPropagation();
                    resolve(null);
                }
            };
            body.on("mouseover", highlightSelectedFixture);
            body.on("keydown", highlightSelectedFixture);
            document.body.addEventListener("click", showFixtureDialog, true);
            body.on("contextmenu", showFixtureDialog);
        });
    }

    _generateRecordingContextMenu(recording: PageRecorder) {
        this.generateStyleSheet();
        this._stylesheet.innerHTML =
            this._stylesheet.innerHTML +
            `
        .basicContext,.basicContext *{box-sizing:border-box}.basicContextContainer{position:fixed;width:100%;height:100%;top:0;left:0;z-index:1000;-webkit-tap-highlight-color:transparent}.basicContext{position:absolute;opacity:0;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.basicContext__item{cursor:pointer}.basicContext__item--separator{float:left;width:100%;height:1px;cursor:default}.basicContext__item--disabled{cursor:default}.basicContext__data{min-width:140px;padding-right:20px;text-align:left;white-space:nowrap}.basicContext__icon{display:inline-block}.basicContext--scrollable{height:100%;-webkit-overflow-scrolling:touch;overflow-y:auto}.basicContext--scrollable .basicContext__data{min-width:160px}
        .basicContext{padding:6px;background-color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.4),0 0 1px rgba(0,0,0,.2);border-radius:3px}.basicContext__item{margin-bottom:2px}.basicContext__item--separator{margin:4px 0;background-color:rgba(0,0,0,.1)}.basicContext__item--disabled{opacity:.5}.basicContext__item:last-child{margin-bottom:0}.basicContext__data{padding:6px 8px;color:#333;border-radius:2px}.basicContext__item:not(.basicContext__item--disabled):hover .basicContext__data{color:#fff;background-color:#4393e6}.basicContext__item:not(.basicContext__item--disabled):active .basicContext__data{background-color:#1d79d9}.basicContext__icon{margin-right:10px;width:12px;text-align:center}
        `;
        let items;
        let showContext = (e) => basicContext.show(items, e);
        document.body.addEventListener("contextmenu", showContext);
        items = [
            {
                title: "Insert value",
                icon: "ion-plus-round",
                fn: (e) => {
                    window.requestAnimationFrame(() => {
                        this.selectFixtureElement(true).then((selector) => {
                            let element = document.querySelector(selector);
                            if (element.tagName != "INPUT") {
                                return;
                            }
                            let text = u(selector).text();
                            let result = prompt("Enter value or use {{ variable }} for an environment variable", text);
                            if (result) {
                                recording.insertValue(selector, result);
                            }
                        });
                    });
                    return false;
                }
            },
            {
                title: "Expect value",
                icon: "ion-plus-round",
                fn: (e) => {
                    window.requestAnimationFrame(() => {
                        this.selectFixtureElement(true).then((selector) => {
                            let text = u(selector).text();
                            let result = prompt("Enter expected value", text);
                            recording.expectValue(selector, result);
                        });
                    });
                    return false;
                }
            },
            {},
            {
                title: "Stop recording",
                icon: "ion-log-out",
                fn: (e) => {
                    e.stopPropagation();
                    recording.stopRecording();
                    document.body.removeEventListener("contextmenu", showContext);
                    basicContext.close();
                }
            }
        ];
    }

    private showSaveDialog(fixture) {
        let modal = picomodal({
            content: `<iframe id="bfx-frame" style="height: 50vh; min-height: 400px; min-width: 420px; width: 100%; border: none" src="${WEB_HOST}/dash/bookmarklet"></iframe>`,
            width: "50vw",
            height: "50vh"
        })
            .afterClose(function (modal) {
                modal.destroy();
            })
            .show();
        let element = <HTMLFrameElement>document.querySelector("#bfx-frame");
        this.messageHandler = new WindowMessageHandler(element.contentWindow, null, null);
        this.messageHandler.addActionHandler("onPageClose", (...args) => {
            modal.close();
        });
    }

    showSelectionDialog() {
        let fixture = this.generateFixture();
        picomodal({
            content: `<iframe id="bfx-selection-frame" style="height: 25vh; width: 100%; border: none; margin-left: -10px" src="${WEB_HOST}/dash/selection"></iframe>`,
            width: "25vw",
            height: "25vh",
            modalStyles: { "min-width": "420px" },
            closeButton: false
        })
            .afterCreate((modal) => {
                let element = <HTMLFrameElement>document.querySelector("#bfx-selection-frame");
                this.generateStyleSheet();
                this.messageHandler = new WindowMessageHandler(element.contentWindow, null, null);
                this.messageHandler.addActionHandler("onStartRecording", (_, payload) => {
                    modal.close();
                    let recording = new PageRecorder([], fixture);
                    if (payload && payload.environments && payload.environments.length) {
                        recording.environment = payload.environments[0];
                        let variables = {};
                        payload.environments[0].variables.forEach((item) => {
                            variables[item.key] = item.value;
                        });
                        recording.environment.variables = variables;
                    }
                    this._generateRecordingContextMenu(recording);
                    recording.startRecording().then((history) => {
                        if (history.length > 0) {
                            fixture.revision.rules = JSON.stringify(history);
                        }
                        this.showSaveDialog(fixture);
                    });
                });
                this.messageHandler.addActionHandler("onGenerateSnapshot", (...args) => {
                    modal.close();
                    this.selectFixtureElement().then((selector) => {
                        if (selector) {
                            fixture.selector = selector;
                        }
                        this.showSaveDialog(fixture);
                    });
                });
                this.messageHandler.addActionHandler("onPageClose", (...args) => {
                    modal.close();
                });
            })
            .afterClose((modal, event) => {
                modal.destroy();
            })
            .show();
    }

    showFixtureDialog() {
        chrome.getActiveRecordingSession().then((session) => {
            if (session) {
                let fixture = this.generateFixture();
                let recording = new PageRecorder(session.history, session.fixture);
                recording.environment = session.environment;
                this._generateRecordingContextMenu(recording);
                recording.startRecording().then((history) => {
                    if (history.length > 0) {
                        fixture.revision.rules = JSON.stringify(history);
                    }
                    this.showSaveDialog(fixture);
                });
            } else {
                this.showSelectionDialog();
            }
        });
    }
}
