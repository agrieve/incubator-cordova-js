var cordova = require('cordova'),
    nativeApiProvider = require('cordova/plugin/android/nativeapiprovider'),
    POLL_INTERVAL = 50,
    enabled = false;

function pollOnce() {
    var exec = require('cordova/exec'),
        msg = nativeApiProvider.get().retrieveJsMessages();
    if (msg) {
        exec.processMessages(msg);
        return true;
    }
    return false;
}

function doPoll() {
    if (!enabled) {
        return;
    }
    var nextDelay = POLL_INTERVAL;
    if (pollOnce()) {
        nextDelay = 0;
    }
    setTimeout(doPoll, nextDelay);
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

