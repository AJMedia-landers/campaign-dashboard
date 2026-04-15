/**
 * Convert a Google Drive URL to its public thumbnail endpoint so it can be
 * embedded in an <img> tag. Drive's `download?id=…` and `uc?…` URLs
 * block hotlinking / return HTML; `drive.google.com/thumbnail?id=…` returns
 * an image and works cross-origin.
 *
 * Returns the original URL unchanged if it isn't a Drive link.
 */
export function toDriveThumbnail(url: string | null | undefined, size = 200): string | null {
  if (!url) return null;
  if (!/drive\.google\.com|drive\.usercontent\.google\.com|googleusercontent\.com/.test(url)) {
    return url;
  }
  // Extract the file id from id=… or /d/…/ patterns.
  const m = url.match(/[?&]id=([^&]+)/) || url.match(/\/d\/([^/?#]+)/);
  const id = m?.[1];
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
}
