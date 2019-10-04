"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var TestClass1 = /** @class */ (function () {
    function TestClass1(init) {
        this.num = init || 0;
    }
    return TestClass1;
}());
exports.TestClass1 = TestClass1;
var TestClass2 = /** @class */ (function () {
    function TestClass2(init) {
        this.str = init || '';
    }
    return TestClass2;
}());
exports.TestClass2 = TestClass2;
// const list = new List<TestClass1 | TestClass2>([new TestClass1(123), new TestClass2('test')]);
var list = new index_1.List(['test 1', 'test2', 123, 45, 12314, { test: 'str' }, true, false, null, undefined, new TestClass1(), function (test) { }, new String('test object')]);
var test1 = list.ofType(String);
// const list = new List([{ str: 'test1', id: 1 }, { str: 'test2', id: 2 }]);
// list.splice(1, 1);
// list.insert({ str: 'test3', id: 3 }, 1);
// const arr = new Array([{ str: 'test1', id: 1 }, { str: 'test2', id: 2 }]);
// arr.splice(0, 1);
// export class FancyArray<T> extends Array<T>{
//   constructor(...vals: T[]) {
//     super(...vals);
//   }
// }
// const test = new FancyArray({ str: 'test1', id: 1 }, { str: 'test2', id: 2 });
// test.splice(1, 1);
// console.log(test);
console.log(test1);
