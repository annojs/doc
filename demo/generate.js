#!/usr/bin/env node
var fs = require('fs');

var random = require('seed-random')('baz');

var fp = require('annofp');
var math = require('annomath');
var generators = require('annogenerate')(function(min, max) {
    return math.randint(min, max, random);
});
patchGenerators(generators);

var generateParams = require('annofuzz')(generators).generate;
var compile = require('handlebars').compile;
var is = require('annois');
var lib = require('./lib');


main();

function main() {
    fs.readFile('./_layouts/_README.md', {
        encoding: 'utf-8'
    }, function(err, d) {
        if(err) {
            return console.error(err);
        }

        var ctx = {
            functions: generate({
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

    generators.number = generators.number.bind(null, -1000, 1000);
    generators.isPositive = function() {
        return num(0, 1000);
    };
    generators.largerThanMin = function() {
        return num(this.args[1], 1000);
    };
    generators.string = generators.string.bind(null, 10);
}

function generate(o) {
    return Object.keys(o.module).map(function(k) {
        var fn = o.module[k];

        return {
            name: fn._name,
            description: fn._doc,
            examples: generateExamples(o.examples, fn, fn._name, fn._preconditions)
            // preconditions - TODO
            // postconditions - TODO
        };
    });
}

function generateExamples(amount, fn, name, preconditions) {
    var times = Math.ceil(amount / preconditions.length);

    return fp.flatten(math.range(times).map(function() {
        return preconditions.map(generateExample.bind(null, fn, name));
    })).slice(0, amount);
}

function generateExample(fn, name, precondition) {
    var params = generateParams(precondition);

    if(is.array(precondition[0])) {
        params = params[0];
    }

    // TODO: add quotes to string params
    return {
        call: name + '(' +  params.join(', ') + ')',
        result: fn.apply(null, params)
    };
}
