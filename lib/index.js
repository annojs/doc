var fp = require('annofp');
var is = require('annois');
var math = require('annomath');


module.exports = function(generators, o) {
    var generateParams = require('annofuzz')(generators).generate;

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

        return {
            call: name + '(' +  paramsToString(params) + ')',
            result: addQuotes(fn.apply(null, params))
        };
    }

    function paramsToString(params) {
        return params.map(addQuotes).join(', ');
    }

    function addQuotes(v) {
        if(is.string(v)) {
            return '\'' + v + '\'';
        }

        return v;
    }
};
