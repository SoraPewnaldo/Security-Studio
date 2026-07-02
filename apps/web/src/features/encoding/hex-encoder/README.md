# Hex Encoder/Decoder

## Overview

Converts between human-readable text and hexadecimal representation. Useful for inspecting byte values, crafting network payloads, and working with binary protocols.

## Features

- Text → Hex: Encodes any UTF-8 string to space, colon, or continuous hex bytes
- Hex → Text: Decodes space/colon-separated or continuous hex bytes back to text
- Configurable byte separator (space, colon, none)
- Full UTF-8 support including international characters and emoji
- Clear error messages for invalid characters or malformed input

## How it Works

**Text to Hex**: Uses `TextEncoder` to obtain the UTF-8 byte array, then formats each byte as a 2-digit lowercase hex string.

**Hex to Text**: Strips whitespace/colons, validates that only `[0-9a-fA-F]` characters are present and that the length is even, then decodes bytes using `TextDecoder`.

## Examples

| Input | Mode | Output |
|-------|------|--------|
| `Hello` | Text → Hex | `48 65 6c 6c 6f` |
| `48 65 6c 6c 6f` | Hex → Text | `Hello` |
| `deadbeef` | Hex → Text | binary data (4 bytes) |

## Limitations

- Hex decode requires an even number of hex digits per byte
- Only supports UTF-8 decoding (not latin-1 or other encodings)
- Invalid UTF-8 sequences will produce an error

## References

- [Hexadecimal on Wikipedia](https://en.wikipedia.org/wiki/Hexadecimal)
- [UTF-8 encoding](https://en.wikipedia.org/wiki/UTF-8)
