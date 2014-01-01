#!/usr/bin/env node
var fs = require('fs');

var generators = require('annogenerate');
var generateParams = require('annofuzz')(generators).generate;
var compile = require('handlebars').compile;
var is = require('annois');
var lib = require('./lib');


main();

function main() {
    patchGenerators(generators);

    fs.readFile('./_layouts/_README.md', {
        encoding: 'utf-8'
    }, function(err, d) {
        if(err) return console.error(err);

        var ctx = {
            functions: generate(lib)
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

// TODO: allow amount of examples to generated to be configured
function generate(module) {
    return Object.keys(module).map(function(k) {
        var fn = module[k];

        return {
            name: fn._name,
            description: fn._doc,
            examples: generateExamples(fn, fn._name, fn._preconditions)
            // preconditions - TODO
            // postconditions - TODO
        };
    });
}

function generateExamples(fn, name, preconditions) {
    return preconditions.map(generateExample.bind(null, fn, name));
}

function generateExample(fn, name, precondition) {
    var params = generateParams(precondition);

    if(is.array(precondition[0])) {
        params = params[0];
    }

    return {
        call: name + '(' +  params.join(', ') + ')',
        result: fn.apply(null, params)
    };
}
