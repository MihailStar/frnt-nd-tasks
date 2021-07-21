import {
  getNumberOfWords1,
  getNumberOfWords2,
  getNumberOfWords3,
  getIteratorWords1,
  getIteratorWords2,
  getIteratorWords3,
} from './index';

type SourceString = string;
type Words = string[];
type NumberOfWords = number;

const testStrings: Readonly<[SourceString, Words, NumberOfWords]>[] = [
  ['  Всем  привет! Ура ура! ', ['Всем', 'привет!', 'Ура', 'ура!'], 4],
  ['  Всем  привет!\nУра ура! ', ['Всем', 'привет!', 'Ура', 'ура!'], 4],
  ['  Всем  привет! \nУра ура! ', ['Всем', 'привет!', 'Ура', 'ура!'], 4],
  ['  Всем  привет!\n Ура ура! ', ['Всем', 'привет!', 'Ура', 'ура!'], 4],
  ['  Всем  привет! \n Ура ура! ', ['Всем', 'привет!', 'Ура', 'ура!'], 4],

  ['', [], 0],
  ['   ', [], 0],

  ['123', ['123'], 1],
  ['   123', ['123'], 1],
  ['123   ', ['123'], 1],
  ['   123   ', ['123'], 1],

  ['123 456', ['123', '456'], 2],
  ['   123 456', ['123', '456'], 2],
  ['123 456   ', ['123', '456'], 2],
  ['   123 456   ', ['123', '456'], 2],

  ['123   456', ['123', '456'], 2],
  ['   123   456', ['123', '456'], 2],
  ['123   456   ', ['123', '456'], 2],
  ['   123   456   ', ['123', '456'], 2],

  ['123 456 789', ['123', '456', '789'], 3],
  ['   123 456 789', ['123', '456', '789'], 3],
  ['123 456 789   ', ['123', '456', '789'], 3],
  ['   123 456 789   ', ['123', '456', '789'], 3],

  ['123   456   789', ['123', '456', '789'], 3],
  ['   123   456   789', ['123', '456', '789'], 3],
  ['123   456   789   ', ['123', '456', '789'], 3],
  ['   123   456   789   ', ['123', '456', '789'], 3],
];

[getNumberOfWords1, getNumberOfWords2, getNumberOfWords3].forEach((func) => {
  describe(func, () => {
    testStrings.forEach(([input, , output]) => {
      test(`'${input}'`, () => {
        expect(func(input)).toBe(output);
      });
    });
  });
});

[getIteratorWords1, getIteratorWords2, getIteratorWords3].forEach((func) => {
  describe(func, () => {
    testStrings.forEach(([input, output]) => {
      const result: string[] = [];

      for (const word of func(input)) {
        result.push(word);
      }

      test(`'${input}'`, () => {
        expect(result).toStrictEqual(output);
      });
    });
  });
});
