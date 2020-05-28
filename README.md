# Actions Issue Parser

Extract useful information from new issues for use in your GitHub Actions.

## Getting Started

Simply add this action to any workflow that runs on GitHub Issue `created` events and it will extract `key: value` pairs as `outputs` to be used in subsequent actions.

This parser will replace whitespace and special characters with `_`, then squash repeating `_` down to one, dropping any leading or trailing `_`

`Email of  User` would become `email_of_user`

#### Example Workflow
```Yaml
- id: parser
  uses: actionsdesk/parse-issue@v1
- uses: actions/some-action@v1
  with:
    foo: ${{steps.parser.outputs.foo}}
    bar: ${{steps.parser.outputs.bar}}
```

#### Example Issue

```Yaml
# Welcome

foo: fizz
bar: buzz
```

Given the workflow and issue above, this action will parse `foo` and `bar` with their values and make them available at `steps.parser.outputs`. In this example, the following would be defined:

- `steps.parser.outputs.foo` (with a value of `fizz`)
- `steps.parser.outputs.bar` (with a value of `buzz`)

The `id` used is arbitrary, only used to reference the output in another step.

### Default Extractor

By default, this Action will extract all `key: value` pairs that it finds.  Duplicate keys will be overridden by the last value found.

### Custom Extractors

You can define custom extractors with regular expressions by defining inputs to this action in a specific prefix.  All inputs that start with `extract_` will be enumerated and made available on `outputs` based on the value passed in.  If you use a capture group, we will assign the first match and ignore the rest


#### Examples

<table>
  <thead>
    <tr>
      <th>Workflow</th>
      <th>Issue</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><pre>uses: actionsdesk/parse-issue@v1
inputs:
  extract_username: '&lt;p id="username">(?&lt;username>[^&lt;]+)&lt;/p>'
  extract_email: '&lt;p id="email">johnsmith@example.com&lt;/p>'</pre></td>
      <td><pre># Example Issue
&lt;p id="username">johnsmith&lt;/p>
&lt;p id="username">(?&lt;email>[^<]+)&lt;/p></pre></td>
      <td><pre>username: johnsmith
email: johnsmith@example.com</pre></td>
    </tr>
    <tr>
      <td><pre>uses: actionsdesk/parse-issue@v1
inputs:
  extract_awesome: '^(.+) is awesome!$'</pre></td>
      <td><pre># Example Issue
Everything is awesome!</pre></td>
      <td><pre>awesome: Everything</pre></td>
    </tr>
  </tbody>
</table>
