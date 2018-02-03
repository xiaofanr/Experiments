function splat(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
}

var addArrayElements = splat(function(x, y) { return x + y });

console.log(addArrayElements([1, 2]));

function unsplat(fun) {
  return function() {
    return fun.call(null, _.toArray(arguments));
  }
}

var joinElements = unsplat(function(array) { return array.join(' ') });

console.log(joinElements(1, 2, 3, 4, 5));


function parseAge(age) {
  if (!_.isString(age)) throw new Error('Expecting a string');
  var a;
  console.log('Attempting to parse an age');

  a = parseInt(age, 10);
  if (_.isNaN(a)) {
    console.log(['Could not parse age:', age].join(' '));
    a = 0;
  }

  return a;
}

console.log(parseAge('42'));
// parseAge(42);
// console.log(parseAge('frob'));


function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(['WARNING:', thing].join(' '));
}

function note(thing) {
  console.log(['NOTE:', thing].join(' '));
}

function parseAge(age) {
  if (!_.isString(age)) fail('Expecting a string');
  var a;

  note('Attempting to parse an age');
  a = parseInt(age, 10);

  if (_.isNaN(a)) {
    warn(['Could not parse age:', age].join(' '));
    a = 0;
  }

  return a;
}

var letters = ['a', 'b', 'c'];

function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

function nth(a, index) {
  if (!_.isNumber(index)) fail('Expected a number as the index');
  if (!isIndexed(a)) fail('Not supported on non-indexed type');
  if ((index < 0) || (index > a.length - 1)) fail('Index value is out of bounds');

  return a[index];
}

function second(a) {
  return nth(a, 1);
}

console.log(second(['hello', 'world']));

console.log([2, 3, -1, -6, 0, -108, 42, 10].sort());

function compareLessThanOrEqual(x, y) {
  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
}

console.log([2, 3, -1, -6, 0, -108, 42, 10].sort(compareLessThanOrEqual));

if (_.contains([0, -1], compareLessThanOrEqual(1, 1))) {
  console.log('less or equal');
}

function lessOrEqual(x, y) {
  return x <= y;
}

console.log([2, 3, -1, -6, 0, -108, 42, 10].sort(lessOrEqual));

// function lameCSV(str) {
//   return _.reduce(str.split('\n'), function(table, now) {
//     table.push(_.map(row.split).function(c) { return c.tr()});
//     return table;
//   });
// }

function existy(x) {
  return x != null;
}

function truthy(x) {
  return (x !== false) && existy(x);
}

function doWhen(cond, action) {
  if (truthy(cond)) {
    return action();
  } else {
    return undefined;
  }
}

_.each(['hello', 'world'], function(word) {
  console.log(word.charAt(0).toUpperCase() + word.substr(1));
});

function lyricSegment(n) {
  return _.chain([])
    .push(n + ' bottles of beer on the wall')
    .push(n + ' bottles of beer')
    .push('Take one down, pass it around')
    .tap(function(lyrics) {
      if (n > 1)
        lyrics.push((n - 1) + ' bottles of beer on the wall.');
      else {
        lyrics.push('No more bottles of beer on the wall');
      }
    })
    .value();
}

function song(start, end, lyricGen) {
  return _.reduce(_.range(start, end, -1),
    function(acc, n) {
      return acc.concat(lyricGen(n));
    }, []);
}

console.log(song(99, 0, lyricSegment));

var bFunc = function() {return this};
var b = {name: 'b', fun: bFunc};

console.log(b.fun());

var nums = [1, 2, 3, 4, 5];

function doubleAll(array) {
  return _.map(array, function(n) {return n*2});
}

console.log(doubleAll(nums));

function average(array) {
  var sum = _.reduce(array, function(a, b) { return a + b });
  return sum / _.size(array);
}

console.log(average(nums));

function onlyEven(array) {
  return _.filter(array, function(n) {
    return (n%2) === 0;
  });
}

console.log(onlyEven(nums));

console.log(_.map({a: 1, b: 2}, function(v, k) {
  return [k, v];
}));

function allOf() {
  return _.reduceRight(arguments, function(truth, f) {
    return truth && f();
  }, true);
}

function anyOf() {
  return _.reduceRight(arguments, function(truth, f) {
    return truth || f();
  }, false);
}

function T() { return true }
function F() { return false }

console.log(allOf());
console.log(allOf(T, T));
console.log(allOf(T, T, T, T, F));
console.log(anyOf(T, T, F));
console.log(anyOf(F, F, F, F));
console.log(anyOf());

console.log(_.reject(['a', 3, 'b', 'c'], _.isNumber));

function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments));
  };
}

console.log(_.filter(['a', 'b', 3], complement(_.isNumber)));

var people = [{name: 'rick', age: 30}, {name: 'jaka', age: 24}];
console.log(_.sortBy(people, function(p) { return p.age }));

function cat() {
  var head = _.first(arguments);
  if (existy(head))
    return head.concat.apply(head, _.rest(arguments));
  else
    return [];
}

console.log(cat([1, 2, 3], [4, 5, 6], [7, 8]));

function construct(head, tail) {
  return cat([head], _.toArray(tail));
}
console.log(construct(42, [1, 2, 3]));

function mapcat(fun, coll) {
  return cat.apply(null, _.map(coll, fun));
}

console.log(mapcat(function(e) {
  return construct(e, [',']);
}, [1, 2, 3]));

function butLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

function interpose(inter, coll) {
  return butLast(mapcat(function(e) {
    return construct(e, [inter]);
  },
  coll));
}

console.log(interpose(',', [1, 2, 3]));

var zombie = {name: 'Bub', film: 'Day of the Dead'};

console.log(_.keys(zombie));

console.log(_.values(zombie));

console.log(_.pluck([{title: 'A', author: 1},
         {title: 'B', author: 2},
         {title: 'C', author: 3}],
         'author'));
console.log(_.pairs(zombie));

console.log(_.object(_.map(_.pairs(zombie), function(pair) {
  return [pair[0].toUpperCase(), pair[1]];
})));

_.pluck(_.map([{title: 'A', author: 1},
               {title: 'B', author: 2},
               {title: 'C', author: 3}],
             function(obj) {
               return _.defaults(obj, {author: 'Unknown'})
             }),
      'author');

var person = {name: 'Romy', token: 'j3983ij', password: 'tigress'};

var info = _.omit(person, 'token', 'password');
console.log(info);

var creds = _.pick(person, 'token', 'password');
console.log(creds);

var library = [{title: 'SICP', isbn: '0262010771', ed: 1},
               {title: 'SICP', isbn: '0262510871', ed: 2},
               {title: 'Joy of Clojure', isbn: '1935182641', ed: 1}];
console.log(_.pluck(library, 'title'));

function project(table, keys) {
  return _.map(table, function(obj) {
    // return _.pick(obj, keys);
    return _.pick.apply(null, construct(obj, keys));
  });
}

var editionResults = project(library, ['title', 'isbn']);
console.log(editionResults);

var isbnResults = project(editionResults, ['isbn']);
console.log(isbnResults);

function rename(obj, newNames) {
  return _.reduce(newNames, function(o, nu, old) {
    if (_.has(obj, old)) {
      o[nu] = obj[old];
      return o;
    } else {
      return o;
    }
  }, _.omit.apply(null, construct(obj, _.keys(newNames))));
}

console.log(rename({a: 1, b: 2}, {'a': 'AAA'}));
