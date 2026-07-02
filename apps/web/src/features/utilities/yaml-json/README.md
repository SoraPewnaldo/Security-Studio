# YAML ↔ JSON Converter

## Overview

Convert between YAML and JSON formats instantly. Both formats are widely used for configuration files, API payloads, and data serialization, but each has its strengths. This tool bridges the gap.

## Features

- JSON → YAML: Converts JSON to cleanly formatted YAML (2-space indent)
- YAML → JSON: Converts YAML to nicely formatted JSON
- Accurate error reporting when either format is invalid

## How it Works

Powered by the robust `js-yaml` library. 
When converting to YAML, the tool parses the JSON string and dumps it to YAML using `yaml.dump(obj)`.
When converting to JSON, the tool parses the YAML using `yaml.load(yamlStr)` and stringifies it using `JSON.stringify(obj, null, 2)`.

## Examples

| Input | Mode | Output |
|-------|------|--------|
| `{ "name": "App" }` | JSON → YAML | `name: App` |
| `name: App` | YAML → JSON | `{ "name": "App" }` |
| `invalid: [}` | YAML → JSON | _Error message_ |

## Limitations

- Some YAML features (like anchors, aliases, and specific tags) might be evaluated or ignored depending on the exact `js-yaml` safe load options.
- Comments in YAML are stripped when converting to JSON.

## References

- [YAML specification](https://yaml.org/)
- [JSON specification (RFC 7159)](https://tools.ietf.org/html/rfc7159)
- [js-yaml GitHub repository](https://github.com/nodeca/js-yaml)
