const MAX_DIMENSION = 1600; // an Aadhaar card stays readable well below this
const QUALITY = 0.8;
const SKIP_BELOW_BYTES = 400 * 1024; // already small enough to upload quickly

/**
 * Shrinks a camera photo before it is uploaded.
 *
 * A phone photographs an Aadhaar card at 3-5 MB. Two of those is ~10 MB, which
 * on typical Indian 4G upload speeds is around 40 seconds of the candidate
 * staring at a spinner — and minutes on a weak signal. Resizing to 1600px and
 * re-encoding as JPEG brings each one to roughly 300-400 KB with no meaningful
 * loss of legibility, turning that wait into a couple of seconds.
 *
 * Never throws and never returns something worse than the input: if anything
 * fails, or the re-encode ends up larger, the original file is used. A slow
 * upload is much better than a blocked registration.
 */
export async function compressImage(file) {
  if (!file || !file.type?.startsWith('image/') || file.size <= SKIP_BELOW_BYTES) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export default compressImage;
