const props = Symbol('props');

interface Props {
  email: string;
  isCorrect: boolean;
  name: string | null;
  domain: string | null;
}

class EmailParser {
  private readonly [props] = Reflect.construct(Map, []) as Map<this, Props>;

  public constructor(mail: string) {
    this.email = mail.trim();
  }

  public static validate(mail: string): boolean {
    // TODO: make true validation
    return /^\w+@\w+\.\w+$/i.test(mail);
  }

  public get email(): Props['email'] {
    const { email } = this[props].get(this) as Props;

    return email;
  }

  public set email(mail: string) {
    const isCorrect = EmailParser.validate(mail);
    const [name, domain] = isCorrect ? mail.split('@') : [null, null];

    this[props].set(this, { email: mail, isCorrect, name, domain });
  }

  public get isCorrect(): Props['isCorrect'] {
    const { isCorrect } = this[props].get(this) as Props;

    return isCorrect;
  }

  public get name(): Props['name'] {
    const { name } = this[props].get(this) as Props;

    return name;
  }

  public get domain(): Props['domain'] {
    const { domain } = this[props].get(this) as Props;

    return domain;
  }
}

/** @tutorial https://hacks.mozilla.org/2015/07/es6-in-depth-proxies-and-reflect */
function watchObj<
  Obj extends Object,
  Key extends keyof Obj,
  Value extends Obj[Key]
>(obj: Obj, callback: (key: Key, value: Value) => void): Obj {
  const handler: ProxyHandler<Obj> = {
    get(target, key) {
      const value: unknown = Reflect.get(target, key);

      if (typeof value === 'object' && value !== null) {
        return watchObj(value, callback);
      }

      if (typeof value === 'function') {
        return value.bind(target);
      }

      Reflect.apply(callback, target, [key, value]);

      return value;
    },
    set(target, key, value) {
      Reflect.apply(callback, target, [key, value]);

      return Reflect.set(target, key, value);
    },
  };

  return Reflect.construct(Proxy, [obj, handler]) as Obj;
}

export { Props as EmailParserProps, EmailParser, watchObj };
