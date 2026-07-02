# XML Formatter

## Overview
The XML Formatter tool is a utility for formatting and prettifying XML documents. It takes raw, unformatted, or minified XML strings and outputs well-structured, human-readable XML with proper indentation.

## Features
- **Format XML**: Prettifies minified or poorly formatted XML.
- **Custom Indentation**: Allows selecting the indentation size (2 spaces, 4 spaces, or tabs).
- **Collapse Content**: Option to collapse text content that doesn't contain elements.

## How it Works
The tool uses an XML formatting library to parse the input XML and reconstruct it with the specified styling choices. If the XML is structurally invalid, it will return an error indicating that the XML could not be parsed.

## Examples
- **Simple XML**: Formats basic nested elements with default indentation.
- **Complex XML**: Formats a deeply nested XML structure with attributes, utilizing larger indentations or collapsing text nodes.
- **Invalid XML**: Demonstrates error handling when a tag is not properly closed.

## Limitations
- Only standard XML parsing is supported. Some highly non-standard SGML/XML fragments might be problematic.
- Very large XML files may cause the browser to freeze momentarily during parsing and formatting.

## References
- [XML Specification](https://www.w3.org/XML/)
