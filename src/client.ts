import * as api from './api';
import Fixture from './api/fixture';
import Build from './api/build';
import urlify from './lib/urlify';
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


    build(projectId = this.project) {
        return Build.save({ project: projectId });
    }


    generateFixture(data = {}) {
        let fixture = new Fixture(data);
        if (this.project !== null) {
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
        if (!fixture.slug) {
            fixture.slug = urlify(fixture.name, 100);
        }
        return Fixture.save(fixture);
    }
}

