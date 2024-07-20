export const GeneratorFunction = function* () {}.constructor;

// export function buildPipeThroughFunction() {
//   function func(wrappedValue) {
//     // wrappedValue is the value passed to the object wrapper function. e.g. A([1,2,3]) the wrappedValue is [1,2,3] and A is the wrapper function called func in this context
//     return new Proxy(wrappedValue, {
//       get(target, property, receiver) {
//         // function objects, like O, don't have any properties, so the only properties present will be the function objects we assign to the 'O' function object
//         const fn = Reflect.get(func, property, receiver);
//         if (fn === undefined) {
//           return Reflect.get(target, property, receiver); //  target === wrappedValue
//         }
//         const fnParams = parameters(fn);
//         const noParameters = fnParams.length === 0;
//         return function (...args: any) {
//           if (noParameters || args.length === 0) {
//             // then we are going to treat fn as a function expecting the obj to be supplied as an argument
//             return fn.call(receiver, target);
//           } else {
//             // otherwise, we are going to treat fn as a function expecting the args to be supplied as the argument, which will return a second function that expects the obj to be supplied as its argument
//             return fn.apply(receiver, args)(target);
//           }
//         };
//       },
//     });
//   }
//   return func;
// }

export type FunctionBag = { [key: string]: Function };
export class MethodBag {
  public methods: Map<string, [Function, number]>;
  public staticMethods: Map<string, Function>;
  constructor() {
    this.methods = new Map();
    this.staticMethods = new Map();
  }
  registerUncurriedFns(fnBag: FunctionBag) {
    Object.entries(fnBag).forEach(([functionName, functionObj]) => {
      this.methods.set(functionName, [functionObj, 1]);
    });
  }
  registerCurriedFns(fnBag: FunctionBag) {
    Object.entries(fnBag).forEach(([functionName, functionObj]) => {
      this.methods.set(functionName, [functionObj, 2]);
    });
  }
  registerStatic(fnBag: FunctionBag) {
    Object.entries(fnBag).forEach(([functionName, functionObj]) => {
      this.staticMethods.set(functionName, functionObj);
    });
  }
  lookup(fnName: string): [Function, number] | undefined {
    const pair = this.methods.get(fnName);
    if (!pair) {
      return undefined;
    }
    return pair;
  }
  lookupStatic(fnName: string): Function | undefined {
    const fn = this.staticMethods.get(fnName);
    if (!fn) {
      return undefined;
    }
    return fn;
  }
}

export function buildWrapperProxy() {
  const methods = new MethodBag();
  function func(wrappedValue) {
    // wrappedValue is the value passed to the object wrapper function. e.g. A([1,2,3]) the wrappedValue is [1,2,3] and A is the wrapper function called func in this context
    return new Proxy(wrappedValue, {
      get(target, property, receiver) {
        // function objects, like O, don't have any properties, so the only properties present will be the function objects we assign to the 'O' function object
        const fnArityPair = methods.lookup(property.toString());
        if (fnArityPair === undefined) {
          return Reflect.get(target, property, receiver); //  target === wrappedValue
        }
        const [fn, arity] = fnArityPair;
        return function (...args: any) {
          if (arity === 1) {
            // then we are going to treat fn as a function expecting the obj to be supplied as an argument
            return fn.call(receiver, target);
          } else {
            // otherwise, we are going to treat fn as a function expecting the args to be supplied as the argument, which will return a second function that expects the obj to be supplied as its argument
            return fn.apply(receiver, args)(target);
          }
        };
      },
    });
  }
  Object.assign(func, {
    registerUncurriedFns(fnBag: FunctionBag) {
      return methods.registerUncurriedFns(fnBag);
    },
    registerCurriedFns(fnBag: FunctionBag) {
      return methods.registerCurriedFns(fnBag);
    },
    registerStatic(fnBag: FunctionBag) {
      return methods.registerStatic(fnBag);
    },
  });
  return new Proxy(func, {
    get(target, property, receiver) {
      const fn = methods.lookupStatic(property.toString());
      if (fn === undefined) {
        return Reflect.get(target, property, receiver); //  target === func
      }
      return fn;
    },
  });
}

// taken from https://javascript.info/currying-partials
export function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

export function identity(val) {
  return val;
}

// taken from https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
export function parameters(func) {
  const ARROW = true;
  const FUNC_ARGS = ARROW ? /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m : /^(function)\s*[^\(]*\(\s*([^\)]*)\)/m;
  const FUNC_ARG_SPLIT = /,/;
  const FUNC_ARG = /^\s*(_?)(.+?)\1\s*$/;
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

  return ((func || "").toString().replace(STRIP_COMMENTS, "").match(FUNC_ARGS) || ["", "", ""])[2]
    .split(FUNC_ARG_SPLIT)
    .map(function (arg) {
      return arg.replace(FUNC_ARG, function (all, underscore, name) {
        return name.split("=")[0].trim();
      });
    })
    .filter(String);
}

export function thread(...args: any[]) {
  return function (firstArg: any | undefined = undefined) {
    let pipeline = args;
    if (firstArg !== undefined) {
      pipeline.unshift(firstArg);
    }
    return pipeline.reduce((arg, fn) => fn(arg));
  };
}

export function threadR(...fns: any[]) {
  return function (firstArg: any = undefined) {
    let pipeline = fns;
    if (firstArg !== undefined) {
      pipeline.push(firstArg);
    }
    return pipeline.reduceRight((arg, fn) => fn(arg));
  };
}

// export const F = {
//   curry,
//   identity,
//   thread,
// };

export const F = buildWrapperProxy();
F.registerUncurriedFns({ parameters });
// F.registerCurriedFns({  });
F.registerStatic({
  curry,
  identity,
  parameters,
  thread,
  threadR,
});
