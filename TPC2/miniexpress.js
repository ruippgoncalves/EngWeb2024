import http from 'http';
import url from 'url';
import {renderMJinja2} from "./minijinja2.js";
import path from "path";
import fs from "fs";

export class MiniRouter {
    _middlewares;
    _path;

    constructor() {
        this._middlewares = [];
        this._path = '/';
    }

    use(handler) {
        this._middlewares.push({path: '*', method: '*', handler});
    }

    get(path, handler) {
        this._middlewares.push({path, method: 'GET', handler});
    }

    route(path, router) {
        this._middlewares.push({path, method: '*', handler: (req, res, next) => router._handleRequest(req, res, next)});
        router._path = this._pathJoin(path);
    }

    _pathJoin(p) {
        let base = this._path;
        let final = p;

        if (base.endsWith('/')) base = base.slice(0, -1);
        if (!final.startsWith('/')) final = '/' + final;

        return base + final;
    }

    _normalizePath(p) {
        let final = p;

        if (!final.endsWith('/')) final = final + '/';

        return final;
    }

    _matchRoute(route, url) {
        const routeParts = route.split('/');
        const urlParts = this._normalizePath(url).split('/');
        let matched = false;
        let params = {};

        if (urlParts.length >= routeParts.length) {
            matched = true;

            for (let i = 0; i < routeParts.length && matched; i++) {
                if (routeParts[i].startsWith(':')) {
                    const paramName = routeParts[i].slice(1);
                    params[paramName] = urlParts[i];
                } else if (routeParts[i] === '*') {
                } else if (routeParts[i] !== urlParts[i]) {
                    matched = false;
                }
            }
        }

        return matched ? {matched, params} : {matched};
    }

    _findNext(req, res, prevNext) {
        let cur = -1;

        const next = () => {
            cur += 1;

            // If the current middleware matched nothing let's continue with the previous one
            if (cur === this._middlewares.length) {
                prevNext();
                return;
            }

            const middleware = this._middlewares[cur];
            const curPath = this._pathJoin(middleware.path);
            const {matched, params = {}} = this._matchRoute(curPath, req.url.pathname);

            if (matched) {
                req.params = {...req.params, ...params};
                middleware.handler(req, res, next);
            } else {
                next();
            }
        };

        return next;
    }

    _handleRequest(req, res, next) {
        let n = this._findNext(req, res, next);
        n();
    }
}

export class MiniExpress extends MiniRouter {
    constructor() {
        super();
    }

    _fillReq(req) {
        req.url = url.parse(req.url, true);
    }

    _fillRes(res) {
        res.status = (code) => {
            res.statusCode = code || res.statusCode;

            return res;
        };

        res.sendHTML = (content) => {
            res.setHeader('Content-Type', 'text/html');
            res.write(content);
            res.end();

            return res;
        }

        res.sendMJinja2 = (template, data, load = true) => {
            res.sendHTML(renderMJinja2(template, data, load));

            return res;
        }

        res.redirect = (url) => {
            res.setHeader('Location', url);
            res.status(301);
            res.end();

            return res;
        }

        res.json = (content) => {
            content = JSON.stringify(content);
            res.setHeader('Content-Type', 'application/json');
            res.write(content);
            res.end();

            return res;
        }
    }

    listen(port, callback) {
        const server = http.createServer((req, res) => {
            this._fillReq(req);
            this._fillRes(res);

            this._handleRequest(req, res, () => {
                res.status(404);
                res.end()
            });
        });

        server.listen(port, callback);

        return server;
    }
}
