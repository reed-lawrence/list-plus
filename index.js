"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var lodash_1 = require("lodash");
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(init, decouple) {
        if (decouple === void 0) { decouple = false; }
        var _this = this;
        var initVals = decouple ? lodash_1.cloneDeep(init) : init;
        _this = _super.apply(this, initVals) || this;
        Object.setPrototypeOf(_this, Object.create(List.prototype));
        _this.decouple = decouple;
        return _this;
    }
    /**
     * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param predicate Callback function of the conditions to check against the elements.
     * @returns Returns true or false
     */
    List.prototype.all = function (predicate) {
        var output = true;
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]) === false) {
                output = false;
            }
        }
        return output;
    };
    /**
     * ASYNC - Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param predicate Callback function of the conditions to check against the elements.
     * @returns Returns true or false
     */
    List.prototype.allAsync = function (predicate) {
        var _this = this;
        return new Promise(function (resolve) {
            var result = _this.all(predicate);
            resolve(result);
        });
    };
    /**
     * Return true or false if specified condition exists in one or more iterations of the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.any = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]) === true) {
                return true;
            }
        }
        return false;
    };
    /**
     * Return true or false if specified condition exists in one or more iterations of the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.anyAsync = function (predicate) {
        var _this = this;
        return new Promise(function (resolve) {
            var result = _this.any(predicate);
            return resolve(result);
        });
    };
    /**
     * appends a value to the end of the List<T>.
     * @param obj The object<T> to append to the List<T>
     * @returns Returns the modified List<T>
     */
    List.prototype.append = function (obj) {
        this.push(obj);
        return this;
    };
    // TODO: asList
    /**
     * Function that finds the average of a specified List collection
     * @param key The key to specifiy the numeric value to average
     */
    List.prototype.average = function (key) {
        var sum = 0;
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (key) {
                sum += key(obj);
            }
            else {
                sum += obj;
            }
        }
        return sum / this.length;
    };
    /**
     * Override method to force TypeScript compiler to treat values as specified by the type declaration.
     * **For type conversions use List<T>.convert() or List<T>.map()**
     */
    List.prototype.cast = function () {
        return new List(this.map(function (i) { return i; }));
    };
    /**
     * Performs a deep recursive comparison if an object exists in the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.contains = function (obj) {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var o = _a[_i];
            if (lodash_1.isEqual(o, obj)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Get the count of elements in List<T> as defined by a predicate callback function.
     * @param predicate Callback function of the conditions to check against the elements
     * @returns Returns count
     */
    List.prototype.count = function (predicate) {
        if (!predicate) {
            return this.length;
        }
        else {
            var count = 0;
            for (var i = 0; i < this.length; i++) {
                if (predicate(this[i])) {
                    count++;
                }
            }
            return count;
        }
    };
    // TODO: defaultIfEmpty()
    /**
     * Returns distinct elements from a sequence.
     * @param key Optional specification of key to compare uniqueness
     * @returns An List<T> that contains distinct elements from the source sequence.
     */
    List.prototype.distinct = function (comparer) {
        var output = new List();
        var _loop_1 = function (obj) {
            var index = comparer ? output.findIndex(function (o) { return comparer(o) === comparer(obj); }) : output.findIndex(function (o) { return lodash_1.isEqual(o, obj); });
            if (index === -1) {
                output.push(obj);
            }
        };
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var obj = _a[_i];
            _loop_1(obj);
        }
        return output;
    };
    /**
     * ASYNC - Returns distinct elements from a sequence.
     * @param key Optional specification of key to compare uniqueness
     * @returns An List<T> that contains distinct elements from the source sequence.
     */
    List.prototype.distinctAsync = function (key) {
        var _this = this;
        return new Promise(function (resolve) {
            var output = _this.distinct(key);
            resolve(output);
        });
    };
    /**
     * Returns the element at a specified index in a sequence.
     * @param index The zero-based index of the element to retrieve.
     * @returns The decoupled element at the specified position in the source sequence.
     */
    List.prototype.elementAt = function (index, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        if (index && this.length > 0) {
            return decouple ? lodash_1.cloneDeep(this[index]) : this[index];
        }
        return undefined;
    };
    /**
     * Returns the element at a specified index in a sequence or a default value if the index is out of range. You may optionally specify
     * the default object that is returned. Returns null if not specified.
     * @param index The zero-based index of the element to retrieve.
     * @param default Optional object to return if index is out of range or does not exist.
     * @returns The decoupled element at the specified position in the source sequence or the default specified.
     */
    List.prototype.elementAtOrDefault = function (index, defaultObj, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        var elem = this.elementAt(index);
        if (!elem) {
            return decouple ? lodash_1.cloneDeep(defaultObj) : defaultObj;
        }
        else {
            return elem;
        }
    };
    /**
     * Returns an empty List<T> that has the specified type argument.
     * @typedef TResult type to assign to the type parameter of the returned generic IList<T>.
     * @returns An empty List<T> whose type argument is TResult.
     */
    List.empty = function () {
        return new List();
    };
    // TODO: except()
    /**
     * Returns the first element that matches the specified criteria. Returns undefined if not found.
     * Note: Decouples from List<T>.
     * @param predicate The expression to evaluate
     * @returns First matching element or undefined if not found.
     */
    List.prototype.first = function (predicate, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        if (!predicate) {
            if (this.length > 0) {
                return decouple === true ? lodash_1.cloneDeep(this[0]) : this[0];
            }
            else {
                return undefined;
            }
        }
        else {
            for (var i = 0; i < this.length; i++) {
                if (predicate(this[i]) === true) {
                    return decouple === true ? lodash_1.cloneDeep(this[i]) : this[i];
                }
            }
            return undefined;
        }
    };
    /**
     * Returns the first element that matches the specified criteria. Returns the optionally specified default object or null if not specified.
     * Note: Decouples from List<T>.
     * @param predicate The expression to evaluate
     * @returns First matching element or optionally specified default (null if not specified).
     */
    List.prototype.firstOrDefault = function (predicate, defaultObj, decouple) {
        if (predicate === void 0) { predicate = null; }
        if (decouple === void 0) { decouple = this.decouple; }
        var elem = this.first(predicate, decouple);
        if (elem) {
            return elem;
        }
        else if (!elem && defaultObj) {
            return decouple ? lodash_1.cloneDeep(defaultObj) : defaultObj;
        }
        else {
            return undefined;
        }
    };
    /**
     * Group the List<T> by a specified Key. Note: Decouples groups from original List<T>
     * @param key Callback function to specify Key to group by
     * @returns Returns new List of GroupList<T> on Key of U
     */
    List.prototype.groupBy = function (key, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        var output = new List();
        var _loop_2 = function (obj) {
            var index = output.findIndex(function (o) { return o.key === key(obj); });
            if (index === -1) {
                output.append({ key: decouple ? lodash_1.cloneDeep(key(obj)) : key(obj), collection: new List([obj], decouple) });
            }
            else {
                output[index].collection.append(decouple ? lodash_1.cloneDeep(obj) : obj);
            }
        };
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var obj = _a[_i];
            _loop_2(obj);
        }
        return output;
    };
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
    List.prototype.joinBy = function (inner, outerKeySelector, innerKeySelector, resultSelector, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        var output = new List();
        for (var _i = 0, inner_1 = inner; _i < inner_1.length; _i++) {
            var _inner = inner_1[_i];
            for (var _a = 0, _b = this; _a < _b.length; _a++) {
                var _outer = _b[_a];
                if (lodash_1.isEqual(innerKeySelector(_inner), outerKeySelector(_outer))) {
                    output.append(resultSelector(_outer, _inner));
                }
            }
        }
        return decouple ? lodash_1.cloneDeep(output) : output;
    };
    /**
     * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified.
     * @param predicate A function to test each element for a condition.
     * @returns The last element in the List. Note: Does not decouple the returned object.
     */
    List.prototype.last = function (predicate) {
        if (!predicate) {
            return this[this.length - 1];
        }
        else {
            var output = undefined;
            for (var i = 0; i < this.length; i++) {
                if (predicate(this[i]) === true) {
                    output = this[i];
                }
            }
            return output;
        }
    };
    /**
     * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified. Optionally declare default value if not found.
     * @param predicate A function to test each element for a condition.
     * @param _default Optional default value. Null if not specified.
     * @returns The last element in the List<T>. Note: Does not decouple the returned object.
     */
    List.prototype.lastOrDefault = function (predicate, defaultObj) {
        if (predicate === void 0) { predicate = null; }
        var obj = this.last(predicate);
        if (!obj) {
            return defaultObj;
        }
        else {
            return obj;
        }
    };
    List.prototype.max = function (key) {
        if (key) {
            return Math.max.apply(Math, this.map(function (o) { return key(o); }));
        }
        else {
            return Math.max.apply(Math, this);
        }
    };
    List.prototype.min = function (key) {
        if (key) {
            return Math.min.apply(Math, this.map(function (o) { return key(o); }));
        }
        else {
            return Math.min.apply(Math, this);
        }
    };
    /**
     * TODO: Needs improvement
     * Filter and return a new decoupled List<U> containing only elements of a specified type.
     * @param type Pick from predefined types, or pass a Class reference to filter by
     * @returns Returns List<U>
     */
    List.prototype.ofType = function (type) {
        var output = new List();
        var objectKeys = Object.keys(type);
        for (var i = 0; i < this.length; i++) {
            if (typeof type === 'object') {
                var allKeysMatch = true;
                var _keys = Object.keys(this[i]);
                for (var j = 0; j < objectKeys.length; j++) {
                    var exists = _keys.indexOf(objectKeys[j]) !== -1;
                    if (exists === false) {
                        allKeysMatch = false;
                    }
                }
                if (allKeysMatch === true) {
                    output.append(this[i]);
                }
            }
            else {
                if (typeof this[i] === type) {
                    output.append(this[i]);
                }
            }
        }
        return this.decouple ? lodash_1.cloneDeep(output) : output;
    };
    /**
     * Orders a List<T>. Specify an optional key and Ascending or Descending order.
     * @param key The callback to specify which parameter of <T> to order by
     * @param order Specify 'asc' for Ascending, 'desc' for Descending. Ascending by default.
     */
    List.prototype.orderBy = function (key, order) {
        if (key === void 0) { key = null; }
        if (order === void 0) { order = 'asc'; }
        if (order !== 'asc' && order !== 'desc') {
            throw new Error('Argument Exception: order must be asc or desc.');
        }
        if (key !== null) {
            if (order === 'asc') {
                this.sort(function (a, b) { return key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0; });
            }
            else if (order === 'desc') {
                this.sort(function (a, b) { return key(a) > key(b) ? -1 : key(a) < key(b) ? 1 : 0; });
            }
        }
        else {
            if (order === 'asc') {
                this.sort(function (a, b) { return a > b ? 1 : a < b ? -1 : 0; });
            }
            else if (order === 'desc') {
                this.sort(function (a, b) { return a > b ? -1 : a < b ? 1 : 0; });
            }
        }
        return this;
    };
    /**
     * Adds values to the beginning of the List<T>.
     * @param objs The values to prepend to source.
     * @returns Returns the modified List<T>
     */
    List.prototype.prepend = function () {
        var objs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objs[_i] = arguments[_i];
        }
        this.unshift.apply(this, objs);
        return this;
    };
    List.prototype.getRange = function (start, end) {
        if (start > this.length - 1) {
            throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
        }
        else if (end > this.length - 1) {
            throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
        }
        else if (start < 0) {
            throw new Error('Index out of range exception. The specified index ' + start + ' does not exist in target List.');
        }
        else if (end < 0) {
            throw new Error('Index out of range exception. The specified index ' + end + ' does not exist in target List.');
        }
        else if ((start && end) && (start > end)) {
            throw new Error('Starting index must be less than or equal to the ending index in the range method');
        }
        var output = new List();
        if (!start && end) {
            for (var i = 0; i <= end; i++) {
                output.append(this[i]);
            }
        }
        else if (start && !end) {
            for (var i = start; i < this.length; i++) {
                output.append(this[i]);
            }
        }
        else if (!start && !end) {
            for (var i = start; i <= end; i++) {
                output.append(this[i]);
            }
        }
        else {
            throw new Error('rannge must specify either start, end, or both.');
        }
        return output;
    };
    List.repeat = function (obj, count) {
        var output = [];
        for (var i = 0; i < count; i++) {
            output.push(obj);
        }
        return new List(output);
    };
    List.prototype.toArray = function (decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        var output = [];
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var obj = _a[_i];
            output.push(obj);
        }
        return decouple ? lodash_1.cloneDeep(output) : output;
    };
    /**
     * Select a list of columns, this method will flatten any class methods;
     */
    List.prototype.select = function (selector, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        var output = new List();
        for (var i = 0; i < this.length; i++) {
            output.append(selector(this[i], i));
        }
        return decouple ? lodash_1.cloneDeep(output) : output;
    };
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
    List.prototype.split = function (separator) {
        if (separator === void 0) { separator = ','; }
        return this.join(separator);
    };
    // TODO: take();
    // TODO: takeLast();
    // TODO: takeWhile();
    // TODO: thenBy();
    // TODO: thenByDescending();
    List.prototype.sum = function (key) {
        var sum = 0;
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (key) {
                sum += key(obj);
            }
            else {
                sum += obj;
            }
        }
        return sum;
    };
    // TODO: toLookup();
    /**
     * Creates an List of unique values, in order, from all of the provided arrays using SameValueZero for equality comparisons.
     * @param array The arrays to inspect.
     * @returns New sorted and decoupled List<T> of unioned objects
     */
    List.prototype.union = function (collection, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        var arr = lodash_1.union(this, collection);
        return new List(arr, decouple);
    };
    // TODO: zip();
    /**
     * Adds an object to the end of the List<T>.
     * @param obj The object to be added to the end of the List<T>. The value can be null for reference types.
     */
    List.prototype.add = function (obj) {
        this.push(obj);
        return;
    };
    /**
     * Adds the elements of the specified collection to the end of the List<T>.
     * @param objects The collection whose elements should be added to the end of the List<T>. The collection itself cannot be null, but it can contain elements that are null, if type T is a reference type.
     */
    List.prototype.addRange = function (objects) {
        this.push.apply(this, objects);
    };
    /**
     * Uses a binary search algorithm to locate a specific element in the sorted List<T> or a portion of it.
     * @param obj Searches the entire sorted List<T> for an element using deep object comparison.
     */
    List.prototype.binarySearch = function (obj) {
        return lodash_1.sortedIndex(this, obj);
    };
    /**
     * Removes all elements from the List<T>.
     */
    List.prototype.clear = function () {
        this.length = 0;
        return;
    };
    /**
     * (Alias of List<T>.map)
     * Calls a defined callback function on each element of a List<T>, and returns a decoupled List<U> that contains the results.
     * @param converter Callback function to map type T into type U
     * @returns Returns a decoupled List<U> converted to the desired type.
     */
    List.prototype.convertAll = function (converter) {
        return new List(this.map(converter));
    };
    /**
     * Copies a range of elements from the List<T> to a compatible one-dimensional array, starting at the specified index of the target array.
     * @param array The one-dimensional Array that is the destination of the elements copied from List<T>. The Array must have zero-based indexing.
     * @param fromIndex The zero-based index in the source List<T> at which copying begins.
     * @param atIndex The zero-based index in array at which copying begins.
     * @param count The number of elements to copy.
     */
    List.prototype.copyTo = function (array, fromIndex, atIndex, count) {
        if (fromIndex === void 0) { fromIndex = 0; }
        if (atIndex === void 0) { atIndex = 0; }
        if (count === void 0) { count = this.length; }
        if (fromIndex < 0 || fromIndex > this.length) {
            throw new Error('Index out of range: fromIndex (' + fromIndex + ') does not exist in specified array.');
        }
        else if (atIndex < 0 || atIndex > array.length) {
            throw new Error('Index out of range: atIndex (' + atIndex + ') does not exist in target array.');
        }
        else if (count < 1 || count > this.length) {
            throw new Error('Argument Exception: count (' + count + ') is less than 1 or greater than the length of the specified array');
        }
        var output = array.slice(0, atIndex);
        lodash_1.cloneDeep(this.slice(fromIndex, count)).forEach(function (v) { output.push(v); });
        // console.log(output);
        array.slice(atIndex, array.length).forEach(function (v) { return output.push(v); });
        for (var i = 0; i < array.length; i++) {
            array.pop();
        }
        for (var i = 0; i < output.length; i++) {
            array.push(output[i]);
        }
    };
    /**
     * (Alias of List.Any())
     * Return true or false if specified condition exists in one or more iterations of the List<T>
     * @param predicate Callback function to evaluate each iteration of the List<T>
     * @returns Returns boolean of expression
     */
    List.prototype.exists = function (predicate) {
        return this.any(predicate);
    };
    /**
     * Decouples and retrieves all the elements that match the conditions defined by the specified predicate.
     * @param predicate The callback that defines the conditions of the elements to search for.
     * @returns A List<T> containing all the elements that match the conditions defined by the specified predicate, if found; otherwise, an empty List<T>.
     */
    List.prototype.findAll = function (predicate, decouple) {
        if (decouple === void 0) { decouple = this.decouple; }
        return new List(this.filter(predicate), decouple);
    };
    /**
     * Returns the last element of a sequence that satisfies a specified condition or the last element if a condition is not specified. Optionally declare default value if not found.
     * @param predicate A function to test each element for a condition.
     * @param _default Optional default value. Null if not specified.
     * @returns The last element in the List. Note: Does not decouple the returned object.
     */
    List.prototype.findLast = function (predicate, defaultObj) {
        return this.lastOrDefault(predicate, defaultObj);
    };
    /**
     * Inserts an element into the List<T> at the specified index.
     * @param obj The object to insert. The value can be null for reference types.
     * @param atIndex The zero-based index at which item should be inserted.
     */
    List.prototype.insert = function (obj, atIndex) {
        this.splice(atIndex, 0, obj);
        return;
    };
    /**
     * Inserts the elements of a collection into the List<T> at the specified index.
     * @param objs The collection whose elements should be inserted into the List<T>. The collection itself cannot be null, but it can contain elements that are null, if type T is a reference type.
     * @param atIndex The zero-based index at which the new elements should be inserted.
     */
    List.prototype.insertRange = function (objs, atIndex) {
        this.splice.apply(this, [atIndex, 0].concat(objs));
        return;
    };
    /**
     * Removes an object from the List by performing deep comparison
     * @param obj The object to remove
     * @returns The modified List Object
     */
    List.prototype.remove = function (obj) {
        var index = this.findIndex(function (o) { return lodash_1.isEqual(o, obj); });
        if (index) {
            this.splice(index, 1);
        }
        return;
    };
    /**
     * Remove all objects within the List<T> where the predicate expression evaluates to true.
     * @param predicate Callback expression to evaluate over each iteration of the List<T>
     * @returns Returns the modified List<T>
     */
    List.prototype.removeAll = function (predicate) {
        for (var i = 0; i < this.length; i++) {
            if (predicate(this[i]) === true) {
                this.splice(i, 1);
                i--;
            }
        }
        return;
    };
    // TODO: removeRange();
    /**
     * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param predicate The delegate that defines the conditions to check against the elements.
     */
    List.prototype.trueForAll = function (predicate) {
        return this.all(predicate);
    };
    List.prototype.splice = function (start, deleteCount) {
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        var arr = this.toArray();
        var deleted = arr.splice.apply(arr, [start, deleteCount].concat(items));
        this.length = 0;
        for (var _a = 0, arr_1 = arr; _a < arr_1.length; _a++) {
            var obj = arr_1[_a];
            this.push(obj);
        }
        return new List(deleted);
    };
    return List;
}(Array));
exports.List = List;
