// type MapperMonadFunction<T, U> =
type ExtractReturnType<T> = T extends (input: unknown) => infer U ? U : never;

export class IdentityMonad<T> {
  constructor(private value: T) {}

  public static of<I>(value: I): IdentityMonad<I> {
    return new IdentityMonad<I>(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public map<F extends (input: T) => any>(mapper: F): IdentityMonad<ExtractReturnType<F>> {
    return IdentityMonad.of(mapper(this.value));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public chain<F extends (input: T) => any>(mapper: F): ExtractReturnType<F> {
    return mapper(this.value);
  }
  public emit(): () => T {
    return () => this.value;
  }
  public val(): T {
    return this.value;
  }
}
