# Unicode Converter

## Overview

Convert between human-readable text and Unicode escape sequences (`\uXXXX`, `\u{XXXXX}`). Also displays the Unicode code point for each character. Useful for web development, localization, and security research involving Unicode-based bypasses.

## Features

- Text → Unicode: Encodes each character as `\uXXXX` (BMP) or `\u{XXXXX}` (supplementary planes)
- Unicode → Text: Decodes `\uXXXX`, `\u{XXXXX}`, and `\xXX` escape sequences
- Code point display: Shows `U+XXXX` values for each character
- Supports emoji and all Unicode supplementary plane characters

## How it Works

**Text to Unicode**: Uses `String.prototype.codePointAt()` to iterate over characters (handling surrogate pairs correctly), then formats as standard escape sequences.

**Unicode to Text**: Uses regular expressions to find `\u{...}` and `\uXXXX` patterns and replaces them with `String.fromCodePoint()` / `String.fromCharCode()`.

## Examples

| Input | Mode | Output |
|-------|------|--------|
| `Hi` | Text → Unicode | `\u0048\u0069` |
| `\u0048\u0069` | Unicode → Text | `Hi` |
| `👋` | Text → Unicode | `\u{1F44B}` |
| `日` | Text → Unicode | `\u65E5` |

## Limitations

- Supplementary plane characters (e.g., emoji) use the `\u{XXXXX}` syntax, which is not supported in some older environments
- Does not encode `\xXX` sequences in encode mode (only decodes them)

## References

- [Unicode on Wikipedia](https://en.wikipedia.org/wiki/Unicode)
- [Unicode escape sequences (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#unicode_escape_sequences)
- [Unicode code charts](https://www.unicode.org/charts/)
