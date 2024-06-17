const path = require('node:path');

module.exports.resources = path.join(__dirname, './resources');

module.exports.mongoDB = process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/sites';
module.exports.meiliDB = process.env.MEILI_DB || 'http://localhost:7700';
module.exports.meiliMasterKey = process.env.MEILI_MASTER_KEY || 'aSampleMasterKey';
