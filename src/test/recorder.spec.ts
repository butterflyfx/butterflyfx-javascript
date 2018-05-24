import { PageRecorder, RecordingHistory } from "../recorder";
import { expect } from "chai";
import { describe, it } from "mocha";
import { EventRecording } from "../protos";

describe("PageRecorder", () => {
    let scratch: HTMLElement;
    let recorder: PageRecorder;

    beforeEach(() => {
        scratch = document.createElement("div");
        document.body.appendChild(scratch);
        recorder = new PageRecorder();
    });

    afterEach(() => {
        document.body.removeChild(scratch);
    });

    describe("insertValue()", () => {
        let element: HTMLElement;
        let selector: string;

        beforeEach(() => {
            element = <HTMLElement>document.createElement("input");
            element.id = "input-form";
            selector = `#${element.id}`;
            element.setAttribute("type", "text");
            scratch.appendChild(element);
        });

        afterEach(() => {
            scratch.removeChild(element);
        });

        it("should insert value into form element'", () => {
            recorder.insertValue(selector, "Hello world");
            expect(element.getAttribute("value")).to.equal("Hello world");
        });

        it("should parse environment variables'", () => {
            recorder.environment.variables["foo"] = "bar";
            recorder.insertValue(selector, "Hello {{ foo }}");
            expect(element.getAttribute("value")).to.equal("Hello bar");
        });

        it("should parse global random variables'", () => {
            recorder.insertValue(selector, "Hello {{ Random.Email }}");
            expect(element.getAttribute("value").indexOf("@")).not.to.equal(-1);
            window["recorder"] = recorder;
            console.log(recorder["history"]);
        });
    });

    describe("captureValue()", () => {
        let input: HTMLInputElement;
        let element: HTMLElement;
        let selector: string;

        beforeEach(() => {
            input = <HTMLInputElement>document.createElement("input");
            input.id = "input-form";
            input.setAttribute("type", "text");
            element = <HTMLElement>document.createElement("div");
            element.innerText = "Hello world";
            element.id = "text-div";
            scratch.appendChild(input);
            scratch.appendChild(element);
        });

        afterEach(() => {
            scratch.removeChild(input);
            scratch.removeChild(element);
        });

        it("should capture value from form element'", () => {
            input.setAttribute("value", "Hello world");
            recorder.captureValue("#input-form", "foo");
            let lastEvent: RecordingHistory = recorder["history"][recorder["history"].length - 1];
            expect(lastEvent.value).to.equal("foo");
            expect(recorder.environment.variables["foo"]).to.equal("Hello world");
        });

        it("should capture value from form element'", () => {
            element.innerText = "Hello foo";
            recorder.captureValue("#text-div", "foo");
            let lastEvent: RecordingHistory = recorder["history"][recorder["history"].length - 1];
            expect(lastEvent.value).to.equal("foo");
            expect(recorder.environment.variables["foo"]).to.equal("Hello foo");
        });
    });
});
