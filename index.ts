export { tunnel } from './tunnel';
import * as api from './api';
import Fixture from './api/fixture';
import { API_HOST, APIResource } from './api/api-resource';
import WindowMessageHandler from './window-message-handler';
import { u } from 'umbrellajs';
import unique from 'unique-selector';
import * as picomodal from 'picomodal';
interface Window { BUTTERFLYFX_API_HOST: string; }

let WEB_HOST = window['BUTTERFLYFX_API_HOST'] || "https://www.butterflyfx.io";


function generateStyleSheet(ruleset) {
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if (!style.sheet) {
        return;
    }
    Object.keys(ruleset).forEach((name) => {
        let rules = ruleset[name];
        if (!style.sheet.insertRule) {
            (style.styleSheet || style.sheet).addRule(name, rules);
        }
        else {
            style.sheet.insertRule(name + "{" + rules + "}", 0);
        }

    });
    return style;
}


export class ButterflyFXClient {
    private _stylesheet;
    private messageHandler;

    project: number;

    constructor({ project = null, token = null } = {}) {
        this.project = project;
        if (token) {
            APIResource.setToken("Bearer", token);
        }
    }

    generateStyleSheet() {
        this._stylesheet = generateStyleSheet({
            ".butterflyfx-fixture-selector > *": "opacity: 0.25;",
            ".butterflyfx-fixture-selector .active": "opacity: 1",
            ".butterflyfx-fixture-selector .active.selected": "border: 1px solid red !important;",
            ".butterflyfx-fixture-selector .active ~ *, .butterflyfx-fixture-selector .active > *:not(.active)": "opacity: 0.25"
        });
        this._stylesheet.id = "butterflyfx-fixture-stylesheet";
    }

    removeStyleSheet() {
        if (!this._stylesheet) {
            this._stylesheet = document.getElementById("butterflyfx-fixture-stylesheet")
        }
        this._stylesheet.parentElement.removeChild(this._stylesheet);
    }


    generateFixture(data = {}) {
        let fixture = new Fixture(data);
        if (this.project) {
            fixture.project = this.project;
        }
        fixture.generateRevision(data);
        return fixture;
    }

    selectFixtureElement(): Promise<string> {
        this.generateStyleSheet();
        let className = "butterflyfx-fixture-selector";
        let body = u(document.body.parentElement);
        body.addClass(className);
        let highlightSelectedFixture = (e) => {
            let element;
            if (e.target === document.body.parentElement) {
                element = u(document.body);
            }
            else {
                element = u(e.target);
            }
            let parent = e.target.parentElement;
            while (parent) {
                u(parent).addClass('active');
                u(parent).removeClass('selected');
                parent = parent.parentElement
            }
            element.addClass('active');
            element.addClass('selected');
            element.on('mouseout', () => {
                element.removeClass('active');
                element.removeClass('selected');
                let parent = e.target.parentElement;
                while (parent) {
                    u(parent).removeClass('active');
                    parent = parent.parentElement
                }
            })
        };
        return new Promise(function (resolve, reject) {
            let showFixtureDialog = (e) => {
                e.preventDefault();
                body.removeClass(className);
                body.off('mouseover', highlightSelectedFixture);
                body.off('click', showFixtureDialog);
                body.off('contextmenu', showFixtureDialog);
                let element = u(e.target);
                element.trigger('mouseout');
                if (e.type == "contextmenu") {
                    resolve(null);
                }
                else if (e.target !== document.body && e.target !== document.body.parentElement) {
                    let selector = unique(e.target).replace("html > body > ", "");
                    resolve(selector);
                }
                else {
                    resolve(null);
                }
            }
            body.on('mouseover', highlightSelectedFixture);
            body.on('click', showFixtureDialog);
            body.on('contextmenu', showFixtureDialog);
        });
    }

    showFixtureDialog() {
        let fixture = this.generateFixture();
        this.selectFixtureElement().then((selector) => {
            if (selector) {
                fixture.selector = selector;
            }
            let modal = picomodal({
                'content': `<iframe id="bfx-frame" style="height: 50vh; min-height: 400px; width: 100%; border: none" src="${WEB_HOST}/dash/bookmarklet"></iframe>`,
                'width': '50vw',
                'height': '50vh',
            }).afterClose(function (modal) { modal.destroy(); }).show();
            let element = <HTMLFrameElement>document.querySelector('#bfx-frame');
            this.messageHandler = new WindowMessageHandler(element.contentWindow, null, null);
            this.messageHandler.addActionHandler('onPageLoad', (...args) => {
                this.messageHandler.sendMessage("setFixture", fixture)
            });
            this.messageHandler.addActionHandler('onPageClose', (...args) => {
                modal.close();
            });
        })
    }

    saveFixture(fixture) {
        // Check if we're supplied data vs an actual fixture object
        if (!(fixture && fixture.revision && fixture.revision.html)) {
            fixture = this.generateFixture(fixture);
        }
        return Fixture.save(fixture);
    }
}

