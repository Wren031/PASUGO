export interface Merchant {
  id: string;
  name: string;
  emoji: string;
  category: string;
  location: string;
  qrPayload: string;
}

export const QR_PREFIX = 'HATDOPAY:';
