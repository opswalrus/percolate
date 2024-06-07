import { kind } from "./type";

// This represents a set of implementations of the same protocol for the same type.
// The implementations are named for disambuation purposes.
class NamedImplementations<Superclass> {
  constructor(
    public impls: Map<string, Superclass> = new Map(),
    public defaultImpl: string = ""
  ) {}

  register<T extends Superclass>(
    name: string,
    implClass: T,
    makeDefault: boolean = false
  ) {
    if (this.impls.size === 0 || makeDefault) {
      this.setDefaultImpl(name);
    }
    this.impls.set(name, implClass);
  }

  get(name?: string): Superclass | undefined {
    return this.impls.get(name || this.defaultImpl);
  }

  setDefaultImpl(name: string) {
    this.defaultImpl = name;
  }
}

// This class captures all the named implementations of a particular typeclass/protocol associated with a given type.
// There will be one of these ImplementationRegistry objects for every typeclass/protocol.
// This class is responsible for associating types with their corresponding implementations of the typeclass/protocol that this
// instance represents.
// For example:
//   const mappableImplementations = new ImplementationRegistry("Mappable");
// In this example, mappableImplementations would represent all of the named implementations of the Mappable typeclass/protocol
// for any type. The implementations private member would store all of the per-type named implementations of the Mappable typeclass/protocol
// as (type => named implementations) pairs.
class ImplementationRegistry {
  // implementations is a Map of (type constructor function => ProtocolImplGroup) pairs
  // It stores all the named implementations of the typeclass/protocol associated with the type stored in the key of the map
  private implementations: Map<Function, NamedImplementations<typeof this>> =
    new Map();

  constructor(public name: string) {}

  register(classConstructor, implClass, makeDefault: boolean = false) {
    let protocolImplGroup = this.implementations.get(classConstructor);
    if (!protocolImplGroup) {
      protocolImplGroup = new NamedImplementations();
      this.implementations.set(classConstructor, protocolImplGroup);
    }

    protocolImplGroup.register(implClass.name, implClass, makeDefault);
  }

  use(classConstructor, implClass) {
    this.register(classConstructor, implClass, true);
  }

  // returns a class object that implements the typeclass/protocol - this is an implementation of the typeclass/protocol for a given type
  get(classConstructor, name?: string) {
    const protocolImplGroup = this.implementations.get(classConstructor);
    if (!protocolImplGroup) {
      throw `Protocol ${this.name} not implemented by ${classConstructor}`;
    }
    const impl = protocolImplGroup.get(name);
    if (!impl) {
      throw `Named implementation '${
        name || protocolImplGroup.defaultImpl
      }' of protocol ${this.name} not implemented by ${classConstructor}`;
    }
    return impl;
  }
}

// Every implementation of the protocol must conform to the same interface.
// The interface defines which methods a user of the protocol implementation may invoke.
export class Protocol {
  private static registry: Map<string, ImplementationRegistry> = new Map();

  static getTypeclass(): ImplementationRegistry {
    if (this.registry.has(this.name)) {
      return this.registry.get(this.name) as ImplementationRegistry;
    } else {
      const newTypeclass = new ImplementationRegistry(this.name);
      this.registry.set(this.name, newTypeclass);
      return newTypeclass;
    }
  }

  static register(classConstructor, implClass, makeDefault: boolean = false) {
    let typeclass = this.getTypeclass();
    typeclass.register(classConstructor, implClass, makeDefault);
  }

  static use(classConstructor, implClass) {
    let typeclass = this.getTypeclass();
    typeclass.use(classConstructor, implClass);
  }

  // returns a class object that implements the typeclass - this is an implementation of the typeclass for a given type
  static get(classConstructor, name?: string) {
    const typeclass = this.getTypeclass();
    // console.log(`looking up typeclass ${typeclass.name} implementation for ${classConstructor.name} named ${name}`)
    return typeclass.get(classConstructor, name);
  }

  // returns an instance of the class that implements the typeclass
  // For example, Enumerable.for([1,2,3]) returns a new instance of the EnumerableArray implementation of the
  // Enumerable typeclass on the Array type, initialized with [1,2,3] in the constructor
  static for<S extends Protocol>(instance, implClass: S & {name: string} | undefined = undefined) {
    // note: this has been unused; deprecated
    // if (instance instanceof this) {
    //   return instance; // instance is already an instance of a protocol implementation class, e.g. instance is an instance of Enumberable; so just return it
    // }

    const typeclassImplementationClassConstructor = this.get(kind(instance), implClass?.name);
    return new typeclassImplementationClassConstructor(instance);
  }
}
