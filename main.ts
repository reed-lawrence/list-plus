import { List } from './index';

export class TestClass1 {
  num: number;
  constructor(init?: number) {
    this.num = init || 0;
  }
}

export class TestClass2 {
  str: string;

  constructor(init?: string) {
    this.str = init || '';
  }
}

// const list = new List<TestClass1 | TestClass2>([new TestClass1(123), new TestClass2('test')]);
const list = new List(['test 1', 'test2', 123, 45, 12314, { test: 'str' }, true, false, null, undefined, new TestClass1(), (test: any) => { }, new String('test object')]);
const test1 = list.ofType(String);

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