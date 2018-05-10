
import RandomContext from "../contexts/random";
import { expect } from 'chai';

describe("RandomContext", () => {

    describe("FirstName()", () => {
        it("should generate a name'", () => {
            let context = new RandomContext();
            expect(!!context.FirstName).to.equal(true);
            expect(context.FirstName.length).not.to.equal(0);
        });
    })

    describe("LastName()", () => {
        it("should generate a name'", () => {
            let context = new RandomContext();
            expect(!!context.LastName).to.equal(true);
            expect(context.LastName.length).not.to.equal(0);
        });
    });

    describe("FullName()", () => {
        it("should generate a name'", () => {
            let context = new RandomContext();
            expect(!!context.FullName).to.equal(true);
            expect(context.FullName.length).not.to.equal(0);
        });
    })

    describe("Email()", () => {
        it("should generate an email'", () => {
            let context = new RandomContext();
            expect(!!context.Email).to.equal(true);
            expect(context.Email.length).not.to.equal(0);
            expect(context.Email.indexOf("@")).not.to.equal(-1);
        });
    })

    describe("URL()", () => {
        it("should generate a valid URL'", () => {
            let context = new RandomContext();
            expect(!!context.URL).to.equal(true);
            expect(context.URL.length).not.to.equal(0);
            expect(context.URL.indexOf("/")).not.to.equal(-1);
            expect(context.URL.indexOf("://")).not.to.equal(-1);
        });
    })

    describe("PhoneNumber()", () => {
        it("should generate an phone number'", () => {
            let context = new RandomContext();
            expect(!!context.PhoneNumber).to.equal(true);
            expect(context.PhoneNumber.length).not.to.equal(0);
        });
    })

    describe("Sentence()", () => {
        it("should generate a valid sentence'", () => {
            let context = new RandomContext();
            expect(!!context.Sentence).to.equal(true);
            expect(context.Sentence.length).not.to.equal(0);
            expect(context.Sentence.indexOf(".")).not.to.equal(-1);
        });
    })

    describe("Paragraph()", () => {
        it("should generate a valid paragraph'", () => {
            let context = new RandomContext();
            expect(!!context.Paragraph).to.equal(true);
            expect(context.Paragraph.length).not.to.equal(0);
            expect(context.Paragraph.indexOf(".")).not.to.equal(-1);
        });
    })

    describe("Paragraph()", () => {
        it("should generate a valid paragraph'", () => {
            let context = new RandomContext();
            expect(!!context.Paragraph).to.equal(true);
            expect(context.Paragraph.length).not.to.equal(0);
            expect(context.Paragraph.indexOf(".")).not.to.equal(-1);
        });
    })

    describe("GUID()", () => {
        it("should generate a guid'", () => {
            let context = new RandomContext();
            expect(!!context.GUID).to.equal(true);
            expect(context.GUID.length).not.to.equal(0);
            expect(context.GUID.indexOf("-")).not.to.equal(-1);
        });
    })






});