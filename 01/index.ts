const SPACE = ' ';

function normalizeString(string: string): string {
  return string.replace(/\s+/g, SPACE).trim();
}

/** @returns количество слов в строке */
function getNumberOfWords1(string: string): number {
  const str = normalizeString(string);
  let prevSpaceIndex = 0;
  let currSpaceIndex = 0;
  let numberOfSpaces = 0;

  if (str.charAt(0) === '') return 0;

  while (true) {
    currSpaceIndex = str.indexOf(SPACE, prevSpaceIndex + 1);

    if (currSpaceIndex === -1) break;

    prevSpaceIndex = currSpaceIndex;
    numberOfSpaces += 1;
  }

  return numberOfSpaces + 1;
}

/** @returns количество слов в строке */
function getNumberOfWords2(string: string): number {
  const str = normalizeString(string);
  let numberOfSpaces = 0;

  if (str[0] === undefined) return 0;

  for (let index = 0; ; index += 1) {
    if (str[index] === undefined) break;
    if (str[index] === SPACE) numberOfSpaces += 1;
  }

  return numberOfSpaces + 1;
}

/** @returns количество слов в строке */
function getNumberOfWords3(string: string): number {
  const str = normalizeString(string);
  const { length: strLength } = str;
  let numberOfSpaces = 0;

  if (strLength === 0) return 0;

  for (let index = 0; index < strLength; index += 1) {
    if (str[index] === SPACE) numberOfSpaces += 1;
  }

  return numberOfSpaces + 1;
}

/** @returns итерируемый объект перебирающий слова */
function getIteratorWords1(string: string): Iterable<string> {
  const str = normalizeString(string);
  let prevSpaceIndex = -1;
  let currSpaceIndex = 0;
  let isDone = false;

  return {
    [Symbol.iterator]() {
      return {
        next() {
          currSpaceIndex = str.indexOf(SPACE, prevSpaceIndex + 1);

          if (currSpaceIndex === -1) {
            if (isDone || str.length === 0)
              return { done: true, value: undefined };

            isDone = true;

            return { done: false, value: str.substring(prevSpaceIndex + 1) };
          }

          const value = str.substring(prevSpaceIndex + 1, currSpaceIndex);

          prevSpaceIndex = currSpaceIndex;

          return { done: false, value };
        },
      };
    },
  };
}

/** @returns итерируемый объект перебирающий слова */
function* getIteratorWords2(string: string): Generator<string> {
  const str = normalizeString(string);
  const { length: strLength } = str;
  let startIndex = 0;

  for (let currentIndex = 0; currentIndex < strLength; currentIndex += 1) {
    const char = str[currentIndex];

    if (char === SPACE) {
      yield str.substring(startIndex, currentIndex);
      startIndex = currentIndex + 1;
    }
  }

  if (strLength > 0) yield str.substring(startIndex, strLength);
}

/** @returns итерируемый объект перебирающий слова */
function* getIteratorWords3(string: string): Generator<string> {
  const str = normalizeString(string);
  const { length: strLength } = str;
  let word = '';

  if (strLength === 0) return;

  for (let index = 0; index < strLength; index += 1) {
    const char = str[index];

    if (char === SPACE) {
      yield word;
      word = '';
    } else {
      word += char;
    }
  }

  yield word;
}

export {
  getNumberOfWords1,
  getNumberOfWords2,
  getNumberOfWords3,
  getNumberOfWords3 as wordsCount,
  getIteratorWords1,
  getIteratorWords2,
  getIteratorWords3,
  getIteratorWords3 as getWords,
};
