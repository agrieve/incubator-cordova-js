var cordova = require('cordova'),
    nativeApiProvider = require('cordova/plugin/android/nativeapiprovider'),
    POLL_INTERVAL = 50,
    enabled = false;

function pollOnce() {
    var exec = require('cordova/exec'),
        msg = nativeApiProvider.get().retrieveJsMessages();
    exec.processMessages(msg);
}

function doPoll() {
    if (!enabled) {
        return;
    }
    pollOnce();
    setTimeout(doPoll, POLL_INTERVAL);
}

module.exports = {
    start: function() {
        enabled = true;
        setTimeout(doPoll, 1);
    },
    stop: function() {
        enabled = false;
    },
    pollOnce: pollOnce
};

