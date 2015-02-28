/**
 * Created by mihaichiorean on 26/02/15.
 */
var assert = require('assert');
var childproc = require('child_process');
var request = require('request');


describe('lalala', function() {
    this.timeout(60000);
    var child = null;
    before(function(done) {
        child = childproc.spawn('node', ['example/app.js']);
        child.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        child.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        child.on('close', function (code) {
            console.log('child process exited with code ' + code);
        });


        var timer = setInterval(function() {
            request({url: 'http://localhost:3000', timeout: 1000}, function(err, r, b) {
                if(r.statusCode == 200) {
                    clearInterval(timer);
                    done();
                }
            });
        }, 5000);
    });

    it('/', function(done) {
        request('http://localhost:3000', function(err, r, b) {
            assert.ok(!err, 'error found');
            assert.ok(r.statusCode == 200, 'status code failed');
            done();

        });
    });

    it('/delay/:time', function(done) {
        var late = 1000;
        request('http://localhost:3000/delay/'+late , function(err, r, b) {
            assert.ok(!err, 'error found');
            assert.ok(r.statusCode == 200, 'status code failed');
            done();

        });
    });

    after(function() {
        child.kill('SIGHUP');
    });
});

