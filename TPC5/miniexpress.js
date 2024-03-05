import http from 'http';
import url from 'url';
import fs from "fs";
import mime from "mime-types";
import * as path from "path";
import * as querystring from "querystring";

export class MiniRouter {
    _middlewares;

    constructor() {
        this._middlewares = [];
    }

    _chainHandlers(handler, ...handlers) {
        if (handlers.length === 0) return handler;

        // TODO test chain
        handlers.unshift(handler);

        return (req, res, prevNext) => {
            let cur = -1;

            const next = (param) => {
                cur += 1;

                if (param === 'route' || cur === handlers.length) {
                    prevNext();
                    return;
                }

                handlers[cur](req, res, next);
            }
        };
    }

    _addMiddleware(path, method, handler, terminal = true) {
        if (handler instanceof MiniRouter) {
            const router = handler;
            handler = (req, res, next) => router._handleRequest(req, res, next);
        }

        this._middlewares.push({path, method, handler, terminal});
    }

    use(path, handler, ...handlers) {
        if (typeof path === 'function') {
            if (handler) handlers.unshift(handler);
            handler = path;
            path = '*';
        }

        handler = this._chainHandlers(handler, handlers);

        this._addMiddleware(path, '*', handler, false);

        return this;
    }

    get(path, handler, ...handlers) {
        handler = this._chainHandlers(handlers);

        this._addMiddleware(path, 'GET', handler);

        return this;
    }

    put(path, handler, ...handlers) {
        handler = this._chainHandlers(handlers);

        this._addMiddleware(path, 'PUT', handler);

        return this;
    }

    post(path, handler, ...handlers) {
        handler = this._chainHandlers(handlers);

        this._addMiddleware(path, 'POST', handler);

        return this;
    }

    delete(path, handler, ...handlers) {
        handler = this._chainHandlers(handlers);
        this._addMiddleware(path, 'DELETE', handler);

        return this;
    }

    _cleanTerminals(arr) {
        while (arr.length !== 0 && arr[arr.length - 1] === '')
            arr.pop()

        return arr;
    }

    _matchRoute(route, url, terminal) {
        const routeParts = this._cleanTerminals(route.split('/'));
        const urlParts = this._cleanTerminals(url.split('/'));
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

            if (terminal) {
                matched &= urlParts.length === routeParts.length;
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

            if (middleware.method !== '*' && middleware.method !== req.method) {
                next();
                return;
            }

            const pathname = req.url;
            const {
                matched,
                params = {},
                newPathname
            } = this._matchRoute(middleware.path, pathname, middleware.terminal);

            if (matched) {
                req.params = {...req.params, ...params};
                req.url = newPathname;

                middleware.handler(req, res, () => {
                    req.url = pathname;
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
        this._engines = {};
    }

    async _fillReq(req) {
        req.originalUrl = req.url;
        // TODO deprecation warning
        const parsedUrl = url.parse(req.url, true);
        req.url = parsedUrl.pathname;
        req.query = parsedUrl.query;

        // Body
        req.body = await new Promise((resolve, reject) => {
            let data = '';

            req.on('readable', () => {
                let chunk;
                while ((chunk = req.read()) !== null) {
                    data += chunk;
                }
            });

            req.on('end', () => {
                resolve(data);
            });

            req.on('error', (err) => {
                reject(err);
            });
        });
    }

    _fillRes(res) {
        res.status = (code) => {
            res.statusCode = code || res.statusCode;

            return res;
        };

        res.render = (content, data = {}, onRender = (err, html) => {
            if (err) {
                res.status(500);
                res.end();
            } else {
                res.write(html);
                res.end();
            }
        }) => {
            res.setHeader('Content-Type', mime.lookup('html'));

            let template = '';

            try {
                template = fs.readFileSync(content, 'utf-8');
            } catch (e) {
                console.error(`Unable to load the template from file: ${path}`);
            }

            const extension = content.find(/\..*?$/);

            try {
                if (extension in this._engines) {
                    template = this._engines[extension](template, data)
                }

                onRender(null, template);
            } catch (e) {
                onRender(e, null);
            }

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
        const server = http.createServer(async (req, res) => {
            await this._fillReq(req);
            this._fillRes(res);

            this._handleRequest(req, res, () => {
                res.status(404).end();
            });
        });

        server.listen(port, callback);

        return server;
    }

    engine(extension, renderer) {
        // TODO test engine and jinja2
        // TODO maybe change for EJS?
        this._engines[extension] = renderer;
    }
}

export function MiniExpressStatic(source) {
    return function (req, res, next) {
        const filePath = path.join(source, req.url);

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

export function MiniUrlencoded(req, res, next) {
    // TODO test urlencoded and json
    // TODO should I use body-parser?
    // TODO mini express-validator
    // TODO I won't implement the multipart, so how am I going to handle it?
    //  Body-parser has some recommended libs, maybe I can use one
    if (req.headers['content-type'] === 'application/json') {
        req.body = JSON.parse(req.body);
    }
}

export function MiniJson(req, res, next) {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        req.body = JSON.parse(req.body);
    }
}
