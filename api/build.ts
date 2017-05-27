import {APIResource, API_HOST} from './api-resource';
export default class Build extends APIResource{

    static get _basePath() { return "builds"; }

    constructor(data){
        super(data);
        this._basePath = Build._basePath;
    }
}