import RandomContext from './random';
import Handlebars from "handlebars";
import { TestEnvironment } from "../common";


export default class GlobalContext {
    public Random = new RandomContext();

    private _environment: TestEnvironment;

    constructor(environment: TestEnvironment) {
        this._environment = environment;
    }

    parse(value: string): string {
        let context = Object.assign({}, this, this._environment.variables);
        let result = Handlebars.compile(value.trim())(context);
        return result;
    }


}