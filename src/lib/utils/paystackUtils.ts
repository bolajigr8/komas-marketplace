import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const generatePaystackRef = (userId?: string): string => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const randomUuid = uuidv4().substring(0, 8); 
  const prefix = userId ? `PS_${userId}` : 'PS';

  return `${prefix}_${timestamp}_${randomUuid}`;
};