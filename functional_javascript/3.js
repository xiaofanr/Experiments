aGlobalVariable = 'livin la vida global';

console.log(_.map(_.range(2), function() { return aGlobalVariable}));

function makeEmptyObject() {
  return new Object();
}

aVariable = 'Outer';

function afun() {
  var avariable = 'Middle';

  return _.map([1, 2,3], function(e) {
    var aVariable = 'In';

    return [avariable, e].join(' ');
  });
}


// Dynamic Scope
var globals = {};

function makeBindFun(resolver) {
  return function(k, v) {
    var stack = globals[k] || [];
    globals[k] = resolver(stack, v);
    return globals;
  };
}

var stackBinder = makeBindFun(function(stack, v) {
  stack.push(v);
  return stack;
});
var stackUnbinder = makeBindFun(function(stack) {
  stack.pop();
  return stack;
});
var dynamicLookup = function(k) {
  var slot = globals[k] || [];
  return _.last(slot);
}

stackBinder('a', 1);
stackBinder('b', 100);

console.log(dynamicLookup('a'));

stackBinder('a', '*');

console.log(dynamicLookup('a'));

console.table(globals);

stackUnbinder('a');

console.log(dynamicLookup('a'));

var target = {name: 'the right value',
              aux: function() { return this.name; },
              act: function() { return this.aux(); }};

// console.log(target.act.call('wat'));

_.bindAll(target, 'aux', 'act');

console.log(target.act.call('wat'));

// 3.4 Function Scope
function strangerIdentity(n) {
  // intensionally stranger still
  for (this['i'] = 0; this['i'] < n; this['i']++);
  return this['i'];
}
console.log(strangerIdentity(108));
console.log(i);
console.log(strangerIdentity.call({}, 10000));
console.log(i);

function f() {
  this['a'] = 200;
  return this['a'] + this['b'];
}

var globals = {'b': 2};

console.log(f.call(_.clone(globals)));
console.log(globals);


// Simulating Closures

function createScaleFunction(FACTOR) {
  return function(v) {
    return _.map(v, function(n) {
      return (n * FACTOR);
    });
  };
}



var scale10 = createScaleFunction(10);
console.log(scale10([2, 3, 4]));

function createWeirdScaleFunction(FACTOR) {
  return function(v) {
    this['FACTOR'] = FACTOR; // this refer to ...
    var captures = this;

    return _.map(v, _.bind(function(n) {
      return (n * this['FACTOR']);
    }, captures));
  };
}

// _.bind(function(n) { return (n * this['FACTOR']) }, captures);

var scale10 = createWeirdScaleFunction(10);
console.log(scale10.call({}, [5, 6, 7])); // this in function(v) refers to {}

// free variables
function makeAdder(CAPTURED) {
  return function(free) {
    return free + CAPTURED;
  };
}

var add10 = makeAdder(10);
console.log(add10(32));

function averageDamp(FUN) {
  return function(n) {
    return average([n, FUN(N)]);
  };
}

// var averageSq = averageDamp(function(n) { return n * n});
// console.log(averageSq(10));

// shadowing
var name = 'Fogus';
var name = 'Renamed';

var shadowed = 0;

function varShadow(shadowed) {
  var shadowed = 4320000;
  return ['Value is', shadowed].join(' ');
}

console.log(varShadow(108));

function captureShadow(SHADOWED) {
  return function(SHADOWED) {
    return SHADOWED + 1;
  };
}

var closureShadow = captureShadow(108);
console.log(closureShadow());
console.log(closureShadow(2));

// Using closures
function complement(PRED) {
  return function() {
    return !PRED.apply(null, _.toArray(arguments));
  }
}

function isEven(n) { return (n % 2) === 0 }

var isOdd = complement(isEven);

console.log(isOdd(2), isOdd(413));

// function isEven(n) { return false }

console.log(isOdd(13), isOdd(12));

function showObject(OBJ) {
  return function() {
    return OBJ;
  };
}

var o = {a: 42};
var showO = showObject(o);

console.log(showO());

o.newField = 108;
console.log(showO());

var pingpong = (function() {
  var PRIVATE = 0;

  return {
    inc: function(n) {
      return PRIVATE += n;
    },
    dec: function(n) {
      return PRIVATE -= n;
    }
  };
})();

console.log(pingpong.inc(10));

console.log(pingpong.dec(7));

pingpong.div = function(n) { return PRIVATE / n };

// console.log(pingpong.div(3));

function plucker(FIELD) {
  return function(obj) {
    return (obj && obj[FIELD]);
  };
}

var best = {title: 'Infinite Jest', author: 'DFW'};

var getTitle = plucker('title');

console.log(getTitle(best));

var books = [{title: 'Chthon'}, {stars: 5}, {title: 'Botchan'}];

var third = plucker(2);

console.log(third(books));

// function can be passed to other functions
// function can be returned from functions

_.max([1, 2, 3, 4]);

var people = [{name: 'Fred', age: 65}, {name: 'Lucy', age: 36}];

_.max(people, function(p) { return p.age });

