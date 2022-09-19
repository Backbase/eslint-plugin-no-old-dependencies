# @bb-cli/eslint-plugin-no-old-dependencies

ESlint plugin which checks if correct version of common library is used by other libraries.

The plugin:

- Reads the list of common libraries provided in .eslintrc
- For Each library in /libs
  - If common library is used in "dependencies" section
    - Check if version matches the version in `<common-library>/package.json`
    - Report error if versions do not match

## Instalation

```
npm i -D @bb-cli/eslint-plugin-no-old-dependencies
```

## Configuration (.eslintrc)

```json
{
  "overrides": [
    {
      "files": ["*.json"],
      "extends": ["plugin:@bb-cli/no-old-dependencies/all"],
      "rules": {
        "@bb-cli/no-old-dependencies/no-old-deps": [
          "error",
          ["<common-library>"]
        ]
      }
    }
  ]
}
```
