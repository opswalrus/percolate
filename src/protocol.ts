import {
  Mutex,
  MutexInterface,
  Semaphore,
  SemaphoreInterface,
  withTimeout,
} from "async-mutex";

import { V, kind } from "./type";

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

  register(
    classConstructor: Function,
    implClass,
    makeDefault: boolean = false
  ) {
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
      throw new Error(
        `Protocol ${this.name} not implemented by ${classConstructor}`
      );
    }
    const impl = protocolImplGroup.get(name);
    if (!impl) {
      throw new Error(
        `Named implementation '${
          name || protocolImplGroup.defaultImpl
        }' of protocol ${this.name} not implemented by ${classConstructor}`
      );
    }
    return impl;
  }
}

declare global {
  var protocolRegistry: Map<string, ImplementationRegistry>;
  var protocolRegistryLock: Mutex;
}
global.protocolRegistryLock = global.protocolRegistryLock || new Mutex();
await global.protocolRegistryLock.runExclusive(async () => {
  global.protocolRegistry = global.protocolRegistry || new Map();
});

// Every implementation of the protocol must conform to the same interface.
// The interface defines which methods a user of the protocol implementation may invoke.
export class Protocol {
  // private static registry: Map<string, ImplementationRegistry> = new Map();

  // static getTypeclass(): ImplementationRegistry {
  //   if (this.registry.has(this.name)) {
  //     return this.registry.get(this.name) as ImplementationRegistry;
  //   } else {
  //     const newTypeclass = new ImplementationRegistry(this.name);
  //     this.registry.set(this.name, newTypeclass);
  //     return newTypeclass;
  //   }
  // }

  static getTypeclass(): ImplementationRegistry {
    if (global.protocolRegistry.has(this.name)) {
      return global.protocolRegistry.get(this.name) as ImplementationRegistry;
    } else {
      const newTypeclass = new ImplementationRegistry(this.name);
      global.protocolRegistry.set(this.name, newTypeclass);
      return newTypeclass;
    }
  }

  static async register(
    classConstructor: Function,
    implClass,
    makeDefault: boolean = false
  ) {
    await global.protocolRegistryLock.runExclusive(async () => {
      let typeclass = this.getTypeclass();
      typeclass.register(classConstructor, implClass, makeDefault);
    });
  }

