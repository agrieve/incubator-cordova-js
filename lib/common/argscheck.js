/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');

var typeofMap = {
    'N': 'number',
    'S': 'string',
    'F': 'function',
    'O': 'object'
};

function extractParamName(args, argIndex) {
  return /.*?\((.*?)\)/.exec(args.callee)[1].split(', ')[argIndex];
}

// * = anything goes
// d = Date
function checkArgs(spec, functionName, args) {
    var errMsg = null;
    for (var i = 0; i < spec.length; ++i) {
        var c = spec.charAt(i);
        var cUpper = c.toUpperCase();
        var arg = args[i];
        // Asterix means allow anything.
        if (c == '*') {
            continue;
        }
        // Lower-case letters mean do not allow null/undefined.
        if (c != cUpper) {
            if (arg === null || arg === undefined) {
                errMsg = 'Expected value, but was null or undefined.';
                break;
            }
        }
        var type = typeof arg;
        if (cUpper == 'D') {
            if (!(arg instanceof Date)) {
                errMsg = 'Expected Date, but was ' + type;
                break;
            }
        } else if (type != typeofMap[cUpper]) {
            errMsg = 'Expected ' + typeofMap[cUpper] + ', but was ' + type;
            break;
        }
    }
    if (errMsg) {
        throw TypeError('Wrong type for parameter "' + extractParamName(args, i) + '" of ' + functionName + ': ' + errMsg);
    }
}

// e.g.: 'wf.nsf*S', win,fail,'Service', 'action', [num,str,func,opt_numOrString, opt_str]);
function checkedExec(spec, specArgs, success, fail, service, action, execArgs) {
    checkArgs(spec, service + '.' + action, specArgs);
    return exec(success, fail, service, action, execArgs);
}

module.exports.checkArgs = checkArgs;
module.exports.checkedExec = checkedExec;

