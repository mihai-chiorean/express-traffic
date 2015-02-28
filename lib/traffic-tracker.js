/**
 * Created by mihaichiorean on 19/12/14.
 */

/**
 * Define a token function with the given `name`,
 * and callback `fn(req, res)`.
 *
 * @param {String} name
 * @param {Function} fn
 * @return {Object} exports for chaining
 * @api public
 */

exports.token = function(name, fn) {
    exports[name] = fn;
    return this;
};

/**
 * request url
 */

exports.token('url', function(req){
    return req.originalUrl || req.url;
});

/**
 * route
 */
exports.token('endpoint', function(req){
    return req.route.path || req.originalUrl || req.url;
});

/**
 * request method
 */

exports.token('method', function(req){
    return req.method;
});

/**
 * response time in milliseconds
 */

exports.token('response-time', function(req){
    return String(Date.now() - req._startTime);
});

/**
 * UTC date
 */

exports.token('date', function(){
    return new Date().toUTCString();
});

/**
 * response status code
 */

exports.token('status', function(req, res){
    return res.headerSent ? res.statusCode : null;
});

/**
 * normalized referrer
 */

exports.token('referrer', function(req){
    return req.headers['referer'] || req.headers['referrer'];
});

/**
 * remote address
 */

exports.token('remote-addr', function(req){
    if (req.ip) return req.ip;
    if (req._remoteAddress) return req._remoteAddress;
    var sock = req.socket;
    if (sock.socket) return sock.socket.remoteAddress;
    return sock.remoteAddress;
});

/**
 * HTTP version
 */

exports.token('http-version', function(req){
    return req.httpVersionMajor + '.' + req.httpVersionMinor;
});

/**
 * UA string
 */

exports.token('user-agent', function(req){
    return req.headers['user-agent'];
});

/**
 * request header
 */

exports.token('req', function(req, res, field){
    return req.headers[field.toLowerCase()];
});

/**
 * response header
 */

exports.token('res', function(req, res, field){
    return (res._headers || {})[field.toLowerCase()];
});

/**
 * @description Format the output record
 * @param req
 * @param res
 * @returns {{status: (exports.statusCode|*), len: Number, ep: (opts.path|*|View.path|Layer.path|Route.path|Function), late: number}}
 */
function fmt(req, res) {

    var log = {
        method: req.method,
        status: res.statusCode,
        ep: req.route.path || req.originalUrl || req.url,
        late: (new Date - req._startTime),
        meta: {
            len: parseInt(res.getHeader('Content-Length'), 10)
        }
    };

    for(var k in req.params) {
        log.meta[k] = req.params[k];
    }

    return log;
}
function logger(options) {
    var store = require('./out/' + options.out || 'stdout')(options.config);
    if (!store) {
        throw new Error('Unavailable output option');
    }

    return function logger(req, res, next) {
        var sock = req.socket;
        req._startTime = new Date;
        req._remoteAddress = sock.socket ? sock.socket.remoteAddress : sock.remoteAddress;

        function logRequest() {
            res.removeListener('finish', logRequest);
            res.removeListener('close', logRequest);
            var rec = fmt(req, res);
            if (null == rec) return;
            store.write(rec);
        }

        res.on('finish', logRequest);
        res.on('close', logRequest);
        next();
    };
}

exports.logger = logger;