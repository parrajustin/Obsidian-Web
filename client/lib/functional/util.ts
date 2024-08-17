export const Trace =
  <T>(label: string) =>
  (value: T) => {
    console.log(`${label}: ${value}`);
    return value;
  };

export const ApplyPromise =
  <T1, T2 = unknown>(func: ((val: T1) => T2) | ((val: T1) => Promise<T2>)) =>
  (p: Promise<T1>): Promise<T2> =>
    p.then((v) => func(v));
