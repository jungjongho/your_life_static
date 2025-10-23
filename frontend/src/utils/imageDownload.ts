/**
 * Image Download Utility
 * Provides functionality to capture DOM elements as images and download them
 *
 * @module utils/imageDownload
 */

/**
 * Configuration options for html2canvas
 */
interface Html2CanvasOptions {
  backgroundColor: string;
  scale: number;
  logging: boolean;
  useCORS: boolean;
}

/**
 * Default html2canvas configuration for high-quality image export
 */
const DEFAULT_CANVAS_OPTIONS: Html2CanvasOptions = {
  backgroundColor: '#ffffff',
  scale: 2, // 2x resolution for high quality
  logging: false,
  useCORS: true,
};

/**
 * Converts a canvas element to a downloadable blob
 * Properly wraps the callback-based toBlob API in a Promise
 *
 * @param canvas - The canvas element to convert
 * @param type - MIME type of the image (default: 'image/png')
 * @param quality - Image quality for lossy formats (0-1)
 * @returns Promise resolving to Blob containing the image data
 * @throws Error if blob creation fails
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Triggers a download of a blob as a file
 *
 * @param blob - The blob to download
 * @param filename - Name for the downloaded file
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Temporarily add to DOM for Firefox compatibility
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Captures a DOM element as an image and downloads it
 * Uses html2canvas for rendering and provides proper Promise handling
 *
 * @param elementId - ID of the DOM element to capture
 * @param filename - Name for the downloaded file (default: 'my-life-stats.png')
 * @returns Promise that resolves when download is triggered
 * @throws Error if element not found or capture fails
 *
 * @example
 * try {
 *   await downloadAsImage('stats-result', 'my-anniversary-2024.png');
 *   showToast('Image downloaded successfully!');
 * } catch (error) {
 *   showToast('Failed to download image');
 * }
 */
export async function downloadAsImage(
  elementId: string,
  filename: string = 'my-life-stats.png'
): Promise<void> {
  try {
    // Dynamically import html2canvas to reduce initial bundle size
    const html2canvas = (await import('html2canvas')).default;

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Capture the element as canvas with high-quality settings
    const canvas = await html2canvas(element, DEFAULT_CANVAS_OPTIONS);

    // Convert canvas to blob with proper Promise handling
    const blob = await canvasToBlob(canvas);

    // Trigger download
    triggerDownload(blob, filename);
  } catch (error) {
    console.error('Image download failed:', error);
    throw new Error('이미지 다운로드에 실패했습니다.');
  }
}
