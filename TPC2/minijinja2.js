import fs from "fs";

function loadMJinja2Template(path) {
    let template = '';

    try {
        template = fs.readFileSync(path, 'utf-8');
    } catch (e) {
        console.error(`Unable to load the template from file: ${path}`);
    }

    return template;
}

const subRegex = /^\{\{([^}]+)}}/;

function parseSub(m, template, parsed) {
    const v = m[1];

    parsed.push((data) => {
        const properties = Object.keys(data).join(',');
        return eval(`const {${properties}} = data;
        ${v};`);
    });

    return template.slice(m[0].length);
}

const includeRegex = /^\{%\s*include\s+"([^"]+)"\s*%}/

function parseInclude(m, template, parsed) {
    const path = m[1];

    parsed.push((data) => {
        return renderMJinja2(path, data);
    });

    return template.slice(m[0].length - 1);
}

const ifRegex = /^\{%\s*if\s+([^%]+)%}/;

function parseIf(m, template, parsed) {
    const expr = m[1];
    template = template.slice(m[0].length);

    let nParsed = [];
    const reg = /^\{%\s*endif\s*%}/;

    while (template.length !== 0 && !template.match(reg)) {
        template = parseAny(template, nParsed);
    }

    const m2 = template.match(reg);

    if (!m2) {
        console.error('An {% if %} tag does not have a matching {% endif %} tag');
    } else {
        parsed.push((data) => {
            const properties = Object.keys(data).join(',');
            const e = eval(`const {${properties}} = data;
            ${expr};`);
            let res = '';

            if (e) res = nParsed.map(i => i(data)).join('');

            return res;
        });

        template = template.slice(m2[0].length);
    }

    return template
}

const forRegex = /^\{%\s*for\s+([^%]+?)\s*in\s*([^%]+)\s*%}/;

function parseFor(m, template, parsed) {
    const [item, iterable] = m.slice(1, 3);
    template = template.slice(m[0].length);

    let nParsed = [];
    const endRegex = /^\{%\s*endfor\s*%}/;

    while (template.length !== 0 && !template.match(endRegex)) {
        template = parseAny(template, nParsed);
    }

    const m2 = template.match(endRegex);

    if (!m2) {
        console.error('A {% for %} tag does not have a matching {% endfor %} tag');
    } else {
        parsed.push((data) => {
            const properties = Object.keys(data).join(',');
            const iterableData = eval(`const {${properties}} = data;
            ${iterable};`);
            let res = '';

            if (Array.isArray(iterableData)) {
                for (const i of iterableData) {
                    const localData = {...data, [item]: i};
                    res += nParsed.map(parsedItem => parsedItem(localData)).join('');
                }
            } else {
                console.error(`${iterable} is not an iterable`);
            }

            return res;
        });

        template = template.slice(m2[0].length);
    }

    return template;
}

function parseTag(template, parsed) {
    let m = template.match(subRegex);

    if (m) {
        return parseSub(m, template, parsed);
    }

    m = template.match(includeRegex);

    if (m) {
        return parseInclude(m, template, parsed);
    }

    m = template.match(ifRegex);

    if (m) {
        return parseIf(m, template, parsed);
    }

    m = template.match(forRegex);

    if (m) {
        return parseFor(m, template, parsed);
    }

    console.error('Unknown tag');

    return template.slice(2);
}

function isTag(template) {
    return template.startsWith('{{') || template.startsWith('{%');
}

function parseText(template, parsed) {
    let cur = 0;

    while (cur < template.length && !isTag(template.slice(cur))) cur++;

    const text = template.slice(0, cur);

    parsed.push((_) => {
        return text;
    });

    return template.slice(cur);
}

function parseAny(template, parsed) {
    let res;

    if (isTag(template)) {
        res = parseTag(template, parsed);
    } else {
        res = parseText(template, parsed)
    }

    return res;
}

function parseTemplate(template) {
    let parsed = [];

    while (template.length !== 0) {
        template = parseAny(template, parsed);
    }

    return parsed;
}

export function renderMJinja2(template, data, load = true) {
    if (load) {
        template = loadMJinja2Template(template);
    }

    template = parseTemplate(template);

    return template.map(t => t(data)).join('');
}
