export type PreflightResult = {
  isVector: boolean;
  format: string;
  warning?: string;
};

export function runPreflight(file: File): PreflightResult {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  const vectorFormats = ['svg', 'pdf', 'ai', 'eps'];
  const rasterFormats = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'webp'];

  if (vectorFormats.includes(ext)) {
    return {
      isVector: true,
      format: ext.toUpperCase(),
    };
  }

  if (rasterFormats.includes(ext)) {
    return {
      isVector: false,
      format: ext.toUpperCase(),
      warning: 'Non-vector raster file detected. Printing at large scale may cause blurriness or visible pixels.',
    };
  }

  return {
    isVector: false,
    format: ext.toUpperCase() || 'UNKNOWN',
    warning: 'Unrecognized format. File will be processed as raster artwork.',
  };
}