  static async use(classConstructor, implClass) {
    await global.protocolRegistryLock.runExclusive(async () => {
      let typeclass = this.getTypeclass();
      typeclass.use(classConstructor, implClass);
    });
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
  static for<S extends Protocol>(
    instance,
    implClass: (S & { name: string }) | undefined = undefined
  ) {
    const typeclassImplementationClassConstructor = this.get(
      kind(instance),
      implClass?.name
    ) as unknown as new (self: any) => any;
    return new typeclassImplementationClassConstructor(instance);
  }
}

// // TC is the class that represents the typeclass, e.g. Mappable
// class NamedImplementations<TC extends Protocol> {
//   constructor(
//     // new () => TypeclassClass means the constructor function for the TypeclassClass
//     public impls: Map<string, ImplCtor<any, TC>> = new Map(), // this map stores named references to implementations of typeclass classes, e.g. 'MappableArray' -> MappableArray class that extends Mappable, etc.
//     public defaultImpl: string = ""
//   ) {}

//   register<Impl extends TC>(
//     name: string,
//     implClass: ImplCtor<TC, Impl>,
//     makeDefault: boolean = false
//   ) {
//     if (this.impls.size === 0 || makeDefault) {
//       this.setDefaultImpl(name);
//     }
//     this.impls.set(name, implClass);
//   }

//   get<Impl extends TC>(name?: string): Impl | undefined {
//     return this.impls.get(name || this.defaultImpl) as Impl | undefined;
//   }

//   setDefaultImpl(name: string) {
//     this.defaultImpl = name;
//   }
// }

// type EmptyConstructorFor<T> = {
//   new (): T;
// }

// type ImplCtor<TC extends Protocol, ImplClass extends TC> = EmptyConstructorFor<ImplClass>

// type TCCtor<TC extends Protocol> = EmptyConstructorFor<TC>;

// type TypeThatImplementsATypeclass = Function;

// // Every implementation of the protocol must conform to the same interface.
// // The interface defines which methods a user of the protocol implementation may invoke.
// export abstract class Protocol {
//   // // Protocl has two parts, static and instance.
//   // // the static bits have to do with the registry at the class level, e.g. Mappable is a static registry for Mappable implementations
//   // // the instance bits are the implementation of the Mappable

//   // // this field is shared among all subclasses of Protocol
//   // private static registry: Map<string, Protocol> = new Map(); // this is a map of (typeclass name -> typeclass instance) pairs.

//   // static getTypeclass<TC extends Protocol>(): TC {
//   //   if (this.registry.has(this.name)) {
//   //     // in this context, this will not be `Protocol`, it will be a subclass of `Protocol`, like `Mappable`.
//   //     return this.registry.get(this.name) as unknown as TC;
//   //   } else {
//   //     const newTypeclass = new (this as unknown as TCCtor<TC>)(); // in this context, this will not be `Protocol`, it will be a subclass of `Protocol`, like `Mappable`.
//   //     this.registry.set(this.name, newTypeclass);
//   //     return newTypeclass;
//   //   }
//   // }

//   // static register(
//   //   classConstructor: TypeThatImplementsATypeclass,
//   //   implClass,
//   //   makeDefault: boolean = false
//   // ) {
//   //   let typeclass = this.getTypeclass<TC>();
//   //   typeclass.register(classConstructor, implClass, makeDefault);
//   // }

//   // static use(classConstructor: TypeThatImplementsATypeclass, implClass) {
//   //   let typeclass = this.getTypeclass();
//   //   typeclass.use(classConstructor, implClass);
//   // }

//   // // returns a class object that implements the typeclass - this is an implementation of the typeclass for a given type
//   // static get<TC extends Protocol, ImplClass extends TC>(
//   //   classConstructor: TypeThatImplementsATypeclass,
//   //   name?: string
//   // ): ImplCtor<TC, ImplClass> {
//   //   const typeclass = this.getTypeclass();
//   //   // console.log(`looking up typeclass ${typeclass.name} implementation for ${classConstructor.name} named ${name}`)
//   //   return typeclass.get(classConstructor, name);
//   // }

//   // returns an instance of the class that implements the typeclass
//   // For example, Enumerable.for([1,2,3]) returns a new instance of the EnumerableArray implementation of the
//   // Enumerable typeclass on the Array type, initialized with [1,2,3] in the constructor
//   static for<TC extends Protocol, ImplClass extends TC>(
//     instance,
//     implClassConstructor = undefined
//   ): ImplClass {
//     const implConstructor = ProtocolRegistry.get(this, kind(instance), implClassConstructor?.name);
//     return new implConstructor(instance);
//   }

//   // implementations is a Map of (type => NamedImplementations<typeclass class>) pairs
//   // e.g. 'String' -> NamedImplementations<Mappable>
//   // It stores all the named implementations of the typeclass/protocol associated with the type stored in the key of the map
//   private implementations: Map<
//     TypeThatImplementsATypeclass,
//     NamedImplementations<typeof this>
//   > = new Map();

//   // constructor(public name: string) {}  // we don't need the name anymore because the this.constructor.name is the name of the typeclass, e.g. class Mappable extends Protocol; new Mappable().name is the name "Mappable"

//   register<ImplClass extends typeof this>(
//     classConstructor: TypeThatImplementsATypeclass,
//     implClassConstructor: EmptyConstructorFor<ImplClass>,
//     makeDefault: boolean = false
//   ) {
//     let protocolImplGroup = this.implementations.get(classConstructor);
//     if (!protocolImplGroup) {
//       protocolImplGroup = new NamedImplementations<typeof this>();
//       this.implementations.set(classConstructor, protocolImplGroup);
//     }

//     protocolImplGroup.register(
//       implClassConstructor.name,
//       implClassConstructor,
//       makeDefault
//     );
//   }

//   use<ImplClass extends typeof this>(
//     classConstructor: TypeThatImplementsATypeclass,
//     implClassConstructor: EmptyConstructorFor<ImplClass>,
//   ) {
//     this.register(classConstructor, implClassConstructor, true);
//   }

//   // returns a class object that implements the typeclass/protocol - this is an implementation of the typeclass/protocol for a given type
//   get(
//     classConstructor: TypeThatImplementsATypeclass,
//     name?: string
//   ): typeof this {
//     const protocolImplGroup = this.implementations.get(classConstructor);
//     if (!protocolImplGroup) {
//       throw `Protocol ${this.constructor.name} not implemented by ${classConstructor}`;
//     }
//     const impl = protocolImplGroup.get(name);
//     if (!impl) {
//       throw `Named implementation '${
//         name || protocolImplGroup.defaultImpl
//       }' of protocol ${
//         this.constructor.name
//       } not implemented by ${classConstructor}`;
//     }
//     return impl;
//   }
// }

// // Every implementation of the protocol must conform to the same interface.
// // The interface defines which methods a user of the protocol implementation may invoke.
// export abstract class ProtocolRegistry {
//   private static registry: Map<string, Protocol> = new Map(); // this is a map of (typeclass name -> typeclass instance) pairs.

//   static getTypeclassForImpl<TC extends Protocol>(implClassCtor): TC {
//     const typeclassCtor = V(implClassCtor).superclass();
//     return this.getTypeclass(typeclassCtor.name);
//   }

//   static getTypeclass<TC extends Protocol>(typeclassName): TC {
//     if (this.registry.has(typeclassName)) {
//       return this.registry.get(typeclassName) as unknown as TC;
//     } else {
//       const newTypeclass = new (this as unknown as TCCtor<TC>)(); // in this context, this will not be `Protocol`, it will be a subclass of `Protocol`, like `Mappable`.
//       this.registry.set(typeclassName, newTypeclass);
//       return newTypeclass;
//     }
//   }

//   static register(
//     classConstructor: TypeThatImplementsATypeclass,
//     implClassCtor,
//     makeDefault: boolean = false
//   ) {
//     let typeclass = this.getTypeclassForImpl<typeof implClassCtor>(implClassCtor);
//     typeclass.register(classConstructor, implClassCtor, makeDefault);
//   }

//   static use(classConstructor: TypeThatImplementsATypeclass, implClassCtor) {
//     let typeclass = this.getTypeclassForImpl<typeof implClassCtor>(implClassCtor);
//     typeclass.use(classConstructor, implClassCtor);
//   }

//   // returns a class object that implements the typeclass - this is an implementation of the typeclass for a given type
//   static get<TC extends Protocol, ImplClass extends TC>(
//     typeclassCtor,
//     classConstructor: TypeThatImplementsATypeclass,
//     name?: string
//   ) {
//     // console.log(`looking up typeclass ${typeclass.name} implementation for ${classConstructor.name} named ${name}`)
//     const typeclass = this.registry.get(typeclassCtor.name) as Protocol;
//     return typeclass.get(classConstructor, name);
//   }
// }