function finder(valueFun, bestFun, coll) {
  return _.reduce(coll, function(best, current) {
    var bestValue = valueFun(best);
    var currentValue = valueFun(current);

    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
}

// valuefun: _.identity
// bestFun: _.Math.max
//

console.log(finder(_.identity, Math.max, [1,2,3,4,5]));
// in the realm of functional programming one needs to think in terms of
// functions, even when the best value is a value itself.

console.log(finder(plucker('age'), Math.max, people));

console.log(finder(plucker('name'),
                   function(x, y) { return (x.charAt(0) === 'L') ? x : y},
                   people));

// the implementation of finder can be tightened by making two assumption
// - that the best-value function returns true if the first arguments is
//   'better' than the second argument
// - that the best-value function knows how to 'unwrap' its arguments

function bestFun(fun, coll) {
  return _.reduce(coll, function(x, y) {
    return fun(x, y) ? x : y;
  });
}

// tighter and more elegant
console.log(bestFun(function(x, y) { return x > y }, [1,2,3,4,5]));
// type error best is not function.
// there is a best variable above,

function repeat(times, VALUE) {
  return _.map(_.range(times), function() {
    return VALUE;
  });
}

repeat(4, 'Major');

function repeatedly(tiems, fun) {
  return _.map(_.range(tiems), fun);
}

console.log(repeatedly(3, function() {
  return Math.floor((Math.random()*10) + 1);
}));

repeatedly(3, function() { return 'Odelay'; });

// repeatedly(3, function(n) {
//   var id = 'id' + n;
//   $('body').append($('<p>Odelay!</p>').attr('id', id));
//   return id;
// })

function iterateUntil(fun, check, init) {
  var ret = [];
  var result = fun(init);

  while (check(result)) {
    ret.push(result);
    result = fun(result);
  }

  return ret;
}

console.log(iterateUntil(function(n) { return n + n },
             function(n) { return n <= 1024},
             1));

function always(VALUE) {
  return function() {
    return VALUE;
  };
}

var f = always(function() {});

console.log(f() === f());

var g = always(function() {});

console.log(f() === g());

console.log(repeatedly(3, always('Odelay')));

function invoker(NAME, METHOD) {
  return function(target /* args ...*/) {
    if (!existy(target)) fail('Must provide a target');

    var targetMethod = target[NAME];
    var args = _.rest(arguments);

    return doWhen((existy(targetMethod) && METHOD === targetMethod), function() {
      return targetMethod.apply(target, args);
    })
  }
}

function invoker(NAME, METHOD) {
  return function(target /* args ...*/) {
    if (!existy(target)) fail('Must provide a target');

    var targetMethod = target[NAME];
    var args = _.rest(arguments);

    return doWhen((existy(targetMethod) && METHOD === targetMethod), function() {
      return targetMethod.apply(target, args);
    })
  }
}

var rev = invoker('reverse', Array.prototype.reverse);
// console.log(_.map([[1,2,3]], rev));

function uniqueString(len) {
  return Math.random().toString(36).substr(2, len);
}

console.log(uniqueString(10));

function uniqueString(prefix) {
  return [prefix, new Date().getTime()].join('');
}

function makeUniqueStringFunction(start) {
  var COUNTER = start;

  return function(prefix) {
    return [prefix, COUNTER++].join('');
  }
}

var uniqueString = makeUniqueStringFunction(0);

console.log(uniqueString('dari'));
console.log(uniqueString('dari'));

var generator = {
  count: 0,
  uniqueString: function(prefix) {
    return [prefix, this.count++].join('');
  }
};

generator.uniqueString('bohr');
console.log(generator.uniqueString('bohr'));

// reassign the count
generator.count = 'gotcha';
console.log(generator.uniqueString('bohr'));

console.log(generator.uniqueString.call({count: 1337}, 'bohr'));

var omegenerator = (function(init) {
  var COUNTER = init;

  return {
    uniqueString: function(prefix) {
      return [prefix, COUNTER++].join('');
    }
  }
})(0);

console.log(omegenerator.uniqueString('lichking-'));

var nums = [1,2,3,null,5];

console.log(_.reduce(nums, function(total, n) { return total * n}));

function fnull(fun /*, defaults */) {
  var defaults = _.rest(arguments);
  // console.log("defaults" + defaults);

  return function(/*args*/) {
    var args = _.map(arguments, function(e, i) {
      return existy(e) ? e : defaults[i];
    });
    // console.log(arguments);
    // console.log(args);

    return fun.apply(null, args);
  };
}

var safeMult = fnull(function(total, n) { return total * n }, 1, 1);

console.log(_.reduce(nums, safeMult));

function defaults(d) {
  return function(o, k) {
    var val = fnull(_.identity, d[k]);
    return val(o[k]);
    // return o && val(o[k]);
  };
}

function doSomething(config) {
  var lookup = defaults({critical: 108});

  return lookup(config, 'critical');
}

console.log(doSomething({critical: 9}), doSomething({}));

function checker(/* validator */) {
  var validators = _.toArray(arguments);

  return function(obj) {
    return _.reduce(validators, function(errs, check) {
      if (check(obj))
        return errs
      else
        return _.chain(errs).push(check.message).value();
    }, []);
  };
}

function validator(message, fun) {
  var f = function(/* args */) {
    return fun.apply(fun, arguments);
  };

  f['message'] = message;
  return f;
}

// the essence of function composition

function dispatch(/* funs */) {
  var funs = _.toArray(arguments);
  var size = funs.length;

  return function(target) {
    var ret;
    // var ret = undifined;
    var args = _.rest(arguments);
    // console.log(args);

    for (var funIndex = 0; funIndex < size; funIndex++) {
      var fun = funs[funIndex];
      ret = fun.apply(fun, construct(target, args));

      if (existy(ret)) return ret;
    }
    // construct(target, args) => [target, args]

    return ret;
  };
}

// _.map = _.collect = function(obj, iterator, context) {
//   var results = [];
//   if (obj == null) return results;
//   if (nativeMap && obj.map == nativeMap) return obj.map(iterator, context);
//   each(obj, function(value, index, list) {
//     results[results.length] = iterator.call(context, value, index, list);
//   });
//   return results;
// }

var str = dispatch(invoker('toString', Array.prototype.toString),
                   invoker('toString', String.prototype.toString));

console.log(str('a'), str(_.range(10)));

function stringReverse(s) {
  if (!_.isString(s)) return;
  return s.split('').reverse().join('');
}

console.log(stringReverse('abc'), stringReverse(1));

var rev = dispatch(invoker('reverse', Array.prototype.reverse), stringReverse);

console.log(rev([1, 2, 3]), rev('abc'));

var sillyRevserse = dispatch(rev, always(42));

console.log(sillyRevserse([1,2,3]), sillyRevserse('abc'), sillyRevserse(1000));

function isa(type, action) {
  return function(obj) {
    if (type === obj.type)
      return action(obj);
  }
}

// var performCommand = dispatch(
//   isa('notify', function(obj) { return notify(obj.message) }),
//   isa('join', function(obj) { return changeView(obj.target) }),
//   function(obj) { alter(obj.type) };
// );

// var performAdminCommand = dispatch(
//   isa('kill', function(obj) { return shutDown(obj.hostname) }),
//   performCommand
// );

// currying
function rightAwayInvoker() {
  var args = _.toArray(arguments);
  var method = args.shift();
  var target = args.shift();

  console.log(args);

  return method.apply(target, args);
}

console.log(rightAwayInvoker(Array.prototype.reverse, [1, 2, 4]));

function leftCurryDiv(n) {
  return function(d) {
    return n/d;
  }
}

function rightCurryDiv(d) {
  return function(n) {
    return n/d;
  }
}

var divide10By = leftCurryDiv(10);

console.log(divide10By(2), divide10By(5));

function curry(fun) {
  return function(arg) {
    return fun(arg);
  };
}

['11', '11', '11', '11'].map(parseInt);
console.log(['11', '11', '11', '11'].map(curry(parseInt)));

function curry2(fun) {
  return function(secondArg) {
    return function(firstArg) {
      return fun(firstArg, secondArg);
    };
  };
}

function div(n, d) { return n / d }

var div10 = curry2(div)(10);

console.log(div10(50));

var parseBinaryString = curry2(parseInt)(2);

console.log(parseBinaryString('111'), parseBinaryString('10'));

var plays = [{artist: "Burial", track: "Archangel"},
             {artist: "Ben Frost", track: "Stomp"},
             {artist: "Ben Frost", track: "Stomp"},
             {artist: "Burial", track: "Archangel"},
             {artist: "Emeralds", track: "Snores"},
             {artist: "Burial", track: "Archangel"}];

_.countBy(plays, function(song) {
  return [song.artist, song.track].join(' - ');
});

function songToString(song) {
  return [song.artist, song.track].join(' - ');
}

var songCount = curry2(_.countBy)(songToString);

songCount(plays);

function curry3(fun) {
  return function(last) {
    return function(middle) {
      return function(first) {
        return fun(first, middle, last);
      };
    };
  };
}

var songsPlayed = curry3(_.uniq)(songToString)(false);

console.log(songsPlayed(plays));

function toHex(n) {
  var hex = n.toString(16);
  return (hex.length < 2) ? [0, hex].join('') : hex;
}

function rgbToHexString(r, g, b) {
  return ['#', toHex(r), toHex(g), toHex(b)].join('');
}

console.log(rgbToHexString(255, 255, 255));

var blueGreenish = curry3(rgbToHexString)(255)(200);

console.log(blueGreenish(0));

var greaterThan = curry2(function(lhs, rhs) { return lhs > rhs });
var lessThan    = curry2(function(lhs, rhs) { return lhs < rhs });

var withinRange = checker(
  validator('arg must be greater than 10', greaterThan(10)),
  validator('arg must be less than 20', lessThan(20))
);

console.log(withinRange(15), withinRange(1), withinRange(50));

function partial1(fun, arg1) {
  return function(/* args */) {
    var args = construct(arg1, arguments);
    return fun.apply(fun, args);
  };
}

var over10Part1 = partial1(div, 10);

console.log(over10Part1(5));

function partial2(fun, arg1, arg2) {
  return function(/* args */) {
    var args = cat([arg1, arg2], arguments);
    return fun.apply(fun, args);
  };
}

var div10By2 = partial2(div, 10, 2);

console.log(div10By2());

function partial(fun /*, pargs */) {
  var pargs = _.rest(arguments);

  return function(/*arguments*/) {
    var args = cat(pargs, _.toArray(arguments));
    return fun.apply(fun, args);
  };
}

var over10Partial = partial(div, 10);
console.log(over10Partial(2));

var div10By2By4By5000Partial = partial(div, 10, 2, 4, 5000);
console.log(div10By2By4By5000Partial());

var zero = validator('cannot be zero', function(n) { return 0 === n });
var number = validator('arg must be a number', _.isNumber);

function sqr(n) {
  if (!number(n)) throw new Error(number.message);
  if (zero(n))    throw new Error(zero.message);

  return n * n;
}

console.log(sqr(10));
// sqr(0);
// sqr('');

function condition1(/* validators */) {
  var validators = _.toArray(arguments);

  return function(fun, arg) {
    var errors = mapcat(function(isValid) {
      return isValid(arg) ? [] : [isValid.message];
    }, validators);

    if (!_.isEmpty(errors))
      throw new Error(errors.join(', '));

    return fun(arg);
  }
}

var sqrPre = condition1(
  validator('arg must not be zero', complement(zero)),
  validator('arg must be a number', _.isNumber)
);

console.log(sqrPre(_.identity, 10));

// sqrPre(_.identity, '');

function uncheckedSqr(n) { return n * n };

var checkedSqr = partial1(sqrPre, uncheckedSqr);

console.log(checkedSqr(10));

// checkedSqr('');

var sillySquare = partial1(
  condition1(validator('should be even', isEven)),
  // checkedSqr
  uncheckedSqr
);

console.log(sillySquare(8));

// sillySquare(11);

// Stitching Functions End-to-End with Compose

var isntString = _.compose(function(x) { return !x }, _.isString);

function not(x) { return !x }

var isntString = _.compose(not, _.isString);

var composedMapcat = _.compose(splat(cat), _.map);

console.log(composedMapcat([[1,2],[3,4],[5]], _.identity));

var sqrPost = condition1(
  validator('result should be a number', _.isNumber),
  validator('result should not be a zero', complement(zero)),
  validator('result should be positive', greaterThan(0))
);

var megaCheckedSqr = _.compose(partial(sqrPost, _.identity), checkedSqr);

// Chapter 6
// Recursion
function myLength(ary) {
  if (_.isEmpty(ary))
    return 0;
  else
    return 1 + myLength(_.rest(ary));
}

console.log(myLength(_.range(10)));

function cycle(times, ary) {
  if (times <= 0)
    return [];
  else
    return cat(ary, cycle(times - 1, ary));
}

function constructPair(pair, rests) {
  return [construct(_.first(pair), _.first(rests)),
          construct(second(pair),  second(rests))];
}

console.log(constructPair(['a', 1], [[], []]));
// [['a'], [1]]
// console.log(_.zip(['a'], [1]));

console.log(_.zip.apply(null, constructPair(['a', 1], [[], []])));// [['a', 1]]
console.log(_.zip(constructPair(['a', 1], [[], []])));// [[['a']], [[1]]];

function unzip(pairs) {
  if (_.isEmpty(pairs)) return [[], []];

  return constructPair(_.first(pairs), unzip(_.rest(pairs)));
}

console.log(unzip(_.zip([1,2,3],[4,5,6])));

// Graph Walking with Recursion
var influences = [
  ['Lisp', 'Smalltalk'],
  ['Lisp', 'Scheme'],
  ['Smalltalk', 'Self'],
  ['Scheme', 'JavaScript'],
  ['Scheme', 'Lua'],
  ['Self', 'Lua'],
  ['Self', 'JavaScript']
];

function nexts(graph, node) {
  if (_.isEmpty(graph)) return [];

  var pair = _.first(graph);
  var from = _.first(pair);
  var to = second(pair);
  var more = _.rest(graph);

  if (_.isEqual(node, from))
    return construct(to, nexts(more, node));
  else
    return nexts(more, node);
}

function getNode(graph, nodes) {
  var ary = [];
  for (var i = 0; i < nodes.length; i++) {
    var graph = graph;
    ary.push(nexts(graph, nodes[i]));
  }
  return ary;

  // catmap(nexts(graph, ))
}

console.log(nexts(influences, 'Lisp'));

console.log(getNode(influences, ['Lisp', 'Self']));

function depthSearch(graph, nodes, seen) {
  if (_.isEmpty(nodes)) return rev(seen);

  var node = _.first(nodes);
  var more = _.rest(nodes);

  if (_.contains(seen, node))
    return depthSearch(graph, more, seen);
  else
    depthSearch(graph,
                cat(nexts(graph, node), more),
                construct(node, seen));
}

// Tail(self-)recursion: the last action that happens in the function(besides
// returning a termination element) is a recursive call.

function tcLength(ary, n) {
  var l = n ? n : 0;

  if (_.isEmpty(ary))
    return l;
  else
    return tcLength(_.rest(ary), l + i);
}

tcLength(_.range(10));
// the recursive call in myLength revisits the function body to perform that
// final addition.
// function myLength(ary) {
//   if (_.isEmpty(ary))
//     return 0;
//   else
//     return 1 + myLength(_.rest(ary));
// }


// return A && B: if A is false, end;
// return A || B: if A is true, end.
function andify(/* preds */) {
  var preds = _.toArray(arguments);

  return function(/* args */) {
    var args = _.toArray(arguments);

    var everything = function(ps, truth) {
      if (_.isEmpty(ps))
        return truth;
      else
        return _.every(args, _.first(ps))
               && everything(_.rest(ps), truth);
        // Because the logical and operator, &&, is "lazy", the recursive call will
        // never happen should the _.every test fail.
        // This type of laziness is called "short-circuiting", which is useful for
        // avoiding unnecessary computation.

        // Using a nested function is a common way to hide accumulator in recursive
        // calls.
    };

    return everything(preds, true);
  };
}

var evenNums = andify(_.isNumber, isEven);

console.log(evenNums(1, 2));
console.log(evenNums(2, 6, 4));

function orify(/* preds */) {
  var preds = _.toArray(arguments);

  return function(/* args */) {
    var args = _.toArray(arguments);

    var something = function(ps, truth) {
      if (_.isEmpty(ps))
        return truth;// return false;
      else
        return _.some(args, _.first(ps))
               || something(_.rest(ps), truth);
    };//

    return something(preds, false);
  };
}

var zeroOrOdd = orify(isOdd, zero);
// preds: isOdd, zero.

console.log(zeroOrOdd(), zeroOrOdd(0, 2, 4));

// Codependent Functions (Functions Calling Other Function That Call Back)

function evenSteven(n) {
  if (n === 0)
    return true;
  else
    return oddJohn(Math.abs(n) - 1);
}

function oddJohn(n) {
  if (n === 0)
    return false;
  else
    return evenSteven(Math.abs(n) - 1);
}

function flat(array) {
  if (_.isArray(array))
    return cat.apply(cat, _.map(array, flat));
  else
    return [array];
}

console.log(flat([[1,2],[3,4]]));

var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];

var y = _.clone(x);

y;

x[1]['c','d'] = 1000000;

y;// [{a: [1, 2 3], b: 42}, {c: {d: [1000000}}];

function deepClone(obj) {
  if (!existy(obj) || !_.isObject(obj))
    return obj;

  var temp = new obj.constructor(); // TODO
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      temp[key] = deepClone(obj[key]);
  }

  return temp;
}

