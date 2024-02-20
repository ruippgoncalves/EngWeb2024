import fs from "fs";

export function loadMJinja2Template(path) {
    let template = '';

    try {
        template = fs.readFileSync(path, 'utf-8');
    } catch (e) {
        console.error(`Unable to load the template from file: ${path}`);
    }

    return template;
}

export function renderMJinja2(template, data, load=true) {
    if (load) {
        template = loadMJinja2Template(template);
    }

    // TODO check if nesting is required

    // Render the {% include file %}
    template = template.replace(/\{%\s*include\s+(\S+)\s+%}/g, (match, file) => {
        return loadMJinja2Template(file);
    });

    // Render the {{var}}
    template = template.replace(/\{\{([^}]+)}}/g, (match, variable) => {
        return data[variable.trim()] || '';
    });

    // Conditional rendering {% if cnd %} ... {% endif %}
    template = template.replace(/\{%\s*if\s+([^%]+)\s*%}([\s\S]*?)\{%\s*endif\s*%}/g, (match, condition, content) => {
        return data[condition.trim()] ? content : '';
    });

    // Loop rendering {% for key in array %} ... {% endfor %}
    template = template.replace(/\{%\s*for\s+(\S+)\s+in\s+(\S+)\s*%}([\s\S]*?)\{%\s*endfor\s*%}/g, (match, key, array, content) => {
        const arrayData = data[array.trim()] || [];

        return arrayData.map(item => {
            const loopData = { ...data, [key.trim()]: item };

            return renderMJinja2(content, loopData);
        }).join('');
    });

    return template;
}
