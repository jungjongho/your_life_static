/**
 * Image Download Utility
 * Using html2canvas to capture and download DOM elements as images
 */

export async function downloadAsImage(elementId: string, filename: string = 'my-life-stats.png'): Promise<void> {
  try {
    // Dynamically import html2canvas to reduce initial bundle size
    const html2canvas = (await import('html2canvas')).default;

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error('Image download failed:', error);
    throw new Error('이미지 다운로드에 실패했습니다.');
  }
}