var z = deepClone(x);

_.isEqual(x, z);

z[1]['c']['d'] = 42;

_.isEqual(x, z);

// Walking Nested Arrays
function visit(mapFun, resultFun, array) {
  if (_.isArray(array))
    return resultFun(_.map(array, mapFun));
  else
    return resultFun(array);
}

console.log(visit(function(n) { return n*2 }, rev, _.range(10)));

// Using the same principle behind flat, we can use visit to implement a mutually
// recursive version of depthSearch called postDepth.
function postDepth(fun, ary) { // DOTO
  return visit(partial1(postDepth, fun), fun, ary);
}
var inFluences = postDepth(_.identity, influences);
// => visit(partial1(postDepth, _.identity), _.identity, influences);
// => _.identity(_.map(influences, partial1(postDepth, _.identity)));
// partial1(postDepth, _.identity) => ?
// return function(/* args */) {
//   var args = construct(_.identity, arguments);
//   return postDepth.apply(postDepth, args);
// };

// Passing the _.identity function to the *Depth functions returns a copy of the
// influences array.

postDepth(function(x) {
  if (x === 'Lisp')
    return 'LISP';
  else
    return x;
}, influences);

// evenSteven(100000);
// Because most JavaScript implementions have a limit on the number of recursive
// calls, functions like these can "blow the stack" fairly easily.

