import { List } from './index';

export class TestClass1 {
  id: number;
  num: number;
  constructor(init?: Partial<TestClass1>) {
    this.id = init?.id || 0;
    this.num = init?.num || 0;
  }
}

export class TestClass2 {
  pk: number;
  str: string;

  constructor(init?: Partial<TestClass2>) {
    this.pk = init?.pk || 0;
    this.str = init?.str || '';
  }
}


const test = new List<TestClass1>([
  new TestClass1({ id: 1 }),
  new TestClass1({ id: 2 }),
  new TestClass1({ id: 3 })
]);

const test2 = new List<TestClass2>([
  new TestClass2({ pk: 1, str: '100' }),
  new TestClass2({ pk: 2, str: 'abcd' }),
  new TestClass2({ pk: 3, str: '300' })
]);

test.assignFrom(test2, (o) => o.id, (o) => o.pk, (a, b) => {
  const parsed = parseInt(b.str);
  if (!isNaN(parsed)) {
    a.num = parsed;
  }
});

console.log(test);