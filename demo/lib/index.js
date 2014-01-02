var annotate = require('annotate');
var is = require('annois');

function add(a, b) {
    return a + b;
}

exports.addNumbers = annotate('addNumbers', 'Adds numbers').on(is.number, is.number, add);
exports.addStrings = annotate('addStrings', 'Adds strings').on(is.string, is.string, add);

// you can assert invariants too
exports.addPositive = annotate('addPositive', 'Adds positive').
    on(isPositive, is.number, add).
    on(isPositive, isPositive, add).satisfies(is.number); // postcondition

// it is possible to chain guards
/*
TODO: figure out why it gets stuck here (recursion trap?)

var fib = annotate('fib', 'Calculates Fibonacci numbers').
    on(0, 0).
    on(1, 1).
    on(is.number, function(n) {
        return fib(n - 1) + fib(n - 2);
    });
exports.fib = fib;
*/

// invariants may depend on each other
exports.clamp = annotate('clamp', 'Clamps given number between given bounds').
    on(is.number, is.number, function largerThanMin(a, args) {
        return is.number(a) && args[1] <= a;
    }, function(a, min, max) {
        return Math.max(Math.min(a, max), min);
    });

// furthermore it is possible to pass a variable amount of args
// TODO: figure out how to limit amount of maximum args in examples
exports.min = annotate('min', 'Returns minimum of the given numbers').
    on([is.number], Math.min);

function isPositive(a) {
    return a >= 0;
}
