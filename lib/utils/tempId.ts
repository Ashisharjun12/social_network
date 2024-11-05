import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { sendTempIdEmail } from './email';

export function generateTempId(): string {
  const uuid = uuidv4();
  const hash = crypto.createHash('sha256').update(uuid).digest('hex');
  return hash.substring(0, 12); // Return first 12 characters for brevity
}

export async function generateAndSendTempId(email: string, username: string): Promise<string> {
  try {
    const tempId = generateTempId();
    await sendTempIdEmail(email, username, tempId);
    return tempId;
  } catch (error) {
    console.error('Error sending temp ID:', error);
    // Still return the tempId even if email fails
    return generateTempId();
  }
}

export function validateTempId(tempId: string): boolean {
  return tempId.length === 12 && /^[a-f0-9]{12}$/.test(tempId);
} 