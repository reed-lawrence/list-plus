import { cloneDeep, isEqual, sortedIndex, union } from 'lodash';
import { Subject } from 'rxjs';

import { IEventType } from './event-type';

export enum ListEventType {
  Add = 'add',
  Clear = 'clear',
}

export class List<T> extends Array<T>{
  private decouple: boolean;

  constructor(init?: Array<T>, decouple = false) {
    super(...(init ? (decouple ? cloneDeep(init) : init) : []));
    Object.setPrototypeOf(this, Object.create(List.prototype));
    this.decouple = decouple;
  }

  public events = new Subject<ListEventType>();

  push(...objs: T[]) {
    this.events.next(ListEventType.Add);
    return this.length;
  }


  /**
   * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
   * @param predicate Callback function of the conditions to check against the elements.
   * @returns Returns true or false
   */
  all(predicate: (o: T) => boolean) {
    let output = true;
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i]) === false) {
        output = false;
      }
    }
    return output;
  }

  /**
   * ASYNC - Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
   * @param predicate Callback function of the conditions to check against the elements.
   * @returns Returns true or false
   */
  allAsync(predicate: (o: T) => boolean) {
    return new Promise<boolean>(resolve => {
      const result = this.all(predicate);
      resolve(result);
    });
  }

  /**
   * Return true or false if specified condition exists in one or more iterations of the List<T>
   * @param predicate Callback function to evaluate each iteration of the List<T>
   * @returns Returns boolean of expression
   */
  any(predicate: (o: T) => boolean) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i]) === true) {
        return true;
      }
    }
    return false;
  }

  /**
   * Return true or false if specified condition exists in one or more iterations of the List<T>
   * @param predicate Callback function to evaluate each iteration of the List<T>
   * @returns Returns boolean of expression
   */
  anyAsync(predicate: (o: T) => boolean) {
    return new Promise<boolean>(resolve => {
      const result = this.any(predicate);
      return resolve(result);
    });
  }

  /**
   * appends a value to the end of the List<T>.
   * Proxy for push and add
   * @param obj The object<T> to append to the List<T>
   * @returns Returns the modified List<T>
   */
  append(obj: T) {
    this.events.next(ListEventType.Add);
    this[this.length] = obj;
    return this;
  }

  // TODO: asList

  /**
   * Function that finds the average of a specified List collection
   * @param key The key to specifiy the numeric value to average
   */
  average(key?: (o: T) => number) {
    let sum = 0;
    for (const obj of this) {
      if (key) {
        sum += key(obj);
      } else {
        sum += obj as any;
      }
    }
    return sum / this.length;
  }

  /**
   * ASYNC
   * Function that finds the average of a specified List collection
   * @param key The key to specifiy the numeric value to average
   */
  averageAsync(key?: (o: T) => number) {
    return new Promise(resolve => resolve(this.average(key)));
  }

  /**
   * Override method to force TypeScript compiler to treat values as specified by the type declaration. 
   * **For type conversions use List<T>.convert() or List<T>.map()** 
   */
  cast<CastTo>() {
    return new List<CastTo>(this.map(i => <any>i));
  }

  /**
   * ASYNC - Override method to force TypeScript compiler to treat values as specified by the type declaration. 
   * **For type conversions use List<T>.convert() or List<T>.map()** 
   */
  castAsync<CastTo>() {
    return new Promise<List<CastTo>>(resolve => resolve(this.cast<CastTo>()));
  }

  /**
   * Performs a deep recursive comparison if an object exists in the List<T>
   * @returns Returns boolean of expression
   */
  contains<U>(obj: T): boolean {
    for (const o of this) {
      if (isEqual(o, obj)) {
        return true;
      }
    }
    return false;
  }

  /**
   * ASYNC - Performs a deep recursive comparison if an object exists in the List<T>
   * @returns Returns boolean of expression
   */
  containsAsync(obj: T) {
    return new Promise<boolean>(resolve => resolve(this.contains(obj)))
  }

  /**
   * Get the count of elements in List<T> as defined by a predicate callback function.
   * @param predicate Callback function of the conditions to check against the elements
   * @returns Returns count
   */
  count(predicate?: (o: T) => boolean): number {
    if (!predicate) {
      return this.length;
    } else {
      let count = 0;
      for (let i = 0; i < this.length; i++) {
        if (predicate(this[i])) {
          count++;
        }
      }
      return count;
    }
  }

  /**
   * ASYNC - Get the count of elements in List<T> as defined by a predicate callback function.
   * @param predicate Callback function of the conditions to check against the elements
   */
  countAsync(predicate?: (o: T) => boolean) {
    return new Promise<number>(resolve => resolve(this.count(predicate)));
  }

  // TODO: defaultIfEmpty()

  /**
   * Returns distinct elements from a sequence.
   * @param key Optional specification of key to compare uniqueness
   * @returns An List<T> that contains distinct elements from the source sequence.
   */
  distinct<U>(comparer?: (o: T) => U) {
    const output = new List<T>();
    for (const obj of this) {
      const index = comparer ? output.findIndex(o => comparer(o) === comparer(obj)) : output.findIndex(o => isEqual(o, obj));
      if (index === -1) {
        output.push(obj);
      }
    }
    return output;
  }

  /**
   * ASYNC - Returns distinct elements from a sequence.
   * @param key Optional specification of key to compare uniqueness
   * @returns An List<T> that contains distinct elements from the source sequence.
   */
  distinctAsync<U>(comparer?: (o: T) => U): Promise<List<T>> {
    return new Promise<List<T>>(resolve => resolve(this.distinct(comparer)));
  }

  /**
   * Returns the element at a specified index in a sequence.
   * @param index The zero-based index of the element to retrieve.
   * @returns The decoupled element at the specified position in the source sequence.
   */
  elementAt(index: number, decouple = this.decouple): T | undefined {
    if (index && this.length > 0) {
      return decouple ? cloneDeep(this[index]) : this[index];
    }
    return undefined;
  }

  /**
   * ASYNC - Returns the element at a specified index in a sequence.
   * @param index The zero-based index of the element to retrieve.
   * @returns The decoupled element at the specified position in the source sequence.
   */
  elementAtAsync(index: number, decouple = this.decouple): Promise<T> {
    return new Promise<T>(resolve => resolve(this.elementAt(index, decouple)));
  }

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range. You may optionally specify
   * the default object that is returned. Returns null if not specified.
   * @param index The zero-based index of the element to retrieve.
   * @param default Optional object to return if index is out of range or does not exist.
   * @returns The decoupled element at the specified position in the source sequence or the default specified.
   */
  elementAtOrDefault(index: number, defaultObj: T, decouple = this.decouple): T {
    const elem = this.elementAt(index);
    if (!elem) {
      return decouple ? cloneDeep(defaultObj) : defaultObj;
    } else {
      return elem;
    }
  }

  /**
   * Returns an empty List<T> that has the specified type argument.
   * @typedef TResult type to assign to the type parameter of the returned generic IList<T>.
   * @returns An empty List<T> whose type argument is TResult.
   */
  static empty<TResult>(): List<TResult> {
    return new List<TResult>();
  }

  // TODO: except()


  /**
   * Returns the first element that matches the specified criteria. Returns undefined if not found.
   * Note: Decouples from List<T>.
   * @param predicate The expression to evaluate
   * @returns First matching element or undefined if not found.
   */
  first(predicate?: (o: T) => boolean, decouple = this.decouple): T | undefined {
    if (!predicate) {
      if (this.length > 0) {
        return decouple === true ? cloneDeep(this[0]) : this[0];
      } else {
        return undefined;
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        if (predicate(this[i]) === true) {
          return decouple === true ? cloneDeep(this[i]) : this[i];
        }
      }
      return undefined;
    }
  }

  /**
   * Returns the first element that matches the specified criteria. Returns undefined if not found.
   * Note: Decouples from List<T>.
   * @param predicate The expression to evaluate
   * @returns First matching element or undefined if not found.
   */
  firstAsync(predicate?: (o: T) => boolean, decouple = this.decouple): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => resolve(this.first(predicate, decouple)));
  }

  /**
   * Returns the first element that matches the specified criteria. Returns the optionally specified default object or null if not specified.
   * Note: Decouples from List<T>.
   * @param predicate The expression to evaluate
   * @returns First matching element or optionally specified default (null if not specified).
   */
  firstOrDefault(defaultObj: T, predicate?: (o: T) => boolean, decouple = this.decouple): T {
    const elem = this.first(predicate, decouple);
    if (elem) {
      return elem;
    } else {
      return decouple ? cloneDeep(defaultObj) : defaultObj;
    }
  }

  /**
   * ASYNC - Returns the first element that matches the specified criteria. Returns the optionally specified default object or null if not specified.
   * Note: Decouples from List<T>.
   * @param predicate The expression to evaluate
   * @returns First matching element or optionally specified default (null if not specified).
   */
  firstOrDefaultAsync(defaultObj: T, predicate?: (o: T) => boolean, decouple = this.decouple): Promise<T> {
    return new Promise<T>(resolve => resolve(this.firstOrDefault(defaultObj, predicate, decouple)));
  }

  /**
   * Group the List<T> by a specified Key. Note: Decouples groups from original List<T>
   * @param key Callback function to specify Key to group by
   * @returns Returns new List of GroupList<T> on Key of U
   */
  groupBy<U>(key: (o: T) => U, decouple = this.decouple): List<{ key: U; collection: List<T> }> {
    const output = new List<{ key: U; collection: List<T> }>();

    for (const obj of this) {
      const index = output.findIndex(o => o.key === key(obj));
      if (index === -1) {
        output.append({ key: decouple ? cloneDeep(key(obj)) : key(obj), collection: new List([obj], decouple) });
      } else {
        output[index].collection.append(decouple ? cloneDeep(obj) : obj);
      }
    }
    return output;
  }

  /**
   * ASYNC = Group the List<T> by a specified Key. Note: Decouples groups from original List<T>
   * @param key Callback function to specify Key to group by
   * @returns Returns new List of GroupList<T> on Key of U
   */
  groupByAsync<U>(key: (o: T) => U, decouple = this.decouple) {
    return new Promise<List<{ key: U; collection: List<T> }>>(resolve => resolve(this.groupBy(key, decouple)));
  }

  // TODO: groupJoin()

  // TODO: intersect()

  /**
   * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
   * @param inner The sequence to join to the first sequence.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from two matching elements.
   * @returns Returns decoupled List<TResult> with elements that are obtained by performing an inner join on two sequences.
   * @typedef TInner The type of the elements of the second sequence.
   * @typedef TKey The type of the keys returned by the key selector functions.
   * @typedef TResult The type of the result elements.
   */
  joinBy<TInner, TKey, TResult>(inner: List<TInner> | TInner[], outerKeySelector: (o: T) => TKey, innerKeySelector: (o: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, decouple = this.decouple): List<TResult> {
    const output = new List<TResult>();
    for (const _inner of inner) {
      for (const _outer of this) {
        if (isEqual(innerKeySelector(_inner), outerKeySelector(_outer))) {
          output.append(resultSelector(_outer, _inner));
        }
      }
    }
    return decouple ? cloneDeep(output) : output;
  }

  /**
   * ASYNC - Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
   * @param inner The sequence to join to the first sequence.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from two matching elements.
   * @returns Returns decoupled List<TResult> with elements that are obtained by performing an inner join on two sequences.
   * @typedef TInner The type of the elements of the second sequence.
   * @typedef TKey The type of the keys returned by the key selector functions.
   * @typedef TResult The type of the result elements.
   */
  joinByAsync<TInner, TKey, TResult>(inner: List<TInner> | TInner[], outerKeySelector: (o: T) => TKey, innerKeySelector: (o: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, decouple = this.decouple) {
    return new Promise<List<TResult>>(resolve => resolve(this.joinBy(inner, outerKeySelector, innerKeySelector, resultSelector, decouple)));
  }

  /**
   * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified.
   * @param predicate A function to test each element for a condition.
   * @param decouple Optional specification to deep clone the resulting object and decouple object references
   * @returns The last element in the List. Note: Does not decouple the returned object.
   */
  last(predicate?: (o: T) => boolean, decouple = this.decouple): T | undefined {
    if (!predicate) {
      return this[this.length - 1];
    } else {
      let output: T | undefined = undefined;
      for (let i = 0; i < this.length; i++) {
        if (predicate(this[i]) === true) {
          output = this[i];
        }
      }
      if (output) {
        return decouple ? cloneDeep(output) : output;
      } else {
        return undefined;
      }
    }
  }

  /**
   * ASYNC - Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified.
   * @param predicate A function to test each element for a condition.
   * @returns The last element in the List. Note: Does not decouple the returned object.
   */
  lastAsync(predicate?: (o: T) => boolean, decouple = this.decouple): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => resolve(this.last(predicate, decouple)));
  }

  /**
   * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified. Optionally declare default value if not found.
   * @param predicate A function to test each element for a condition.
   * @param defaultObj Optional default value. Null if not specified.
   * @param decouple Optional specification to deep clone the resulting object and decouple object references
   * @returns The last element in the List<T>. Note: Does not decouple the returned object.
   */
  lastOrDefault(defaultObj: T, predicate?: (o: T) => boolean, decouple = this.decouple): T {
    const obj = this.last(predicate, decouple);
    if (!obj) {
      return decouple ? cloneDeep(defaultObj) : defaultObj;
    } else {
      return decouple ? cloneDeep(obj) : obj;
    }
  }

  /**
   * ASYNC - Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified. Optionally declare default value if not found.
   * @param predicate A function to test each element for a condition.
   * @param defaultObj Optional default value. Null if not specified.
   * @param decouple Optional specification to deep clone the resulting object and decouple object references
   * @returns The last element in the List<T>. Note: Does not decouple the returned object.
   */
  lastOrDefaultAsync(defaultObj: T, predicate?: (o: T) => boolean, decouple = this.decouple) {
    return new Promise<T>(resolve => resolve(this.lastOrDefault(defaultObj, predicate, decouple)));
  }

  /**
   * Returns the larger of a set of supplied numeric expressions.
   * @param key optional key to specify which parameter to find the max of
   */
  max(key?: (o: T) => number) {
    if (key) {
      return Math.max(...this.map(o => key(o)));
    } else {
      return Math.max(...this as any[]);
    }
  }

  /**
   * ASYNC - Returns the larger of a set of supplied numeric expressions.
   * @param key optional key to specify which parameter to find the max of
   */
  maxAsync(key?: (o: T) => number) {
    return new Promise<number>(resolve => resolve(this.max(key)));
  }

  /**
   * Returns the smaller of a set of supplied numeric expressions.
   * @param key optional key to specify which parameter to find the min of
   */
  min(key?: (o: T) => number) {
    if (key) {
      return Math.min(...this.map(o => key(o)));
    } else {
      return Math.min(...this as any[]);
    }
  }

  /**
   * ASYNC - Returns the smaller of a set of supplied numeric expressions.
   * @param key optional key to specify which parameter to find the min of
   */
  minAsync(key?: (o: T) => number) {
    return new Promise<number>(resolve => resolve(this.min(key)));
  }

  /**
   * Filter and return a List<U> containing only elements of a specified type.
   * @param type Class constructor reference of type to compare to. Will match and return primitive types as well as objects of primitive types.
   * Ex. Type String will return values containing '123' and [String: '123'].
   * @returns Returns List<U> 
   */
  ofType<U>(type: { new(): U } | null | undefined): List<U> {
    if (type === undefined) {
      return new List<U>(this.filter(o => o === undefined) as any);
    } else if (type === null) {
      return new List<U>(this.filter(o => o === null) as any);
    } else {
      if (type === String.prototype.constructor) {
        return new List<U>(this.filter(o => typeof o === 'string' || o instanceof String) as any);
      } else if (type === Number.prototype.constructor) {
        return new List<U>(this.filter(o => typeof o === 'number' || o instanceof Number) as any);
      } else if (type === Boolean.prototype.constructor) {
        return new List<U>(this.filter(o => typeof o === 'boolean' || o instanceof Boolean) as any);
      } else if (type === Symbol.prototype.constructor) {
        return new List<U>(this.filter(o => typeof o === 'symbol' || o instanceof Symbol) as any);
      } else if (type === Function.prototype.constructor) {
        return new List<U>(this.filter(o => typeof o === 'function' || o instanceof Function) as any);
      } else {
        return new List<U>(this.filter(o => {
          if (o) {
            return type === Object.getPrototypeOf(o).constructor
          } else {
            return false;
          }
        }) as any);
      }
    }
  }

  /**
   * Orders a List<T>. Specify an optional key and Ascending or Descending order.
   * @param key The callback to specify which parameter of <T> to order by
   * @param order Specify 'asc' for Ascending, 'desc' for Descending. Ascending by default.
   */
  orderBy<U>(key?: (o: T) => U, order: 'desc' | 'asc' = 'asc') {
    if (order !== 'asc' && order !== 'desc') {
      throw new Error('Argument Exception: order must be asc or desc.');
    }
    if (key) {
      if (order === 'asc') {
        this.sort((a, b) => key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0);
      } else if (order === 'desc') {
        this.sort((a, b) => key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0);
      }
    } else {
      if (order === 'asc') {
        this.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
      } else if (order === 'desc') {
        this.sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
      }
    }
    return this;
  }

  /**
   * Adds values to the beginning of the List<T>.
   * @param objs The values to prepend to source.
   * @returns Returns the modified List<T>
   */
  prepend(...objs: T[]) {
    this.unshift(...objs);
    return this;
  }

  getRange(start?: number, end?: number) {
    if (start && start > this.length - 1) {
      throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
    } else if (end && end > this.length - 1) {
      throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
    } else if (start && start < 0) {
      throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
    } else if (end && end < 0) {
      throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
    } else if ((start && end) && (start > end)) {
      throw new Error('Starting index must be less than or equal to the ending index in the getRange method');
    }

    const output = new List<T>();
    if (!start && end) {
      for (let i = 0; i <= end; i++) {
        output.append(this[i]);
      }
    } else if (start && !end) {
      for (let i = start; i < this.length; i++) {
        output.append(this[i]);
      }
    } else {
      throw new Error('getRange must specify either start, end, or both.');
    }
    return output;
  }

  static repeat<T>(obj: T, count: number) {
    const output: T[] = [];
    for (let i = 0; i < count; i++) {
      output.push(obj);
    }
    return new List(output);
  }

  toArray(decouple = this.decouple): T[] {
    const output: T[] = [];
    for (const obj of this) {
      output.push(obj);
    }
    return decouple ? cloneDeep(output) : output;
  }

  /**
   * Select a list of columns, this method will flatten any class methods;
   */
  select<TResult>(selector: (o: T, index: number) => TResult, decouple = this.decouple): List<TResult> {
    let output = new List<TResult>();
    for (let i = 0; i < this.length; i++) {
      output.append(selector(this[i], i));
    }
    return decouple ? cloneDeep(output) : output;
  }

  // TODO: selectMany();

  // TODO: sequenceEqual();

  // TODO: single();

  // TODO: singleOrDefault();

  // TODO: skip();

  // TODO: skipLast();

  // TODO: skipWhile();

  /**
   * Adds all the elements of an array separated by the specified separator string.
   * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
   */
  split(separator = ','): string {
    return this.join(separator);
  }

  // TODO: take();

  // TODO: takeLast();

  // TODO: takeWhile();

  // TODO: thenBy();

  // TODO: thenByDescending();

  sum(key?: (o: T) => number) {
    let sum = 0;
    for (const obj of this) {
      if (key) {
        sum += key(obj);
      } else {
        sum += obj as any;
      }
    }
    return sum;
  }

  // TODO: toLookup();


  /**
   * Creates an List of unique values, in order, from all of the provided arrays using SameValueZero for equality comparisons.
   * @param array The arrays to inspect.
   * @returns New sorted and decoupled List<T> of unioned objects
   */
  union(collection: T[] | this, decouple = this.decouple) {
    const arr = union(this, collection);
    return new List(arr, decouple);
  }

  // TODO: zip();


  /**
   * Adds an object to the end of the List<T>.
   * @param obj The object to be added to the end of the List<T>. The value can be null for reference types.
   */
  add(obj: T) {
    this.events.next(ListEventType.Add);
    this.push(obj);
    return;
  }

  /**
   * Adds the elements of the specified collection to the end of the List<T>.
   * @param objects The collection whose elements should be added to the end of the List<T>. The collection itself cannot be null, but it can contain elements that are null, if type T is a reference type.
   */
  addRange(objects: T[]) {
    this.events.next(ListEventType.Add);
    this.push(...objects);
  }

  assignFrom<U, CommonKey>(from: U[], primaryKey: (o: T) => CommonKey, secondaryKey: (o: U) => CommonKey, assignFn: (to: T, fron: U) => any) {
    for (const fromObj of from) {
      for (const toObj of this) {
        if (primaryKey(toObj) === secondaryKey(fromObj)) {
          assignFn(toObj, fromObj);
        }
      }
    }
  }

  /**
   * Uses a binary search algorithm to locate a specific element in the sorted List<T> or a portion of it.
   * @param obj Searches the entire sorted List<T> for an element using deep object comparison.
   */
  binarySearch(obj: T) {
    return sortedIndex(this, obj);
  }

  /**
   * Removes all elements from the List<T>.
   */
  clear() {
    this.events.next(ListEventType.Clear)
    this.length = 0;
    return;
  }

  /**
   * (Alias of List<T>.map)
   * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
   * @param converter Callback function to map type T into type U
   * @returns Returns a decoupled List<U> converted to the desired type.
   */
  convertAll<U>(converter: (o: T) => U): List<U> {
    return new List(this.map(converter));
  }

  /**
   * Copies a range of elements from the List<T> to a compatible one-dimensional array, starting at the specified index of the target array.
   * @param array The one-dimensional Array that is the destination of the elements copied from List<T>. The Array must have zero-based indexing.
   * @param fromIndex The zero-based index in the source List<T> at which copying begins.
   * @param atIndex The zero-based index in array at which copying begins.
   * @param count The number of elements to copy.
   */
  copyTo(array: T[], fromIndex = 0, atIndex = 0, count = this.length): void {
    if (fromIndex < 0 || fromIndex > this.length) {
      throw new Error('Index out of range: fromIndex (' + fromIndex + ') does not exist in specified array.');
    } else if (atIndex < 0 || atIndex > array.length) {
      throw new Error('Index out of range: atIndex (' + atIndex + ') does not exist in target array.');
    } else if (count < 1 || count > this.length) {
      throw new Error('Argument Exception: count (' + count + ') is less than 1 or greater than the length of the specified array');
    }

    const output: T[] = array.slice(0, atIndex);
    cloneDeep(this.slice(fromIndex, count)).forEach(v => { output.push(v) });
    // console.log(output);
    array.slice(atIndex, array.length).forEach(v => output.push(v));

    for (let i = 0; i < array.length; i++) {
      array.pop();
    }

    for (let i = 0; i < output.length; i++) {
      array.push(output[i]);
    }
  }

  /**
   * (Alias of List.Any())
   * Return true or false if specified condition exists in one or more iterations of the List<T>
   * @param predicate Callback function to evaluate each iteration of the List<T>
   * @returns Returns boolean of expression
   */
  exists(predicate: (o: T) => boolean): boolean {
    return this.any(predicate);
  }

  /**
   * Decouples and retrieves all the elements that match the conditions defined by the specified predicate.
   * @param predicate The callback that defines the conditions of the elements to search for.
   * @returns A List<T> containing all the elements that match the conditions defined by the specified predicate, if found; otherwise, an empty List<T>.
   */
  findAll(predicate: (o: T) => boolean, decouple = this.decouple) {
    return new List(this.filter(predicate), decouple);
  }

  /**
   * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified. Optionally declare default value if not found.
   * @param predicate A function to test each element for a condition.
   * @param _default Optional default value. Null if not specified.
   * @returns The last element in the List. Note: Does not decouple the returned object.
   */
  findLast(predicate: (o: T) => boolean, defaultObj: T | undefined = undefined, decouple = this.decouple): T | undefined {
    const obj = this.last(predicate, decouple);
    if (obj) {
      return decouple ? cloneDeep(obj) : obj;
    } else if (defaultObj) {
      return decouple ? cloneDeep(defaultObj) : defaultObj;
    } else {
      return undefined;
    }
  }

  /**
   * Inserts an element into the List<T> at the specified index.
   * @param obj The object to insert. The value can be null for reference types.
   * @param atIndex The zero-based index at which item should be inserted.
   */
  insert(obj: T, atIndex: number) {
    this.splice(atIndex, 0, obj);
    return;
  }

  /**
   * Inserts the elements of a collection into the List<T> at the specified index.
   * @param objs The collection whose elements should be inserted into the List<T>. The collection itself cannot be null, but it can contain elements that are null, if type T is a reference type.
   * @param atIndex The zero-based index at which the new elements should be inserted.
   */
  insertRange(objs: T[], atIndex: number) {
    this.splice(atIndex, 0, ...objs);
    return;
  }

  /**
   * Removes an object from the List by performing deep comparison
   * @param obj The object to remove
   * @returns The modified List Object
   */
  remove(obj: T) {
    const index = this.findIndex(o => isEqual(o, obj));
    if (index) {
      this.splice(index, 1);
    }
    return;
  }

  /**
   * Remove all objects within the List<T> where the predicate expression evaluates to true.
   * @param predicate Callback expression to evaluate over each iteration of the List<T>
   * @returns Returns the modified List<T>
   */
  removeAll(predicate: (o: T) => boolean) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i]) === true) {
        this.splice(i, 1);
        i--;
      }
    }
    return;
  }

  // TODO: removeRange();

  /**
   * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
   * @param predicate The delegate that defines the conditions to check against the elements.
   */
  trueForAll(predicate: (o: T) => boolean) {
    return this.all(predicate);
  }

  splice(start: number, deleteCount: number, ...items: T[]) {
    const arr = this.toArray();
    const deleted = arr.splice(start, deleteCount, ...items);
    this.length = 0;
    for (const obj of arr) {
      this.push(obj);
    }
    return new List(deleted);
  }







}