function evenOline(n) {
  if (n === 0)
    return true;
  else
    return partial1(oddOline, Math.abs(n) - 1);
}

function oddOline(n) {
  if (n === 0)
    return false;
  else
    return partial1(evenOline, Math.abs(n) - 1);
}

evenOline(3);
// => return partial1(oddOline, 2)
// => function() { return oddOline(Math.abs(n) - 1)};

function trampoline(fun /* args */) {
  var result = fun.apply(fun, _.rest(arguments));

  while (_.isFunction(result)) {
    result = result();
  }

  return result;
}// All that trampoline does is repeatedly call the return value of the function
// until it's no longer a function.
trampoline(evenOline, 200000);

function isEvenSafe(n) {
  if (n === 0)
    return true;
  else
    return trampoline(partial1(oddOline, Math.abs(n) - 1));
}

function isOddSafe(n) {
  if (n === 0)
    return false;
  else
    return trampoline(partial1(evenOline, Math.abs(n) - 1));
}

// _.take(cycle(20, [1, 2, 3]), 11);
// the array created by cycle is definitely not lazy, because it is fully constructed
// before being passed to _.take.

function generator1(seed, current, step) {
  return {
    head: current(seed),
    tail: function() {
      console.log('forced');
      return generator1(step(seed), current, step);
    }
  };
}

