import {APIResource, API_HOST} from './api-resource';
export default class Project extends APIResource{

    static get _basePath() { return "projects"; }

    constructor(data){
        super(data);
        this._basePath = Project._basePath;
    }
}