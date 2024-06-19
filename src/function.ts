export const GeneratorFunction = function* () {}.constructor;

export function buildPipeThroughFunction() {
  function func(wrappedValue) {
    return new Proxy(wrappedValue, {
      get(target, property, receiver) {
        // function objects, like O, don't have any properties, so the only properties present will be the function objects we assign to the 'O' function object
        const fn = Reflect.get(func, property, receiver);
        if (fn === undefined) {
          return Reflect.get(target, property, receiver);
        }
        return function (...args: any) {
          if (args.length === 0) {
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
  return func;
}

export function compose(...args: any[]) {
  return function (firstArg: any = undefined) {
    let pipeline = args;
    if (firstArg !== undefined) {
      pipeline.push(firstArg);
    }
    return pipeline.reduceRight((arg, fn) => fn(arg));
  };
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

export function thread(...args: any[]) {
  return function (firstArg: any | undefined = undefined) {
    let pipeline = args;
    if (firstArg !== undefined) {
      pipeline.unshift(firstArg);
    }
    return pipeline.reduce((arg, fn) => fn(arg));
  };
}

// export const F = {
//   compose,
//   curry,
//   identity,
//   thread,
// };

export const F = buildPipeThroughFunction();

Object.assign(F, {
  compose,
  curry,
  identity,
  thread,
});
