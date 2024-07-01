import { A } from "./array";
import { compact } from "./compactable";
import { Enumerable, each } from "./enumerable";
import { F } from "./function";
import { M } from "./map";
import { asyncMap, map } from "./mappable";
import { O } from "./object";
import { select } from "./selectable";
import { S } from "./set";
import { Str } from "./string";
import { V } from "./type";

class Pipe {
  constructor(public value: any) {}

  // e.g. convertMethodsToPipeline(A([1,2,3]))
  // returns a function that proxies method invocations through to the A([1,2,3]) object but assigns their return value
  // to this.value in the pipeline, and then returns the pipe object, enabling stuff like this:
  // P([1,2,3]).A.compact().A.first().value
  private convertMethodsToPipeline(wrappedValue, nameOfMethodBag: string) {
    const self = this;

    return new Proxy(wrappedValue, {
      get(target, property, receiver) {
        // function objects, like those returned from `A([1,2,3])`, have function properties attached to them that when invoked
        // will operate on the value supplied to the A function (e.g. [1,2,3]),
        // so we want to return a function that invokes the requested function property specified by the get handler
        // and assigns the result of the evaluation of that function property to the `this.value` member of the Pipe object
        const fn = Reflect.get(target, property, receiver);
        if (fn === undefined) {
          throw Error(`${nameOfMethodBag} does not have a method named ${String(property)}`);
        }
        // we return a function that wraps the function property that is being accessed, such that when invoked, the return value is
        // assigned to self.value and then the pipe object is returned
        return function (...args: any) {
          self.value = fn.apply(receiver, args);
          return self;
        };
      },
    });
  }

  get A() {
    return A(this.value);
  }

  get a() {
    return this.convertMethodsToPipeline(A(this.value), "A");
  }

  compact(...args) {
    this.value = compact(...args)(this.value);
    return this;
  }

  each(visitorFn) {
    this.value = each(visitorFn)(this.value);
    return this;
  }

  get F() {
    return F(this.value);
  }

  get f() {
    return this.convertMethodsToPipeline(F(this.value), "F");
  }

  // enumerable() {
  //   this.value = Enumerable.for(this.value);
  //   return this;
  // }

  // enumerator() {
  //   this.value = Enumerator.for(this.value);
  //   return this;
  // }

  log() {
    console.log(V.inspect(this.value));
    return this;
  }

  get M() {
    return M(this.value);
  }

  get m() {
    return this.convertMethodsToPipeline(M(this.value), "M");
  }

  map(mapFn, implClass?) {
    this.value = map(mapFn)(this.value, implClass);
    return this;
  }

  asyncMap(mapFn, implClass?) {
    this.value = asyncMap(mapFn)(this.value, implClass);
    return this;
  }

  get O() {
    return O(this.value);
  }

  get o() {
    return this.convertMethodsToPipeline(O(this.value), "O");
  }

  pipe(fn) {
    this.value = fn(this.value);
    return this;
  }

  get S() {
    return S(this.value);
  }

  get s() {
    return this.convertMethodsToPipeline(S(this.value), "S");
  }

  get Str() {
    return Str(this.value);
  }

  get str() {
    return this.convertMethodsToPipeline(Str(this.value), "Str");
  }

  select(predFn, implClass?) {
    this.value = select(predFn)(this.value, implClass);
    return this;
  }

  toArray() {
    this.value = Enumerable.for(this.value).toArray();
    return this;
  }

  waitAll() {
    this.value = Promise.allSettled(this.value).then((results) => {
      return results.map((result) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          return new Error(result.reason);
        }
      });
    });
    // .finally(() => {
    //   console.log("Experiment completed");
    // });
    return this;
  }
}

export const VP = function (initial: any) {
  return new Pipe(initial);
};

// P([1,2,3,4]).map(v => v * 2).compact().value
// P([1,2,3,4]).map(v => v * 2).A.compact()
// P([1,2,3,4]).map(v => v * 2).a.compact().value
// P([1,2,3,4]).map(v => v * 2).pipe(A.compact).value
