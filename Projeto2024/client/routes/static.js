const express = require('express');
const router = express.Router();
const { dataAPI } = require('../utils');
const url = require('url');
const http = require('http');
const https = require('https');

const ProxyServer = (path) => {
    const dt = dataAPI + path;

    return (req, res) => {
        const parsedUrl = url.parse(dt + req.path);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.path,
            method: 'GET',
            headers: req.headers,
        };
        const protocolModule = parsedUrl.protocol === 'https:' ? https : http;

        const apiReq = protocolModule.request(options,
            (apiRes) => {
                res.writeHead(apiRes.statusCode, apiRes.headers);
                apiRes.pipe(res, { end: true });
            }).on('error', (err) => {
                res.status(500).json({ error: err });
            });

        req.pipe(apiReq, { end: true });
    }
}

router.get('*', ProxyServer('/static'));

module.exports = router;
