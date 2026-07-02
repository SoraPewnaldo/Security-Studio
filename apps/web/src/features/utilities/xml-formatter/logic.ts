export function formatXml(xml: string, indent = 2): string {
  if (!xml.trim()) throw new Error('XML input is required');

  // Parse using DOMParser (browser built-in)
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const msg = parseError.textContent?.split('\n')[0] ?? 'Invalid XML';
    throw new Error(`Parse error: ${msg}`);
  }

  return serializeNode(doc, 0, indent);
}

function serializeNode(node: Node, depth: number, indent: number): string {
  const pad = ' '.repeat(depth * indent);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? '').trim();
    return text ? `${pad}${text}` : '';
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${pad}<!--${node.textContent}-->`;
  }

  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const pi = node as ProcessingInstruction;
    return `${pad}<?${pi.target} ${pi.data}?>`;
  }

  if (node.nodeType === Node.DOCUMENT_NODE) {
    return Array.from(node.childNodes)
      .map((child) => serializeNode(child, depth, indent))
      .filter(Boolean)
      .join('\n');
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const attrs = Array.from(el.attributes)
      .map((a) => ` ${a.name}="${a.value}"`)
      .join('');

    const childNodes = Array.from(el.childNodes);
    const childTexts = childNodes
      .map((c) => serializeNode(c, depth + 1, indent))
      .filter(Boolean);

    if (childTexts.length === 0) {
      return `${pad}<${el.tagName}${attrs}/>`;
    }

    // Single text-only child: inline
    if (
      childTexts.length === 1 &&
      childNodes.length === 1 &&
      childNodes[0]?.nodeType === Node.TEXT_NODE
    ) {
      return `${pad}<${el.tagName}${attrs}>${childTexts[0]?.trim() || ''}</${el.tagName}>`;
    }

    return `${pad}<${el.tagName}${attrs}>\n${childTexts.join('\n')}\n${pad}</${el.tagName}>`;
  }

  return '';
}

export function minifyXml(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('Invalid XML');
  return new XMLSerializer().serializeToString(doc).replace(/>\s+</g, '><').trim();
}
