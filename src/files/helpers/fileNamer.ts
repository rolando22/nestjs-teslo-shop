import * as crypto from 'crypto';

export function fileNamer(
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) {
  if (!file) {
    callback(new Error('File is empty'), '');
    return;
  }

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;

  callback(null, fileName);
}
