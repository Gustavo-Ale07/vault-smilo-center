const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const ENCODING = 'base64';

function getEncryptionKey() {
  const keyBase64 = process.env.ENCRYPTION_KEY_BASE64;

  if (!keyBase64) {
    throw new Error('ENCRYPTION_KEY_BASE64 is not set');
  }

  const key = Buffer.from(keyBase64, 'base64');

  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY_BASE64 must decode to 32 bytes');
  }

  return key;
}

/**
 * Encrypt plaintext using AES-256-GCM.
 * Format: iv:tag:ciphertext (base64)
 */
function encrypt(plaintext) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const input = typeof plaintext === 'string' ? plaintext : String(plaintext);
  let encrypted = cipher.update(input, 'utf8', ENCODING);
  encrypted += cipher.final(ENCODING);

  const tag = cipher.getAuthTag();

  return [iv.toString(ENCODING), tag.toString(ENCODING), encrypted].join(':');
}

/**
 * Decrypt ciphertext using AES-256-GCM.
 */
function decrypt(ciphertext) {
  try {
    const key = getEncryptionKey();
    const parts = ciphertext.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid ciphertext format');
    }

    const [ivPart, tagPart, encrypted] = parts;
    const iv = Buffer.from(ivPart, ENCODING);
    const tag = Buffer.from(tagPart, ENCODING);

    if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) {
      throw new Error('Invalid ciphertext data');
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    throw new Error('Invalid or corrupted ciphertext');
  }
}

module.exports = {
  encrypt,
  decrypt,
};
