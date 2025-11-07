// Utility to extract paths from SVG and create clickable province map
// This will be used to make provinces directly clickable

export const extractSVGPaths = (svgContent) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  const paths = svgDoc.querySelectorAll('g#Turkey path');
  
  return Array.from(paths).map((path, index) => ({
    index,
    d: path.getAttribute('d'),
    className: path.getAttribute('class') || 'st0'
  }));
};

// Approximate province regions based on coordinates
// Maps approximate click areas to city IDs
export const getProvinceFromCoordinates = (x, y) => {
  // These coordinates are approximate and based on the viewBox 0 0 800 600
  // You may need to adjust these based on actual province boundaries
  
  // Istanbul region (northwest)
  if (x >= 120 && x <= 220 && y >= 150 && y <= 250) return 'istanbul';
  
  // Izmir region (west)
  if (x >= 80 && x <= 180 && y >= 280 && y <= 380) return 'izmir';
  
  // Mersin region (south-central)
  if (x >= 480 && x <= 580 && y >= 380 && y <= 480) return 'mersin';
  
  // Kilis region (southeast)
  if (x >= 580 && x <= 680 && y >= 320 && y <= 400) return 'kilis';
  
  // Düzce region (northwest-central)
  if (x >= 220 && x <= 320 && y >= 180 && y <= 280) return 'duzce';
  
  // Isparta region (southwest-central)
  if (x >= 220 && x <= 320 && y >= 330 && y <= 430) return 'isparta';
  
  // Adıyaman region (east-central)
  if (x >= 540 && x <= 640 && y >= 320 && y <= 400) return 'adiyaman';
  
  // İskenderun region (southeast)
  if (x >= 620 && x <= 720 && y >= 350 && y <= 450) return 'iskenderun';
  
  // Azaz region (southeast)
  if (x >= 600 && x <= 700 && y >= 300 && y <= 400) return 'azaz';
  
  // Karabük region (north-central)
  if (x >= 300 && x <= 400 && y >= 200 && y <= 300) return 'karabuk';
  
  // Elazığ region (east-central)
  if (x >= 510 && x <= 610 && y >= 250 && y <= 350) return 'elazig';
  
  // Sivas region (central-east)
  if (x >= 410 && x <= 510 && y >= 250 && y <= 350) return 'sivas';
  
  return null;
};

