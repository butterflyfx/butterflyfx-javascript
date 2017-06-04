"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
var fixture_1 = require("./api/fixture");
fixture_1.default._sha1 = function (str) { return crypto.createHash('sha1').update(str).digest('hex'); };
var client_1 = require("./client");
module.exports = client_1.default;
