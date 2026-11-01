import { MerkleAuditTrail } from '../types/audit';

/**
 * Standard FIPS 180-4 SHA-256 implementation.
 * Produces byte-for-byte identical output to Web Crypto API and Node.js crypto.createHash('sha256').
 */
export function sha256Sync(data: any): string {
  const message = typeof data === 'string' ? data : JSON.stringify(data);
  const msgUint8 = new TextEncoder().encode(message);

  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let H0 = 0x6a09e667;
  let H1 = 0xbb67ae85;
  let H2 = 0x3c6ef372;
  let H3 = 0xa54ff53a;
  let H4 = 0x510e527f;
  let H5 = 0x9b05688c;
  let H6 = 0x1f83d9ab;
  let H7 = 0x5be0cd19;

  const length = msgUint8.length;
  const bitLength = length * 8;

  // Pre-processing (Padding)
  const newLength = ((length + 8) >> 6) + 1 << 6;
  const padded = new Uint8Array(newLength);
  padded.set(msgUint8);
  padded[length] = 0x80;

  const dataView = new DataView(padded.buffer);
  dataView.setUint32(newLength - 4, bitLength, false);

  const W = new Uint32Array(64);

  for (let i = 0; i < newLength; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = dataView.getUint32(i + t * 4, false);
    }

    for (let t = 16; t < 64; t++) {
      const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }

    let a = H0;
    let b = H1;
    let c = H2;
    let d = H3;
    let e = H4;
    let f = H5;
    let g = H6;
    let h = H7;

    for (let t = 0; t < 64; t++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
    H5 = (H5 + f) | 0;
    H6 = (H6 + g) | 0;
    H7 = (H7 + h) | 0;
  }

  const hexParts = [H0, H1, H2, H3, H4, H5, H6, H7].map((val) =>
    (val >>> 0).toString(16).padStart(8, '0')
  );

  return hexParts.join('');
}

export const sha256 = sha256Sync;

export async function sha256Async(data: any): Promise<string> {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(content);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return sha256Sync(data);
}

export class MerkleTreeEngine {
  /**
   * Generates 4 state hashes for Receipt, OCR, Reconciliation, and Voice Verification
   */
  static createLeafHashes(
    receiptData: any,
    ocrData: any,
    reconcileData: any,
    voiceData: any
  ): [string, string, string, string] {
    const leaf0 = sha256(receiptData);
    const leaf1 = sha256(ocrData);
    const leaf2 = sha256(reconcileData);
    const leaf3 = sha256(voiceData);
    return [leaf0, leaf1, leaf2, leaf3];
  }

  /**
   * Computes the 2-level Merkle DAG and returns the MerkleAuditTrail
   */
  static computeTree(leafHashes: string[]): MerkleAuditTrail {
    if (!Array.isArray(leafHashes) || leafHashes.length !== 4) {
      throw new Error(`MerkleTree requires exactly 4 leaf hashes, got ${leafHashes?.length}`);
    }

    const h01 = sha256(leafHashes[0] + leafHashes[1]);
    const h23 = sha256(leafHashes[2] + leafHashes[3]);
    const root = sha256(h01 + h23);
    const timestamp = new Date().toISOString();

    return {
      receiptHash: leafHashes[0],
      ocrHash: leafHashes[1],
      reconciliationHash: leafHashes[2],
      voiceVerificationHash: leafHashes[3],
      leafHashes: [leafHashes[0], leafHashes[1], leafHashes[2], leafHashes[3]],
      intermediateHashes: [h01, h23],
      merkleRoot: root,
      timestamp,
      isTampered: false,
      verificationUrl: `https://sarvam-audit.gov.in/verify/${root.slice(0, 16)}`,
      qrPayload: JSON.stringify({
        root,
        h01,
        h23,
        ts: timestamp,
        verified: true,
      }),
    };
  }

  /**
   * Simulates a 1-byte tamper event on a selected leaf node
   */
  static simulateTamper(
    tree: MerkleAuditTrail,
    leafIndex = 1,
    tamperedPayload = 'MODIFIED_1_BYTE_TAMPER'
  ) {
    const tamperedLeaves = [...tree.leafHashes];
    tamperedLeaves[leafIndex] = sha256(tamperedPayload);
    const tamperedH01 = sha256(tamperedLeaves[0] + tamperedLeaves[1]);
    const tamperedH23 = sha256(tamperedLeaves[2] + tamperedLeaves[3]);
    const tamperedRoot = sha256(tamperedH01 + tamperedH23);

    return {
      originalRoot: tree.merkleRoot,
      tamperedRoot,
      tamperedLeafIndex: leafIndex,
      isTampered: true,
      mismatchDetected: tree.merkleRoot !== tamperedRoot,
      alertMessage: 'TAMPER DETECTED: Cryptographic Merkle Root mismatch! Record altered in transit.',
    };
  }
}
