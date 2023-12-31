export enum LoggingLevel {
    ERROR,
    INFO,
    WARN,
    DEBUG,
    TRACE
}

const maxDebugLevel = LoggingLevel.DEBUG;

export function Log(level : LoggingLevel): MethodDecorator {
    console.log("Applying @Log Decorator");

    return function (target, propertyKey:string, descriptor: PropertyDescriptor) {
        /*console.log('target', target)
        console.log('propertyKey', propertyKey)
        console.log('descriptor', descriptor)*/
        const originalFunction = descriptor.value;
        descriptor.value = function (...args: any[]) {
            if(level <= maxDebugLevel) {
                console.log(`>>>>> Log: ${propertyKey}, ${JSON.stringify(args)}`);
            }
            originalFunction.apply(this, args);
        }
    }
}

export function DatabaseId() : PropertyDecorator {
    return function (classPrototype: any, propertyKey: any) {
        Object.defineProperty(classPrototype, propertyKey, {
            get: function () {
                if(!this["_id"]) {
                    this["_id"] = Date.now().toString(36) + Math.random().toString(36).slice(2);
                }
                return this["_id"];
            }
        })
    }
}

export function Seal(): ClassDecorator {
    return function (target) {
        Object.seal(target);
        Object.seal(target.prototype);
    }
}
