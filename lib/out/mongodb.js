/**
 * Created by mihaichiorean on 27/02/15.
 */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    ep: {type: String, required: true},
    method: {type: String, required: true},
    status: {type: Number, required: true},
    late: {type: Number, required: true},
    meta: {}
});

module.exports = function(config) {
    var db =  mongoose.createConnection(config.url + '/' + (config.db || 'loadmeter'));
    var model = db.model('loadmeter', schema);

    return {
        write: function(data, cb) {
            model.create(data, cb || function(err, doc) {

            });
        }
    }
};