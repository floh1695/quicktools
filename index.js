'use strict';

//* e -> e
const identity = e =>
  e;

//* (b -> c) -> (a -> b) -> (a -> c)
const compose = f => g =>
  x =>
    f(g(x))

//* (a -> b -> c) -> (b -> a -> c)
const flip = f =>
  x => y =>
    f (y) (x);

//* (a -> b -> b) -> b -> [a] -> [b]
const foldr = f => identity => xs => {
  if (xs === []) {
    return identity;
  }

  let accumulator = identity;
  
  const ys = xs.reverse();
  for (let i = 0; i < ys.length; i++) {
    accumulator = f (ys[i]) (accumulator)
  }

  return accumulator;
};

//* (a -> b) -> [a] -> [b]
const map = f =>
  foldr (a => bs => [f(a)].concat(bs)) ([]);

//* (a -> Boolean) -> [a] -> [a]
const filter = p =>
  foldr (a => as => p (a) ? [a].concat(as) : as) ([]);

//* Number -> Number
const negative = x =>
  -x;

//* Number -> Number -> Number
const add = x => y =>
  x + y;

//* [Number] -> Number
const sum =
  foldr (add) (0);

//* Number -> Number -> Number
const subtract = x => y =>
  add (x) (negative (y));

//* Number -> Number -> Number
const multiply = x => y =>
  x * y;

//* Number -> Number -> Number
const divide = x => y =>
  x / y;

const assign = objects =>
  Object.assign({}, ...objects);



//* @t t => @t -> (t -> t -> t) -> SemiGroup t
const SemiGroup = category => operation =>
  ({
    category,
    operation,
  });

//* @t t => @t -> (t -> t -> t) -> t -> Monoid t
const Monoid = category => operation => identity =>
  ({
    category,
    operation,
    identity,
  });

//* SemiGroup t -> Monoid t
const SemiGroupToMonoid = semiGroup => {
  const identity = compose 
        (foldr (n => a => n + a) ('')) 
        (map (String))
      ([semiGroup.category, semiGroup.operation])

  return {
    category: compose (SemiGroupToMonoid) (SemiGroup),
    operation: l => r =>
      l === identity
        ? r
        : r === identity
        ? l
        : semiGroup.operation (l) (r),
    identity,
  };
};



const quickTools = {
  version: {
    major: 0,
    minor: 1,
  },
  testing: {
    interfaceA: {
      identity,
      compose,
      flip,
      foldr,
      map,
      filter,
      math: {
        negative,
        add,
        sum,
        tally: sum,
        subtract,
        multiply,
        divide,
      },
      negative,
      add,
      sum,
      subtract,
      multiply,
      divide,
    },
    interfaceB: {
      id: identity,
      cm: compose,
      fi: flip,
      fr: foldr,
      mp: map,
      ft: filter,
      m: {
        n: negative,
        a: add,
        t: sum,
        s: subtract,
        m: multiply,
        d: divide,
      },
      n: negative,
      ad: add,
      sm: sum,
      sb: subtract,
      ml: multiply,
      dv: divide,
      o: {
        s: SemiGroup,
        m: Monoid,
        stm: SemiGroupToMonoid,
      },
      sg: SemiGroup,
      md: Monoid,
    }
  },
};

module.exports = quickTools;
