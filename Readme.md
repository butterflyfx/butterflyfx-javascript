## Introduction

[ButterflyFX](http://www.butterflyfx.io) is a tool designed to test your CSS using data driven code instead of screenshots. 
You can find more info at http://www.butterflyfx.io 

You can install the javascript client by running 

    npm install butterflyfx-client



**All examples require [generating an API key](https://www.butterflyfx.io/dash/settings/api) from the website** before making any requests.

## Tunneling

ButterflyFX has the ability to connect to your localhost or any other internal resources through its tunneling feature. 

However, this feature does not work through the browser and requires using node or a node based task runner such as
gulp, grunt, karma, ember-cli, webpack, etc.


```javascript
// npm install butterflyfx-client
const API_KEY = "INSERT-API-KEY-HERE";
const PROJECT_ID = 0; // Replace with specific project id or leave as zero for default
const ButterflyFX = require('butterflyfx-client');
let client = new ButterflyFX({project:PROJECT_ID, token:API_KEY});
// Only works when run from a node based task runner.
// e.g karma.conf.js, gulpfile.js, ember-cli-build.js, etc
client.tunnel("localhost:8000");
```

## Adding a new fixture

You can create new fixtures from either the browser or node client. By default, the browser client 
captures the entire document, but you also specify any arbitary html document or html segment as a string. 

```javascript
const API_KEY = "INSERT-API-KEY-HERE";
const PROJECT_ID = 0;
const ButterflyFX = require('butterflyfx-client');
let client = new ButterflyFX({project:PROJECT_ID, token:API_KEY});
// An ordinary html string can be used here instead of document.querySelector 
let html = document.querySelector("html").outerHTML;
client.saveFixture({
  name: "Hello world",
  html: html
});
```
