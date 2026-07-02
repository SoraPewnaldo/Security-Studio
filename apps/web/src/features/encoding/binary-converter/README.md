# Binary Converter

## Overview

Converts human-readable text to binary (base-2) representation and vice versa. Supports full UTF-8 encoding, meaning it works with international characters and emoji.

## Features

- Text → Binary: Encodes any UTF-8 string to space-separated binary bytes
- Binary → Text: Decodes space-separated or continuous 8-bit binary back to text
- Full UTF-8 support (including emoji and international characters)
- Clear validation error messages for invalid input

## How it Works

**Text to Binary**: Uses the browser's `TextEncoder` to get the UTF-8 byte array, then formats each byte as an 8-digit binary string, joined with spaces.

**Binary to Text**: Splits the input on whitespace or into 8-character chunks, converts each to a byte value, then uses `TextDecoder` with `fatal: true` to parse the bytes as UTF-8.

## Examples

| Input | Mode | Output |
|-------|------|--------|
| Hi | Text → Binary | `01001000 01101001` |
| `01001000 01101001` | Binary → Text | Hi |
| `11110000 10011111 10001000 10000000` | Binary → Text | 🈀 |

## Limitations

- Only supports UTF-8 encoding
- Binary input must use 8-bit bytes separated by spaces, or be a continuous string with length divisible by 8
- Invalid UTF-8 sequences will produce an error

## References

- [UTF-8 on Wikipedia](https://en.wikipedia.org/wiki/UTF-8)
- [Binary number on Wikipedia](https://en.wikipedia.org/wiki/Binary_number)
