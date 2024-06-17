const { meiliDB: meili, meiliMasterKey } = require("../utils")
const axios = require('axios');

module.exports.insert_ucs = data => {
    return axios.post(`${meili}/indexes/sites_ucs/documents`, data, {
        headers: {
            'Authorization': `Bearer ${meiliMasterKey}`
        }
    });
}

module.exports.remove_ucs = id => {
    return axios.delete(`${meili}/indexes/sites_ucs/documents/${id}`, {
        headers: {
            'Authorization': `Bearer ${meiliMasterKey}`
        }
    });
}

module.exports.search_ucs = query => {
    return axios.post(`${meili}/indexes/sites_ucs/search`, {
        q: query,
        attributesToRetrieve: ['id'],
    }, {
        headers: {
            'Authorization': `Bearer ${meiliMasterKey}`
        }
    });
}

module.exports.insert_users = data => {
    return axios.post(`${meili}/indexes/sites_users/documents`, data, {
        headers: {
            'Authorization': `Bearer ${meiliMasterKey}`
        }
    });
}

module.exports.remove_users = id => {
    return axios.delete(`${meili}/indexes/sites_users/documents/${id}`, {
        headers: {
            'Authorization': `Bearer ${meiliMasterKey}`
        }
    });
}

module.exports.search_users = query => {
    return axios.post(`${meili}/indexes/sites_users/search`, {
        q: query,
        attributesToRetrieve: ['id'],
    }, {
        headers: {
            'Authorization': `Bearer ${meiliMasterKey}`
        }
    });
}
