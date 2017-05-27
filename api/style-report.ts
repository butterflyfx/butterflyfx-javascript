import {APIResource, API_HOST} from './api-resource';
export default class StyleReport extends APIResource{

    static get _basePath() { return "styles"; }

    constructor(data){
        super(data);
        this._basePath = StyleReport._basePath;
    }

    static getScreenshotsFromId(reportId=this.pk){
        return this.getJSON(`${API_HOST}styles/${reportId}/screenshots`);
    }
}