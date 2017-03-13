import { ITest } from './interfaces/iTest';

export const testData: ITest[] = [
  { id: 'a', title: 'Test a', category: 'category 1', type: 'type1', completion: Math.round(Math.random() * 100) },
  { id: 'b', title: 'Test b', category: 'category 1', type: 'type2', completion: Math.round(Math.random() * 100)  },
  { id: 'c', title: 'Test c', category: 'category 2', type: 'type3', completion: Math.round(Math.random() * 100)  }
];
