import http from 'http';
import url from 'url';
import {renderMJinja2} from "./minijinja2.js";
import fs from "fs";
import mime from "mime-types";
import * as path from "path";

export class MiniRouter {
    _middlewares;

    constructor() {
        this._middlewares = [];
    }

    _addMiddleware(path, method, handler) {
        if (handler instanceof MiniRouter) {
            const router = handler;
            handler = (req, res, next) => router._handleRequest(req, res, next);
        }

        this._middlewares.push({path, method, handler});
    }

    use(path, handler) {
        if (typeof path === 'function') {
            handler = path;
            path = '*';
        }

        this._addMiddleware(path, '*', handler);

        return this;
    }

    get(path, handler) {
        this._addMiddleware(path, 'GET', handler);

        return this;
    }

    _matchRoute(route, url) {
        const routeParts = route.split('/');
        const urlParts = url.split('/');
        let matched = false;
        let params = {};
        let newPathname = url;

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

            if (matched) {
                newPathname = '/' + urlParts.slice(routeParts.length).join('/');
            }
        }

        return matched ? {matched, params, newPathname} : {matched, newPathname};
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
            const pathname = req.url.pathname;
            const {matched, params = {}, newPathname} = this._matchRoute(middleware.path, pathname);

            if (matched) {
                req.params = {...req.params, ...params};
                req.url.pathname = newPathname;

                middleware.handler(req, res, () => {
                    req.url.pathname = pathname;
                    next();
                });
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
        req.originalUrl = req.url;
        // TODO deprecation warning
        req.url = url.parse(req.url, true);
    }

    _fillRes(res) {
        res.status = (code) => {
            res.statusCode = code || res.statusCode;

            return res;
        };

        res.sendHTML = (content) => {
            res.setHeader('Content-Type', mime.lookup('html'));
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
            res.status(301).end();

            return res;
        }

        res.json = (content) => {
            content = JSON.stringify(content);
            res.setHeader('Content-Type', mime.lookup('json'));
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
                res.status(404).end();
            });
        });

        server.listen(port, callback);

        return server;
    }
}

export function MiniExpressStatic(source) {
    return function (req, res, next) {
        const filePath = path.join(source, req.url.pathname);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                next();
                return;
            }

            res.setHeader('Content-Type', mime.lookup(filePath));
            res.status(200);
            res.write(data);
            res.end();
        });
    };
}
