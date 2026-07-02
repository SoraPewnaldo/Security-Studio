import * as yaml from 'js-yaml';

export function jsonToYaml(json: string): string {
  if (!json.trim()) return '';
  try {
    const obj = JSON.parse(json);
    return yaml.dump(obj, { indent: 2, sortKeys: false });
  } catch (e: any) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
}

export function yamlToJson(yamlString: string): string {
  if (!yamlString.trim()) return '';
  try {
    const obj = yaml.load(yamlString);
    if (obj === undefined) return '';
    return JSON.stringify(obj, null, 2);
  } catch (e: any) {
    throw new Error(`Invalid YAML: ${e.message}`);
  }
}