function genHead(gen) { return gen.head }
function genTail(gen) { return gen.tail() }

var ints = generator1(0, _.identity, function(n) { return n + 1 });

genHead(ints);
genTail(ints);

function genTake(n, gen) {
  var doTake = function(x, g, ret) {
    if (x === 0)
      return ret;
    else
      return partial(doTake, x - 1, genTail(g), cat(ret, genHead(g)));
  };

  return trampoline(doTake, n, gen, []);
}

genTake(100, ints);

// The Trampoline Principle and Callbacks

var groupFrom = curry2(_.groupBy)(_.first);
var groupTo = curry2(_.groupBy)(second);

function influenced(graph, node) {
  return _.map(groupFrom(graph)[node], second);
}

influenced(influences, 'Lisp');
// => _.map(groupFrom(influences)['Lisp'], second);

// # Purity, Immutablity, and Policies for Change

// A pure function adheres to the following properties:
// - Its result is calculated only from the values of its arguments.
// - It cannot rely on data that changes external to its control.
// - It cannot change the state of something external to its body.

var rand = partial1(_.random, 1);
// partial1(rand, 3)
// => partial1(partial1(_.random, 1), 3)
// => (partial1(_.random, 1)).apply(partial1(_.random, 1), [3])
// => partial1(_.random, 1) => _.random.apply(_.random, [1]);

function generateRandomCharacter() {
  return rand(26).toString(36);
}

function generateString(charGen, len) {
  return repeatedly(len, charGen).join('');
}

generateString(generateRandomCharacter, 20);

var composeRandomString = partial1(generateString, generateRandomCharacter);

composeRandomString(10);

// describe('generateString', function() {
//   var result = generateString(always('a'), 10);
//
//   it('should return a string of a specific length', function() {
//     expect(result.constructor).toBe(String);
//     expect(result.length).toBe(10);
//     // 'constructor' does not actually mean 'was constructed by', as it appears.
//     // the .contructor property on Foo.prototype is only there by default on the
//     // object created when Foo the function is declared.
//
//     // Object.defineProperty(Foo.prototype, 'constructor', {
//     //   enumerable: false,
//     //   writable: true,
//     //   configurable: true,
//     //   value: Foo // point '.constructor' at 'Foo'
//   });
//   it('should return a string congruent with its char generator', function() {
//     expect(result).toEqual('aaaaaaaaaa');
//   });
// });

function skipTake(n, coll) {
  var ret = [];
  var sz = _.size(coll);

  for (var index = 0; index < sz; index += n) {
    ret.push(coll[index]);
  }

  return ret;
}
// there are ways to implement skipTake using functional techniques, therefore
// requiring no explicit mutation.
// Whether I used _.foldRight or while within skipTake is irrelevant to the users
// of the function.
// The only way to modify the value of a local is to change it via the call stack,
// and this is exactly what recursion does.
function summ(array) {
  var result = 0;
  var sz = array.length;

  for (var i = 0; i < sz; i++) {
    result += array[i];
  }

  return result;
}
// the function summ mutates two local variables: i and result.
// In traditional function languages, local variables are not actually variables
// at all,but are instead immutable and cannot change.

