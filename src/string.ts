
export function isEmpty(str: string): boolean {
  return str.length == 0;
}

export function isNumeric(str: string): boolean {
  if (typeof str != "string") return false;
  return !isNaN(parseFloat(str)) && isFinite(str);
}

/**
 * @param regexp must be a global regexp, e.g. /foo/g, and not just /foo/
 * @returns array of matches, or null if no matches present
 * Example:
 * const regexp = /t(e)(st(\d?))/g;
 * const str = 'test1test2';
 *
 * const array = matches(regexp)(str)
 *
 * > matches(regexp)(str)
 * [
 *   [
 *     'test1',
 *     'e',
 *     'st1',
 *     '1',
 *     index: 0,
 *     input: 'test1test2',
 *     groups: undefined
 *   ],
 *   [
 *     'test2',
 *     'e',
 *     'st2',
 *     '2',
 *     index: 5,
 *     input: 'test1test2',
 *     groups: undefined
 *   ]
 * ]
 *
 * > matches(/foo/g)("blah")
 * null
 */
export function matches(regexp: RegExp) {
  const globalRegex = regexp.global ? regexp : new RegExp(regexp.source, regexp.flags + "g");
  return function (str: string) {
    const matches = [...str.matchAll(globalRegex)];
    if (matches.length == 0) return null;
    return matches;
  };
}

export class StringProxy {
  constructor(public str: string) {}

  isEmpty() {
    return isEmpty(this.str);
  }

  isNumeric() {
    return isNumeric(this.str);
  }

  matches(regexp: RegExp) {
    return matches(regexp)(this.str);
  }

  trimPrefix(prefix: string): string {
    if (this.str.startsWith(prefix)) {
      return this.str.slice(prefix.length)
    }
    return this.str;
  }

  trimSuffix(suffix: string): string {
    if (this.str.endsWith(suffix)) {
      return this.str.slice(0, this.str.length - suffix.length);
    }
    return this.str;
  }
}

export const Str = function (str: string): StringProxy {
  return new StringProxy(str);
};

Object.assign(Str, {
  isEmpty,
  isNumeric,
  matches,
});
