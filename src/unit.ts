import { v4 as uuidv4 } from 'uuid';

export function getFilename() : string {
  return uuidv4() + '.jpg';
}