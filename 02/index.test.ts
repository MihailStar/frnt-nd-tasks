import { EmailParserProps, EmailParser, watchObj } from './index';

const testEmails: Readonly<
  [
    EmailParserProps['email'],
    EmailParserProps['isCorrect'],
    EmailParserProps['name'],
    EmailParserProps['domain']
  ][]
> = [
  ['info@ntschool.ru', true, 'info', 'ntschool.ru'],
  ['support@@ntschool.ru', false, null, null],
  ['some1@nz', false, null, null],
];

describe(EmailParser, () => {
  testEmails.forEach(([email, isCorrect, name, domain]) => {
    const emailParser = Reflect.construct(EmailParser, [email]) as EmailParser;

    test(email, () => {
      expect(emailParser.email).toBe(email);
      expect(emailParser.isCorrect).toBe(isCorrect);
      expect(emailParser.name).toBe(name);
      expect(emailParser.domain).toBe(domain);
    });
  });
});

describe(watchObj, () => {
  let result: { prop?: string; value?: unknown };

  beforeEach(() => {
    result = {};
  });

  const div = document.createElement('div');
  const cleverDiv = watchObj(div, (prop, val) => {
    result = { prop, value: val };
  });

  test('element.innerHTML', () => {
    const value = '<strong>HTML</strong><em>Changed</em>';

    cleverDiv.innerHTML = value;

    expect(cleverDiv.innerHTML).toBe(value);
    expect(result).toStrictEqual({ prop: 'innerHTML', value });
  });

  test('element.style.color', () => {
    const value = 'red';

    cleverDiv.style.color = value;

    expect(cleverDiv.style.color).toBe(value);
    expect(result).toStrictEqual({ prop: 'color', value });
  });

  test('element.querySelector("em").style.color', () => {
    const value = 'green';

    cleverDiv.querySelector('em')!.style.color = value;

    expect(cleverDiv.querySelector('em')!.style.color).toBe(value);
    expect(result).toStrictEqual({});
  });

  test('element.classList.add("some")', () => {
    const value = 'some';

    cleverDiv.classList.add(value);

    expect(cleverDiv.classList.contains(value)).toBe(true);
    expect(result).toStrictEqual({});
  });
});
