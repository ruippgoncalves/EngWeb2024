const url = require("node:url");
const https = require("node:https");
const http = require("node:http");

module.exports.dataAPI = process.env.DATA_API || 'http://localhost:3000';
module.exports.clientURL = process.env.CLIENT_URL || 'http://localhost:5000';
