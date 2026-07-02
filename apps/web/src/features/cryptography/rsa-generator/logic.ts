export async function generateRsaKeyPair(modulusLength: number = 2048): Promise<{ publicKey: string, privateKey: string }> {
  // Web Crypto API to generate RSA-OAEP keys (or RSA-PSS/RSASSA-PKCS1-v1_5)
  // We'll generate a standard signing key (RSASSA-PKCS1-v1_5)
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  
  const exportedPrivateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  const publicPem = convertBinaryToPem(exportedPublicKey, "PUBLIC KEY");
  const privatePem = convertBinaryToPem(exportedPrivateKey, "PRIVATE KEY");

  return {
    publicKey: publicPem,
    privateKey: privatePem
  };
}

function convertBinaryToPem(buffer: ArrayBuffer, label: string): string {
  const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}
