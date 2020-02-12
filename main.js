"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var TestClass1 = /** @class */ (function () {
    function TestClass1(init) {
        var _a, _b;
        this.id = ((_a = init) === null || _a === void 0 ? void 0 : _a.id) || 0;
        this.num = ((_b = init) === null || _b === void 0 ? void 0 : _b.num) || 0;
    }
    return TestClass1;
}());
exports.TestClass1 = TestClass1;
var TestClass2 = /** @class */ (function () {
    function TestClass2(init) {
        var _a, _b;
        this.pk = ((_a = init) === null || _a === void 0 ? void 0 : _a.pk) || 0;
        this.str = ((_b = init) === null || _b === void 0 ? void 0 : _b.str) || '';
    }
    return TestClass2;
}());
exports.TestClass2 = TestClass2;
var test = new index_1.List([
    new TestClass1({ id: 1 }),
    new TestClass1({ id: 2 }),
    new TestClass1({ id: 3 })
]);
var test2 = new index_1.List([
    new TestClass2({ pk: 1, str: '100' }),
    new TestClass2({ pk: 2, str: 'abcd' }),
    new TestClass2({ pk: 3, str: '300' })
]);
test.assignFrom(test2, function (o) { return o.id; }, function (o) { return o.pk; }, function (a, b) {
    var parsed = parseInt(b.str);
    if (!isNaN(parsed)) {
        a.num = parsed;
    }
});
console.log(test);
