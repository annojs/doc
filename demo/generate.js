#!/usr/bin/env node
var fs = require('fs');

var random = require('seed-random')('baz');

var math = require('annomath');
var generators = require('annogenerate')(function(min, max) {
    return math.randint(min, max, random);
});
patchGenerators(generators);


var compile = require('handlebars').compile;
var lib = require('./lib');
var generate = require('../');


main();

function main() {
    fs.readFile('./_layouts/_README.md', {
        encoding: 'utf-8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var ctx = {
            functions: generate(generators, {
                module: lib,
                examples: 4
            })
        };
        var tpl = compile(d);
        var result = tpl(ctx);

        console.log(result);
    });
}

function patchGenerators() {
    var num = generators.number;

    generators.number = generators.number.bind(null, -100, 100);
    generators.isPositive = function() {
        return num(0, 1000);
    };
    generators.largerThanMin = function() {
        return num(this.args[1], 1000);
    };
    generators.string = generators.string.bind(null, 10);
}