function summRec(array, seed) {
  if (_.isEmpty(array))
    return seed;
  else
    return summRec(_.rest(array), _.first(array) + seed);
}
// ## Defensive Freezing and Cloning
// Object#freeze
// a freeze will only happen at the topmost level and will not traverse nested objects.
function deepFreeze(obj) {
  if (!Object.isFrozen(obj))
    Object.freeze(obj);

  for (var key in obj) {
    if (!obj.hasOwnProperty(key) || !_.isObject(obj[key]))
      continue;

    deepFreeze(obj[key]);
  }
}
// freezing arbitrary objects might introduce subtle bugs when interacting with
// third-party APIs.
// - Use _.clone if you know that a shallow copy is appropriate
// - Use deepClone to make copies of structures
// - Build your code on pure functions

// ## Observing Immutablility at the Function Level
// take some collection and build another collection from it
var freq = curry2(_.countBy)(_.identity);

var a = repeatedly(1000, partial1(rand, 3));
var copy = _.clone(a);

freq(a);

freq(skipTake(2, a));
_.isEqual(a, copy);

var person = {fname: 'Simon'};

_.extend(person, {lname: 'Petrikov'}, {age: 28}, {age: 108});
person;
//=> {age: 108, fname: 'Simon', lname: 'Petrikov'}

// the beauty of functional programming is that with a little bit of tweaking you
// can create new abstractions.
function merge( /*args*/ ) {
  return _.extend.apply(null, construct({}, arguments));
}

merge(person, {lname: 'Petrikov'}, {age: 28}, {age: 108});
// From the caller's perspective, nothing was ever changed.

function Point(x, y) {
  this._x = x;
  this._y = y;
}

Point.prototype = {
  withX: function(val) {
    return new Point(val, this._y);
  },
  withY: function(val) {
    return new Point(this._x, val);
  }
};

var p = new Point(0, 1);

p.withX(1000);
//=> {_x: 1000, _y: 1}

p;
//=> {_x: 0, _y: 1}

(new Point(0, 1))
  .withX(100)
  .withY(-100);
//=> {_x: 100, _y: -100}
// - Immutable objects should get their values at construction time and never
//   again change.
// - Operations on immutable objects return fresh objects.

function Queue(elems) {
  this._q = elems;
}

Queue.prototype = {
  enqueue: function(thing) {
    return new Queue(this._q + thing);
  }
};

var seed = [1, 2, 3];

var q = new Queue(seed);

q;//=> {_q: [1, 2, 3]}

var q2 = q.enqueue(111);//=> {_q: [1, 2, 3, 111]}

// However, all is not sunny in Philadelphia
seed.push(10000);

q;//=> {_q: [1, 2, 3, 10000]}

var SaferQueue = function(elems) {
  this._q = _.clone(elems);
}

SaferQueue.prototype = {
  enqueue: function(thing) {
    return new SaferQueue(cat(this._q, [thing]));
  }
};

var seed = [1, 2, 3];
var q = new SaferQueue(seed);// actually, q instance has a public field _q which
// could be easily modify directly.

var q2 = q.enqueue(36);//=> {_q: [1, 2, 3, 36]}

// # Objects Are Often a Low-Level Operation
function queue() {
  return new SaferQueue(_.toArray(arguments));
}

var enqueue = invoker('enqueue', SaferQueue.prototype.enqueue);

enqueue(q, 42);
// - do not need to worry as much about the actual types.
// - can return types appropriate for certain use cases.
// - if the type or methods change, then need only to change the functions and
//   not every point of use.
// - can add pre- and postconditions on the functions if choose.
// - the functions are composable.

// ## Policies for Contralling Change
// var container = contain({name: 'Lemonjon'});

// container.set({name: 'Lemongrab'});

function Container(init) {
  this._value = init;
}

Container.prototype = {
  update: function(fun /*, args */) {
    var args = _.rest(arguments);
    var oldValue = this._value;

    this._value = fun.apply(this, construct(oldValue, args));

    return this._value;
  }
};

var aNumber = new Container(42);

aNumber.update(function(n) { return n + 1 });//=> 43


// #Flow Based Programming
function createPerson() {
  var firstName = '';
  var lastName = '';
  var age = 0;

  return {
    setFirstName: function(fn) {
      firstName = fn;
      return this;
    },
    setLastName: function(ln) {
      lastName = ln;
      return this;
    },
    setAge: function(a) {
      age = a;
      return this;
    },
    toString: function() {
      return [firstName, lastName, age].join(' ');
    }
  };
}

var person = createPerson()
  .setFirstName('albert')
  .setLastName('fan')
  .setAge('27')// this point to createPerson
  .toString();

_.chain(library)
 .pluck('title')
 .sort()
 .value();
 // take the value from the world of the wrapper object and bring it into
 // the 'real world'.

 _.chain(library)
  .pluck('title')
  .tap(note)
  .sort();
  // NOTE: SICP, SICP, Joy of Clojure
  //=> _

// ## A Lazy Chain
function LazyChain(obj) {
  this._calls = [];
  this._target = obj;
}

LazyChain.prototype.invoke = function(methodName /*, args */) {
  var args = _.rest(arguments);

  this._calls.push(function(target) {
    var meth = target[methodName];

    return meth.apply(target, args);
  });//insert defferred Array#method into the LazyChain

  return this;
};

new LazyChain([2, 3, 4]).invoke('sort')._calls;
//=> [function (target) { ... }]
// As shown, the only element in the _calls array after adding one link to
// the lazy chain is a single function that corresponds to a defferred Array#sort
// method call on the array [2, 3, 4].
// A function that wraps some behavior for later execution istypically called a
// thunk. The thunk that's stored in _calls expects some intermediate target That
// will serve as the object receiving the eventual method call.

