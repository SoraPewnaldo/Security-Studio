/**
 * Tool Registration
 * This file imports all tool manifests to trigger their registration in the tool registry.
 * Import this file in main.tsx BEFORE rendering the app.
 */
import { registerTool } from '@security-studio/tool-sdk';

// Encoding
import { manifest as base64Manifest } from './encoding/base64/manifest';
import Base64Tool from './encoding/base64/Tool';
import { manifest as urlEncoderManifest } from './encoding/url-encoder/manifest';
import UrlEncoderTool from './encoding/url-encoder/Tool';
import { manifest as htmlEntitiesManifest } from './encoding/html-entities/manifest';
import HtmlEntitiesTool from './encoding/html-entities/Tool';

// Cryptography
import { manifest as hashGeneratorManifest } from './cryptography/hash-generator/manifest';
import HashGeneratorTool from './cryptography/hash-generator/Tool';
import { manifest as passwordGeneratorManifest } from './cryptography/password-generator/manifest';
import PasswordGeneratorTool from './cryptography/password-generator/Tool';
import { manifest as passwordStrengthManifest } from './cryptography/password-strength/manifest';
import PasswordStrengthTool from './cryptography/password-strength/Tool';

// Authentication
import { manifest as jwtInspectorManifest } from './authentication/jwt-inspector/manifest';
import JwtInspectorTool from './authentication/jwt-inspector/Tool';

// Web Security
import { manifest as cspBuilderManifest } from './web-security/csp-builder/manifest';
import CspBuilderTool from './web-security/csp-builder/Tool';
import { manifest as securityHeadersManifest } from './web-security/security-headers/manifest';
import SecurityHeadersTool from './web-security/security-headers/Tool';

// Networking
import { manifest as cidrCalculatorManifest } from './networking/cidr-calculator/manifest';
import CidrCalculatorTool from './networking/cidr-calculator/Tool';
import { manifest as ipUtilsManifest } from './networking/ip-utils/manifest';
import IpUtilsTool from './networking/ip-utils/Tool';

// Utilities
import { manifest as jsonFormatterManifest } from './utilities/json-formatter/manifest';
import JsonFormatterTool from './utilities/json-formatter/Tool';
import { manifest as regexPlaygroundManifest } from './utilities/regex-playground/manifest';
import RegexPlaygroundTool from './utilities/regex-playground/Tool';
import { manifest as uuidGeneratorManifest } from './utilities/uuid-generator/manifest';
import UuidGeneratorTool from './utilities/uuid-generator/Tool';
import { manifest as timestampManifest } from './utilities/timestamp/manifest';
import TimestampTool from './utilities/timestamp/Tool';

// Register all tools
registerTool(base64Manifest, Base64Tool);
registerTool(urlEncoderManifest, UrlEncoderTool);
registerTool(htmlEntitiesManifest, HtmlEntitiesTool);
registerTool(hashGeneratorManifest, HashGeneratorTool);
registerTool(passwordGeneratorManifest, PasswordGeneratorTool);
registerTool(passwordStrengthManifest, PasswordStrengthTool);
registerTool(jwtInspectorManifest, JwtInspectorTool);
registerTool(cspBuilderManifest, CspBuilderTool);
registerTool(securityHeadersManifest, SecurityHeadersTool);
registerTool(cidrCalculatorManifest, CidrCalculatorTool);
registerTool(ipUtilsManifest, IpUtilsTool);
registerTool(jsonFormatterManifest, JsonFormatterTool);
registerTool(regexPlaygroundManifest, RegexPlaygroundTool);
registerTool(uuidGeneratorManifest, UuidGeneratorTool);
registerTool(timestampManifest, TimestampTool);

// Build the search index
import { searchIndex } from '@security-studio/core';
import { toolRegistry } from '@security-studio/tool-sdk';
searchIndex.build(toolRegistry.getAllManifests());
