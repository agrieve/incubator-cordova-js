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

var typeMap = {
    'A': 'Array',
    'D': 'Date',
    'N': 'Number',
    'S': 'String',
    'F': 'Function',
    'O': 'Object'
};

function extractParamName(callee, argIndex) {
  return (/.*?\((.*?)\)/).exec(callee)[1].split(', ')[argIndex];
}

// * = anything goes
function checkArgs(spec, functionName, args, opt_callee) {
    var errMsg = null;
    var type;
    for (var i = 0; i < spec.length; ++i) {
        var c = spec.charAt(i),
            cUpper = c.toUpperCase(),
            arg = args[i];
        // Asterix means allow anything.
        if (c == '*') {
            continue;
        }
        type = Object.prototype.toString.call(arg).slice(8, -1);
        if (arg === null || arg === undefined) {
            if (c == cUpper) {
                continue;
            }
            errMsg = 'Expected value';
            break;
        }
        if (type != typeMap[cUpper]) {
            errMsg = 'Expected ' + typeMap[cUpper];
            break;
        }
    }
    if (errMsg) {
        errMsg += ', but got ' + type + '.';
        throw TypeError('Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg);
    }
}

// e.g.: 'wf.nsf*S', win,fail,'Service', 'action', [num,str,func,opt_numOrString, opt_str]);
function checkedExec(spec, specArgs, success, fail, service, action, execArgs) {
    checkArgs(spec, service + '.' + action, specArgs);
    return exec(success, fail, service, action, execArgs);
}

function decorate(spec, functionName, func) {
    return function() {
        checkArgs(spec, functionName, arguments, func);
        return func.apply(this, arguments);
    };
}

module.exports.checkArgs = checkArgs;
module.exports.checkedExec = checkedExec;
module.exports.decorate = decorate;

