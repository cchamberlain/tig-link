'use strict';

var join = require('path').join;
var TIG_ROOT = process.env.TIG_HOME || join(process.env.HOME || process.env.USERPROFILE, ".tig");
exports.TIG_ROOT=TIG_ROOT;
exports.TIGRC_PATH=join(TIG_ROOT, "tigrc");
exports.TIG_JSON_PATH=join(TIG_ROOT, "tig.json");
exports.TIG_LINK_JSON_PATH=join(TIG_ROOT, "tig-link.json");
