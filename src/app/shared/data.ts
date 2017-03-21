import { ITest } from './interfaces/iTest';

export const testData: ITest[] = [
  { id: 'a', title: 'Test a', category: 'category 1', type: 'type1', completion: Math.round(Math.random() * 100) },
  { id: 'b', title: 'Test b', category: 'category 1', type: 'type2', completion: Math.round(Math.random() * 100)  },
  { id: 'c', title: 'Aligne les cercles', category: 'Equilibre', type: 'balance', completion: Math.round(Math.random() * 100)  }
];
