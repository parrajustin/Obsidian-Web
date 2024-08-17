export const Fork =
  <T1 = unknown, T2 = unknown, I = unknown>(
    test: boolean | ((input: I) => boolean),
    trueFunc: (input: I) => T1,
    falseFunc: (input: I) => T2
  ) =>
  (input: I) => {
    if (test instanceof Function) {
      return test(input) ? trueFunc(input) : falseFunc(input);
    } else {
      return test ? trueFunc(input) : falseFunc(input);
    }
  };
