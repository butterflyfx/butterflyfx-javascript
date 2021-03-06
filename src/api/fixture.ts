import { APIResource, API_HOST } from "./api-resource";
import sha1 from "../lib/sha1";

let hashCode = function(aString) {
  // Normalize hashes by removing host references
  aString = aString.replace(new RegExp(window.location.host, "g"), "");
  var hash = 0,
    i,
    chr,
    len;
  if (aString.length == 0) return hash;
  for (i = 0, len = aString.length; i < len; i++) {
    chr = aString.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

let config = { resolution: { height: 900, width: 1440 } };

export interface FixtureRevision {
  html: string;
  path: string;
  hashkey: string;
  origin: string;
  rules: string;
}

export interface FixtureInterface {
  revision: FixtureRevision;
  slug: string;
  project: number;
}

export default class Fixture extends APIResource implements FixtureInterface {
  private _project: number;
  revision: FixtureRevision;
  slug: string;
  selector: string;
  recording: any[];

  static get _basePath() {
    return "fixtures";
  }

  constructor(data) {
    super(data);
  }

  get id() {
    return this.slug;
  }

  static pk(instance) {
    return instance.slug;
  }

  static _sha1(str): string {
    return sha1(str);
  }

  static generateRevision({ html = null, path = null } = {}) {
    let revision = <FixtureRevision>{};
    if (!html) {
      let body = document.body;
      body.style.height = config.resolution.height + "px";
      body.style.width = config.resolution.width + "px";
      // Get all elements in a page an convert them into an array
      let elements = [].slice.call(document.getElementsByTagName("*"));
      elements = elements.map(function(el) {
        // Strip scripts from the page since they'll be removed server side anyway
        if (el.tagName.toLowerCase() == "script") {
          el.parentNode.removeChild(el);
          return;
        }
        let style = getComputedStyle(el);
        if (style.display == "none" || style.visibility == "hidden") {
          return;
        }
        // Elements without an offset parent are hidden unless they're fixed
        if (style.position != "fixed" && !el.offsetParent) {
          return;
        }
      });
      html = new XMLSerializer().serializeToString(document);
      body.style.height = "";
      body.style.width = "";
    }
    revision.html = html;
    revision.path =
      path || (global["location"] ? window.location.pathname : "/");
    revision.hashkey = Fixture._sha1(html);
    revision.origin = global["location"] ? window.location.origin : "";
    return revision;
  }

  generateRevision({ html = null, path = null } = {}) {
    let revision = Fixture.generateRevision({ html, path });
    this.revision = revision;
    return revision;
  }

  static list(projectId): Promise<any[]> {
    projectId = projectId || "all";
    return this.getJSON(`${API_HOST}${this._basePath}/${projectId}`);
  }

  get project() {
    return this._project || 0;
  }

  set project(value) {
    this._project = value;
  }

  static getStyleReports(instance) {
    return this.getJSON(
      `${API_HOST}${this._basePath}/${instance.project}/${instance.slug}/styles`
    );
  }

  static generateBuild(instance) {
    return this.getJSON(
      `${API_HOST}${this._basePath}/${instance.project}/${instance.slug}/build`
    );
  }

  getStyleReports() {
    return Fixture.getStyleReports(this);
  }

  static delete(instance) {
    return super.postJSON(
      `${API_HOST}${this._basePath}/${instance.project}/${instance.slug}`,
      instance,
      "delete"
    );
  }

  delete() {
    return Fixture.delete(this);
  }

  static save(instance) {
    if (!instance.slug && instance.revision) {
      instance.slug = instance.revision.hashkey;
    }
    let pk = instance.oldSlug ? instance.oldSlug : instance.slug;
    delete instance.oldSlug;
    return super
      .postJSON(
        `${API_HOST}${this._basePath}/${instance.project}/${pk}`,
        instance,
        "put"
      )
      .catch(() => {
        return this.postJSON(
          `${API_HOST}${this._basePath}/${instance.project}`,
          Object.assign({ project: instance.project }, instance),
          "post"
        );
      });
  }

  save() {
    return Fixture.save(this);
  }
}
