# ROT13 / ROT-N

## Overview

ROT13 is a simple substitution cipher that replaces each letter with the letter 13 positions ahead in the alphabet. This tool supports the full generalized ROT-N shift, letting you rotate letters by any integer (positive or negative).

## Features

- Apply ROT13 with one click
- Generic ROT-N with any shift value (-25 to 25)
- Negative shifts supported (e.g., -1 is equivalent to ROT25)
- Preserves non-alphabetic characters (spaces, punctuation, digits)
- Symmetric — applying ROT13 twice restores the original text

## How it Works

For each alphabetic character, the tool computes:
```
new_char = ((char_code - base + shift) mod 26) + base
```
Where `base` is `65` (A) for uppercase and `97` (a) for lowercase letters. Non-letter characters are passed through unchanged.

## Examples

| Input | Shift | Output |
|-------|-------|--------|
| Hello, World! | 13 | Uryyb, Jbeyq! |
| Uryyb, Jbeyq! | 13 | Hello, World! |
| abc | 3 | def |
| abc | -3 | xyz |

## Limitations

- Only rotates English alphabetic characters (A–Z, a–z)
- Does not rotate digits or special characters
- Shift values outside [-25, 25] are normalized with modulo

## References

- [ROT13 on Wikipedia](https://en.wikipedia.org/wiki/ROT13)
- [Caesar Cipher on Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher)
