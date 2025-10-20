interface SequenceType {
  numbers: number[];
  description: string;
}

interface SequencesType {
  [key: string]: SequenceType;
}

export const sequences: SequencesType = {
  mersennePrime: {
    numbers: [3, 7, 31, 127, 8191, 131071, 524287, 2147483647],
    description: "mersenne prime",
  },
  perfect: {
    numbers: [],
    description: "perfect number",
  },
  taxicab: {
    numbers: [1729],
    description: "taxicab number",
  },
  lehmer: {
    numbers: [276, 552, 564, 660, 966],
    description: "lehmer number",
  },
};

// compute perfect numbers via the mersennes
sequences.perfect.numbers = sequences.mersennePrime.numbers.map(
  (x) => x * ((x + 1) / 2),
);
// the last mersenne produces a perfect number larger than default integer size
sequences.perfect.numbers.pop();

interface AnnotatedNumber {
  value: number;
  description: string;
  index: number;
}

export function getNextBase10(n: number): AnnotatedNumber {
  // numbers that end in 0s in base 10
  // eg. 5, 8, 20, 400, 7000, etc.
  if (n < 0) {
    return {
      value: 0,
      description: "base 10",
      index: 0,
    };
  }
  const digits = Math.floor(Math.log(n) / Math.log(10));
  if (digits < 1) {
    return {
      value: n,
      description: "base 10",
      index: n,
    };
  }
  const firstDigit = Math.ceil(n / 10 ** digits);
  return {
    value: firstDigit * 10 ** digits,
    description: "base 10",
    index: -1 + firstDigit + 10 * digits,
  };
}

export function getNextRepDigit(n: number): AnnotatedNumber {
  // numbers with repeated digits in base 10
  // eg. 2, 6, 33, 777, 11111, etc.
  if (n < 1) {
    return {
      value: 0,
      description: "repeated digit",
      index: 0,
    };
  }
  const initialDigit = parseInt(n.toString().slice(0, 1));
  const numLength = Math.floor(Math.log(n) / Math.log(10)) + 1;
  const repDigit = parseInt(new Array(numLength).fill(initialDigit).join(""));
  if (repDigit >= n) {
    return {
      value: repDigit,
      description: "repeated digit",
      index: initialDigit + 9 * (numLength - 1),
    };
  } else {
    return {
      value: parseInt(new Array(numLength).fill(initialDigit + 1).join("")),
      description: "repeated digit",
      index: 1 + initialDigit + 9 * (numLength - 1),
    };
  }
}

export function getNextXToPower(n: number, base: number): AnnotatedNumber {
  // finds `k` for base ** k >= n
  const index = Math.ceil(Number((Math.log(n) / Math.log(base)).toFixed(5)));
  return {
    value: base ** index,
    description: `${base}^${index}`,
    index: index,
  };
}

export function getNextSquareToDimension(
  n: number,
  dimension: number,
): AnnotatedNumber {
  // finds `k` for k ** dimension >= n
  const index = Math.ceil(n ** (1 / dimension));
  return {
    value: index ** dimension,
    description: `${index}^${dimension}`,
    index: index,
  };
}

export function getNextFibonacci(n: number): AnnotatedNumber {
  // fibonacci numbers, f(1) = 1, f(2) = 2
  // 1, 2, 3, 5, 8, 13, ...
  if (n === 0) {
    return { value: 0, description: "Fibonacci number, f(0)", index: 0 };
  }
  const phi = (1 + 5 ** (1 / 2)) / 2;
  let base = 1 + Math.floor(Math.log(n) / Math.log(phi));
  function binet(n: number) {
    return Math.round((phi ** n - (1 - phi) ** n) / 5 ** (1 / 2));
  }

  // why be a good mathematician anyway?
  for (let i = 0; i < 10; i++) {
    if (binet(base) >= n) {
      return {
        value: binet(base),
        description: `Fibonacci number, f(${base - 1})`,
        index: base - 1,
      };
    }
    base += 1;
  }
  // should never happen >:(
  return { value: 0, description: "Fibonacci number, f(0)", index: 0 };
}

export function getNextLucas(n: number): AnnotatedNumber {
  // lucas numbers, L(1) = 2, L(2) = 1, L(3) = 3
  // 2, 1, 3, 4, 7, 11, 18, etc.

  // ONLY WORKS FOR N > 3
  if (n <= 3) {
    return { value: -1, description: "Lucas Number, L(-1)", index: -1 };
  }

  const phi = (1 + 5 ** (1 / 2)) / 2;
  let base = Math.round(Math.log(n) / Math.log(phi));
  function luca(n: number) {
    return Math.round(phi ** n - (1 - phi) ** n);
  }

  // why be a good mathematician anyway?
  for (let i = 0; i < 10; i++) {
    if (luca(base) >= n) {
      return {
        value: luca(base),
        description: `Lucas Number, L(${base})`,
        index: base,
      };
    }
    base += 1;
  }
  // should never happen
  return { value: 0, description: "Lucas Number, L(0)", index: 0 };
}

export function getNextTriangle(n: number): AnnotatedNumber {
  const base = Math.ceil((-1 + (1 + 8 * n) ** (1 / 2)) / 2);
  return {
    value: (base ** 2 + base) / 2,
    description: `triangular number, T(${base})`,
    index: base,
  };
}

export function getNextSquareTriangle(n: number): AnnotatedNumber {
  // (1 + 2 + 3 + ... + n) ** 2 = 1**3 + 2**3 + 3**3 + ... + n**3
  // F(1) = 1, F(2) = 9
  // 1, 9, 36, 100, 225, 441, etc.

  const root = Math.ceil(n ** 0.5);
  const triangle = getNextTriangle(root);
  const index = triangle.index;
  const value = triangle.value ** 2;

  return {
    value: value,
    description: `square of triangle number, T(${index})^2`,
    index: index,
  };
}

/*export function getNextTetration(n: number): AnnotatedNumber {
  // should make the sequence 2, 4, 16, 65_536, etc
}*/
