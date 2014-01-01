# Demo Project

This project demonstrates `annodoc` output and usage.

## API

{{#each functions}}
### {{name}}

{{description}}

{{function}}

#### Examples

```js
{{#each examples}}
{{call}} => {{result}}
{{/each}}
```
{{/each}}

