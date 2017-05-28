import { tunnel, TunnelOptions } from './tunnel';
import * as api from './api';
import Fixture from './api/fixture';
import { API_HOST, APIResource } from './api/api-resource';

let WEB_HOST = "https://www.butterflyfx.io";


export default class ButterflyFXClient {
    private _token;


    project: number;

    constructor({ project = null, token = null } = {}) {
        this.project = project;
        if (token) {
            APIResource.setToken("Bearer", token);
        }
        this._token = token;
    }

    tunnel(address: string) {
        let options = {
            projectId: this.project,
            address: address,
            apiKey: this._token
        };
        tunnel(options);
    }


    generateFixture(data = {}) {
        let fixture = new Fixture(data);
        if (this.project) {
            fixture.project = this.project;
        }
        fixture.generateRevision(data);
        return fixture;
    }

    saveFixture(fixture) {
        // Check if we're supplied data vs an actual fixture object
        if (!(fixture && fixture.revision && fixture.revision.html)) {
            fixture = this.generateFixture(fixture);
        }
        return Fixture.save(fixture);
    }
}

