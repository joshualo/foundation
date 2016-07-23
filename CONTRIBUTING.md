# Development Guidelines

## Git

### Commit Message Format

Based on AngularJS's commit formating: [Angular Contributer Guide](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format) 

```
<type>: <issueNo> <subject>
<BLANK LINE>
<body>
```
#### Example Commit Message
```
docs: Add documentation for developer guidlines

- Add a CONTRIBUTING.md file to document development styles and git workflows
- close #44
```

### Acceptable Types
`type` __MUST__ be one of the following:

- __feat:__ new feature
- __fix:__ fixes a bug
- __docs:__ Changes to documentation
- __refactor:__ Code changes which are not a bug or new feature
- __revert:__ Reverts a previous commit
- __other:__ Any other change, if you change application code you *should* use one of the more specific types.

### Github Issues
If your commit references a specific issue it *should* be referenced in the subject, and closed in the body:
```
feat: #45 Implement shipper dashboard

- Add a new dashboard for shippers that 
- close #45
```

### Verbage
- Use the imperative, present tense: "change" not "changed"
- No period at the end of the subject
