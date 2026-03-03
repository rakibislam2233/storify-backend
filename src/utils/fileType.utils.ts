import { AllowedFileTypes } from '../../prisma/generated/enums';

export const getFileCategory = (mimeType: string): AllowedFileTypes => {
  // Images
  if (mimeType.startsWith('image/')) return AllowedFileTypes.IMAGE;

  // Videos
  if (mimeType.startsWith('video/')) return AllowedFileTypes.VIDEO;

  // Audio
  if (mimeType.startsWith('audio/')) return AllowedFileTypes.AUDIO;

  // Documents
  if (mimeType === 'application/pdf') return AllowedFileTypes.PDF;
  if (
    mimeType.includes('document') ||
    mimeType.includes('word') ||
    mimeType.includes('wordprocessingml')
  )
    return AllowedFileTypes.DOCUMENT;
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    mimeType.includes('sheetml')
  )
    return AllowedFileTypes.DOCUMENT;
  if (
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    mimeType.includes('presentationml')
  )
    return AllowedFileTypes.DOCUMENT;

  // Archives
  if (
    mimeType.includes('zip') ||
    mimeType.includes('rar') ||
    mimeType.includes('7z') ||
    mimeType.includes('gzip') ||
    mimeType.includes('tar')
  )
    return AllowedFileTypes.OTHER;
  return AllowedFileTypes.OTHER;
};
