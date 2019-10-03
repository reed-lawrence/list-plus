import { List } from './index';

const list = new List([{ str: 'test1', id: 1 }, { str: 'test2', id: 2 }]);
list.splice(1, 1);
// list.insert({ str: 'test3', id: 3 }, 1);
console.log(list);

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