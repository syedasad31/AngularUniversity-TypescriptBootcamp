"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.LoggingLevel = void 0;
var LoggingLevel;
(function (LoggingLevel) {
    LoggingLevel[LoggingLevel["ERROR"] = 0] = "ERROR";
    LoggingLevel[LoggingLevel["INFO"] = 1] = "INFO";
    LoggingLevel[LoggingLevel["WARN"] = 2] = "WARN";
    LoggingLevel[LoggingLevel["DEBUG"] = 3] = "DEBUG";
    LoggingLevel[LoggingLevel["TRACE"] = 4] = "TRACE";
})(LoggingLevel || (exports.LoggingLevel = LoggingLevel = {}));
var maxDebugLevel = LoggingLevel.DEBUG;
function Log(level) {
    console.log("Applying @Log Decorator");
    return function (target, propertyKey, descriptor) {
        /*console.log('target', target)
        console.log('propertyKey', propertyKey)
        console.log('descriptor', descriptor)*/
        var originalFunction = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (level <= maxDebugLevel) {
                console.log(">>>>> Log: ".concat(propertyKey, ", ").concat(JSON.stringify(args)));
            }
            originalFunction.apply(this, args);
        };
    };
}
exports.Log = Log;
