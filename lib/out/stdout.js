/**
 * Created by mihaichiorean on 26/02/15.
 */

/**
 * Writing to STDOUT
 * @param data
 */
module.exports = function(data) {
    return {
        write: function(data) {
            process.stdout.write(JSON.stringify(data) + '\n');
        }
    }
};