// new LazyChain([2, 3, 4]).invoke('sort')._calls[0]();
// TypeError: Cannot read property 'sort' of undefined
new LazyChain([2, 3, 4]).invoke('sort')._calls[0]([2, 1, 3]);

// The LazyChain#force function is the execution engine for the lazy chaining logic.
// The use of _.reduce nicely provides the same kind of trampolining logic as
// demonstrated in Chapter.
LazyChain.prototype.force = function() {
  return _.reduce(this._calls, function(target, thunk) { // thunk?
  // this._calls: [function (target) {...}, function (target) {...}]
  // target: array, thunk: first-method => target: thunk(array), thunk: second-method
    return thunk(target);
  }, this._target);
  return _.reduce(this._calls, function(target, thunk) {
    return thunk(target);
  }, this._target);
};

new LazyChain([2, 1, 3]).invoke('sort').force();//=> [1, 2, 3]

new LazyChain([2, 1, 3])
  .invoke('concat', [8,5,7,6])
  .invoke('sort')
  .invoke('join', ' ')
  .force();
//=> '1 2 3 4 5 6 7 8'
// While you might see how that is indeed the case because thunks are stored in
// the _calls array and never executed until LazyChain#force, it's still better
// to show it actually being lazy.

LazyChain.prototype.tap = function(fun) {
  this._calls.push(function(target) {
    fun(target);
    return target;
  });

  return this;
}

new LazyChain([2, 1, 3])
  .invoke('sort')
  // .tap(alert)
  .force();
//=> '1,2,3'

var deferredSort = new LazyChain([2, 1, 3])
  .invoke('sort');
  // .tap(alert);

deferredSort;
//=> LazyChain
deferredSort.force();//=> [1, 2, 3]

// Keeping in mind that at the heart of a LazyChain is just an array of thunks,
// we can change the constuctor to concatenate the arrays when presented with
// another LazyChain as its argument:
function LazyChainChainChain(obj) {
  var isLC = (obj instanceof LazyChain);

  this._calls = isLC ? cat(obj._calls, []) : [];

  this._target = isLC ? obj._target : obj;
}
// another LazyChain as its argument
LazyChainChainChain.prototype = LazyChain.prototype;

new LazyChainChainChain(deferredSort)
  .invoke('toString')
  .force();// '1,2,3'
// Allowing chains to compose in this way is a very powerful idea. It allows to
// build up a library of discrete behaviors without worrying about the final result.

// ## Promises
var longing = $.Deferred();
longing.promise();//=> Object
longing.promise().state();//=> 'pending'
longing.resolve('<3');
longing.promise().state();//=>'resolved'
longing.promise().done(note);
// NOTE: <3
//=> <the promise itself>
function go() {
  var d = $.Deferred();
  $.when('')
   .then(function() {
     setTimeout(function() {
       console.log('sub-task 1');
     }, 5000)
   })
   .then(function() {
     setTimeout(function() {
       console.log('sub-task 2');
     }, 10000)
   })
   .then(function() {
     setTimeout(function() {
       d.resolve('done done done done');
     }, 15000)
   })

  return d.promise();
}

var yearning = go().done(note);// due to the timeouts in the subtasks, the
// console logging has not yet occurred.
yearning.state();//=> 'pending'
// (console) sub-task 1
yearning.state();//=> 'pending'
// (console) sub-task 2
// ... 5 seconds later
// NOTE: done done done done
yearning.state();
//=> 'resolved'
// a LazyChain represents a strict sequence of calls that calculate a value. Promises,
// on the other hand, also represent a sequence of calls, but differ in that once
// they are excuted, the value is available on the demand.

// Further, JQuery's promise API is meant to define aggregate tasks composed of
// some number of asynchronous subtasks. The subtasks themselves execute, as possible
// concurrently.

// A lazy chain also represents an aggregate task composed of subtasks, but they,
// once forced, are always run one after the other. The difference between the
// two can be summarized as the difference between aggregating highly connected
// tasks(LazyChain) versus loosely related(Deferred) tasks.

// ## Pipelinine
function pipeline(seed /*, args */) {
  return _.reduce(_.rest(arguments),
                  function(l,r) { return r(l); },
                  seed);
}
pipeline();//=> undefined
pipeline(42);//=> 42
pipeline(42, function(n) { return -n });//=> -42
function fifth(a) {
  return pipeline(a,
    _.rest,
    _.rest,
    _.rest,
    _.rest,
    _.first);
}
fifth([1,2,3,4,5]);//=> 5
// _.rest(ary) => _.rest(ary-1) => _.rest(ary-2)

function negativeFifth(a) {
  return pipeline(a,
    fifth,
    function(n) { return -n });
}

negativeFifth([1,2,3,4,5,6]);//=> -5

// function firstEditions(table) {
//   return pipeline(table,
//     function(t) { return as(t, {ed: 'edition'}) },
//     function(t) { return project(t, ['title', 'edition', 'isbn']) },
//     function(t) { return restrict(t, function(book) {
//       return book.edition === 1;
//     });}
//   )
// }
// Using a pipeline to perform side-effectful acts like I/O, Ajax calls, or
// mutations may cause them return nothing of value.


// ## Data Flow versus Control Flow TODO
// while at any point in the pipeline the intermediate type could change, the
// change was known prior to composition to ensure the proper values were fed
// from one stage to the next.

pipeline(42, sqr, note, function(n) { return - n)};
// NOTE: 1764

