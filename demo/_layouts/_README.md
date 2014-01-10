# Demo Project

This project demonstrates `annodoc` output and usage.

## API
{{#each functions}}
### {{name}}

{{description}}
{{function}}
```js
{{#each examples}}
{{{call}}} => {{{result}}}
{{/each}}
```
{{/each}}

