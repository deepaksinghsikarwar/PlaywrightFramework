import * as crypto from 'crypto';
import logger from './LoggerUtil';

// Encryption function
export function encrypt(text: string): string {
  // Get the SALT from the system environment variable
  const SALT = process.env.SALT || "defaultSALT";
  if (!SALT) {
    throw new Error('SALT is not set in environment variables');
  }

  const key = crypto.scryptSync(SALT, 'salt', 32);
  const iv = crypto.randomBytes(16); // 16 bytes for AES-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + encrypted;
}

// Decryption function
export function decrypt(cipherText: string): string {
  // Get the SALT from the system environment variable
  const SALT = process.env.SALT || "defaultSALT";
  if (!SALT) {
    throw new Error('SALT is not set in environment variables');
  }

  if (cipherText.length < 32) {
    logger.error(`Invalid cipherText format: ${cipherText}`);
    throw new Error('Invalid cipherText format: Too short to contain a valid IV.');
}

  const key = crypto.scryptSync(SALT, 'salt', 32);
  const iv = Buffer.from(cipherText.slice(0, 32), 'hex'); // 16 bytes IV
  const encrypted = Buffer.from(cipherText.slice(32), 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