// ## Finding a Common Shape
function actions(acts, done) {
  return function(seed) {
    var init = {values: [], state: seed};

    var intermediate = _.reduce(acts, function(stateObj, action) {
      var result = action(stateObj.state);
      var values = cat(stateObj.values, [result.answer]);

      return {values: values, state: result.existy};
    }, init);
    // 1. stateObj: init, action: acts[0].
    //    result = acts[0](init.state), values = cat(init.values, [result.answer])
    //    return {values: values, state: result.existy}
    // 2. stateObj: {values: values, state: result.existy}, action: acts[1]
    // 

    var keep = _.filter(intermediate.values, existy);

    return done(keep, intermediate.state);
  };
}
// taking a value and returning a function that arguments the intermediate state
// object. The actions function then reduces over all of the functions in the
// array and builds up an intermediate state object.
// ```
// var intermediate = _.reduce(acts, function(stateObj, action) {
//   var result = action(stateObj.state);
//   var values = cat(stateObj.values, [result.answer]);
// 
//   return { values: values, state: result.state };
// }, init);
// ```

// 
function mSqr() {
  return function(state) {
    var ans = sqr(state);
    return {answer: ans, state:ans};
  }
}

var doubleSquareAction = actions(
  [mSqr(), mSqr()], function(values) { return values; }
);

doubleSquareAction(10);//=> [100, 10000]

function mNote() {
  return function(state) {
    note(state);
    return {answer: undifined, state: state};
  }
}

function mNeg() {
  return function(state) {
    return {answer: -state, state: -state};
  }
}

var negativeSqrAction = actions([mSqr(), mNote(), mNeg()],
  function(_, state) {
    return state;
  });
  
negativeSqrAction(9);// NOTE: 81
//=> -81
// the preceding code seems like a lot of ceremony to achieve the effects needed.

// ## A Function to Simplify Action Creation
function lift(answerFun, stateFun) {
  return function(/* args */) {
    var args = _.toArray(arguments);
    
    return function(state) {
      var ans = answerFun.apply(null, construct(state, args));
      var s = stateFun ? stateFun(state) : ans;
      
      return {answer: ans, state: s};
    };
  };
}

// redifine mSqr, mNote, and mNeg

// how to reify functional and object-oriented thinking
// ## Data Orientation
function lazyChain(obj) {
  var calls = [];
  
  return {
    invoke: function(methodName /* args */) {
      var args = _.rest(arguments);
      calls.push(function(target) {
        var meth = target[methodName];
        
        return meth.apply(target, args);
      });
      
      return this;
    },
    force: function() {
      return _.reduce(calls, function(ret, thunk) {
        return thunk(ret);
      }, obj);
    }
  };
}
// - the lazy chain is initiated via a function call.
// - the call chain (in calls) is private data.
// - there is no explicit LazyChain type.
var lazyOp = lazyChain([2, 1, 3])
  .invoke('concat', [5])
  .invoke('sort');
lazyOp.force();
// JavaScript provides numerous and powerful ways to defer or eliminate the need 
// to create named types and type hierarchies, including:
// - Usable primitive data types
// - Usable aggregate data types(i.e., arrays and objects)
// - Functions working on built-in data types
// - Anonymous objects containg methods
// - Typed objects
// - Classes

// lazy chaining can be deconstructed into three stages:
// - Acquire some object
// - Define a chain in relation to the object
// - Execute the chain
function deferredSort(ary) {
  return lazyChain(ary).invoke('sort');
}
// this: {invoke: , force: }
var defferredSorts = _.map([[1], [2], [3,2,7]], deferredSort);
//=> [<thunk>, <thunk>, <thunk>]
function force(thunk) {
  return thunk.force();
}
_.map(deferredSorts, force);//=> [1], [2], [2,3,7]

var validateTriples = validator(
  'Each array should have three elements',
  function (arrays) {
    return _.every(arrays, function(a) {
      return a.length === 3;
    });
  }
);
var validateTriplesStore = partial1(condition1(validateTriples), _.identity);
// function condition1(/* validators */) {
//   var validators = _.toArray(arguments);
// 
//   return function(fun, arg) {
//     var errors = mapcat(function(isValid) {
//       return isValid(arg) ? [] : [isValid.message];
//     }, validators);
// 
//     if (!_.isEmpty(errors))
//       throw new Error(errors.join(', '));
// 
//     return fun(arg);
//   }
// }

// function partial1(fun, arg1) {
//   return function(/* args */) {
//     var args = construct(arg1, arguments);
//     return fun.apply(fun, args);
//   };
// }
// var args = construct(_.identity, arguments); array
// return condition1(validateTriples).apply(condition1(validateTriples), args);
// condition1(validateTriples) => function(fun, arg)
// => return _.identity(arguments)
function postProcess(arrays) {
  return _.map(arrays, second);
}

function processTriples(data) {
  return pipeline(data,
    JSON.parse,
    validateTripleStrore,
    deferredSort,
    force,
    postProcess,
    invoker('sort', Array.prototype.sort),
    str);
}
//[JSON.parse, validateTripleStore, deferredSort, force, postProcess,
// invoker('sort', Array.prototype.sort), str], 

processTriples('[[2,1,3],[7,7,1],[0,9,5]]');//=> '1,7,9'
$.get('http://djhkjhkdj.com', function(data) {
  $('#result').text(processTriples(data));
});
var reportDataPackets = _.compose(
  function(s) {$('#result').text(s)},
  processTriples
);
$.get('http://djhkjhkdj.com', reportDataPackets);
// there are times when object-level thinking is appropriate,especially when concrete
// types adhering to generic mixins are the right abstraction.
function polyToString(obj) {
  if (obj instanceof String)
    return obj;
  else if (obj instanceof Array)
    return stringifyArray(obj);
    
  return obj.toString();
}

function stringifyArray(ary) {
  return ['[', _.map(ary, polyToString).join(','), ']'].join('');
}
// _.map(ary, polyToString).join('')
polyToString([1,2,3])//=> '[1,2,3]'
