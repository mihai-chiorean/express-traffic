/**
 * Created by mihaichiorean on 27/02/15.
 */
var mongoose = require('mongoose');
var debug = require('debug');

function initSchema(metaSchema) {
    debug('loadmeter:mongodb:initSchema')('initializing schema');
    if(metaSchema && 'object' !== typeof metaSchema) {
        throw new Error('metaSchema must be an object');
    }

    var schema = new mongoose.Schema({
        ep: {type: String, required: true},
        method: {type: String, required: true},
        status: {type: Number, required: true},
        late: {type: Number, required: true},
        meta: metaSchema || {}
    });

    return schema;
}

exports = module.exports = function(config) {
    var schema = initSchema(config.meta);

    var db =  mongoose.createConnection(config.url + '/' + (config.db || 'loadmeter'));
    var model = db.model('loadmeter', schema);

    /**
     * API
     */
    return {
        write: function(data, cb) {
            model.create(data, cb || function(err, doc) {

            });
        }
    }
};