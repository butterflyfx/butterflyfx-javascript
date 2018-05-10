
import GlobalContext from "../contexts/global";
import { expect } from 'chai';

describe("GlobalContext", () => {

    describe("Random", () => {
        it("Random.Email should generate an email'", () => {
            let context = new GlobalContext({ variables: {} });
            expect(!!context.Random.Email).to.equal(true);
            expect(context.Random.Email.length).not.to.equal(0);
            expect(context.Random.Email.indexOf("@")).not.to.equal(-1);
        });
    });

    describe("parse()", () => {
        it("should parse environment variables'", () => {
            let context = new GlobalContext({ variables: { "foo": "bar" } });
            let result = context.parse("Hello {{ foo }}");
            expect(result).to.equal("Hello bar");
        });

        it("should parse global random variables'", () => {
            let context = new GlobalContext({ variables: { "foo": "bar" } });
            let result = context.parse("Hello {{ Random.Email }}");
            expect(result.indexOf('@')).not.to.equal(-1);
        });
    })






});