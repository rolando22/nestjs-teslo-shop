export function fileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!file) {
    callback(new Error('File is empty'), false);
    return;
  }

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!validExtensions.includes(fileExtension)) {
    callback(null, false);
    return;
  }

  callback(null, true);
}
