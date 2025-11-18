import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TurkeyMap = ({ onProvinceClick, selectedCity, cities, subUnions }) => {
  const { language } = useLanguage();
  const [paths, setPaths] = useState([]);
  const [pathsWithUnions, setPathsWithUnions] = useState(new Set());
  const [provinceLabels, setProvinceLabels] = useState([]);
  const [pathToCityMap, setPathToCityMap] = useState(new Map());
  const svgRef = useRef(null);

  useEffect(() => {
    // Load and parse the SVG file
    fetch('/assets/tr-04.svg')
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const turkeyGroup = svgDoc.querySelector('g#Turkey');
        
        if (turkeyGroup) {
          const pathElements = Array.from(turkeyGroup.querySelectorAll('path.st0'));
          setPaths(pathElements.map((path, index) => ({
            d: path.getAttribute('d'),
            className: path.getAttribute('class') || 'st0',
            index
          })));
        }
      })
      .catch(error => console.error('Error loading SVG:', error));
  }, []);

  // Helper function to convert coordinates
  const convertCoord = React.useCallback((oldX, oldY) => {
    const scaleX = 800 / 700;
    const scaleY = 600 / 400;
    return { x: (oldX - 50) * scaleX, y: (oldY - 120) * scaleY };
  }, []);

  // Only provinces we have - derived from cities prop with converted coordinates
  const allProvinces = React.useMemo(() => {
    if (!cities || cities.length === 0) return [];
    
    return cities.map(city => {
      const coords = convertCoord(city.svgX, city.svgY);
      return {
        name: city.name,
        x: coords.x,
        y: coords.y
      };
    });
  }, [cities, convertCoord]);

  // Calculate province label positions after paths are rendered
  useEffect(() => {
    if (paths.length === 0 || !svgRef.current) {
      return;
    }

    try {
      const pathElements = svgRef.current.querySelectorAll('g#Turkey path');
      const labels = [];
      const usedProvinces = new Set(); // Track which provinces have been matched to avoid duplicates
      
      // First pass: collect all path centers and their potential province matches
      const pathCandidates = [];
      
      pathElements.forEach((pathElement, index) => {
        try {
          const bbox = pathElement.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;
          
          // Find nearest province to determine name
          let provinceName = null;
          let minDistance = Infinity;
          let matchedProvince = null;
          
          allProvinces.forEach((province) => {
            // Check if this province is already matched
            const provinceKey = province.name.tr || province.name.en;
            if (usedProvinces.has(provinceKey)) return; // Skip already matched provinces
            
            // Province coordinates are already in viewBox "0 0 800 600" - use directly
            const distance = Math.sqrt(
              Math.pow(centerX - province.x, 2) + Math.pow(centerY - province.y, 2)
            );
            
            // If within ~100 units and closer than previous matches
            if (distance < 100 && distance < minDistance) {
              minDistance = distance;
              provinceName = province.name;
              matchedProvince = provinceKey;
            }
          });
          
          if (bbox.width > 5 || bbox.height > 5) { // Only label visible provinces
            pathCandidates.push({
              index,
              x: centerX,
              y: centerY,
              name: provinceName,
              matchedProvince,
              distance: minDistance,
              width: bbox.width,
              height: bbox.height
            });
          }
        } catch (e) {
          // Skip this path if we can't get its bbox
        }
      });
      
      // Sort by distance (closest matches first) to prioritize better matches
      pathCandidates.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      
      // Second pass: assign provinces ensuring no duplicates
      pathCandidates.forEach((candidate) => {
        if (candidate.matchedProvince && !usedProvinces.has(candidate.matchedProvince)) {
          usedProvinces.add(candidate.matchedProvince);
          labels.push({
            index: candidate.index,
            x: candidate.x,
            y: candidate.y,
            name: candidate.name || { ar: '', en: '', tr: '' },
            width: candidate.width,
            height: candidate.height
          });
        }
      });
      
      setProvinceLabels(labels);
    } catch (e) {
      console.error('Error calculating province labels:', e);
    }
  }, [paths, allProvinces, convertCoord]);

  // Get list of city IDs that have unions
  const citiesWithUnions = React.useMemo(() => {
    if (!subUnions || subUnions.length === 0) return new Set();
    
    const unionCities = new Set();
    subUnions.forEach(union => {
      // Find city ID by matching city object
      if (union.city) {
        const city = cities.find(c => 
          c.name.ar === union.city.ar ||
          c.name.en === union.city.en ||
          c.name.tr === union.city.tr
        );
        if (city) {
          unionCities.add(city.id);
        }
      }
    });
    return unionCities;
  }, [subUnions, cities]);

  // Calculate which paths correspond to provinces with unions
  useEffect(() => {
    if (paths.length === 0 || !svgRef.current || citiesWithUnions.size === 0) {
      return;
    }

    const pathsWithUnionsSet = new Set();
    
    try {
      const pathElements = svgRef.current.querySelectorAll('g#Turkey path');
      pathElements.forEach((pathElement, index) => {
        try {
          const bbox = pathElement.getBBox();
          const pathCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
          
          // Check distance to each city with unions
          for (const city of cities) {
            if (citiesWithUnions.has(city.id)) {
              const cityCoords = convertCoord(city.svgX, city.svgY);
              const distance = Math.sqrt(
                Math.pow(pathCenter.x - cityCoords.x, 2) + Math.pow(pathCenter.y - cityCoords.y, 2)
              );
              
              // Use individual colorZone for each city (default to 80 if not specified)
              const colorZone = city.colorZone || 80;
              
              // If path center is within the colorZone of a city with unions, mark it
              if (distance < colorZone) {
                pathsWithUnionsSet.add(index);
                break; // Found a match, no need to check other cities
              }
            }
          }
        } catch (e) {
          // Skip this path if we can't get its bbox
        }
      });
      
      setPathsWithUnions(pathsWithUnionsSet);
    } catch (e) {
      console.error('Error calculating paths with unions:', e);
    }
  }, [paths, citiesWithUnions, cities]);

  // Build path-to-city mapping for accurate click detection
  useEffect(() => {
    if (paths.length === 0 || !svgRef.current || cities.length === 0) {
      return;
    }

    const pathToCity = new Map();
    
    try {
      const pathElements = svgRef.current.querySelectorAll('g#Turkey path');
      pathElements.forEach((pathElement, index) => {
        try {
          const bbox = pathElement.getBBox();
          const pathCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
          
          // Find nearest city to this path
          let nearestCity = null;
          let minDistance = Infinity;
          
          cities.forEach((city) => {
            const cityCoords = convertCoord(city.svgX, city.svgY);
            const distance = Math.sqrt(
              Math.pow(pathCenter.x - cityCoords.x, 2) + Math.pow(pathCenter.y - cityCoords.y, 2)
            );
            
            // Use colorZone as the matching threshold (or a reasonable default)
            const matchZone = city.colorZone || 80;
            
            if (distance < matchZone && distance < minDistance) {
              minDistance = distance;
              nearestCity = city.id;
            }
          });
          
          if (nearestCity) {
            pathToCity.set(index, nearestCity);
          }
        } catch (e) {
          // Skip this path if we can't get its bbox
        }
      });
      
      setPathToCityMap(pathToCity);
    } catch (e) {
      console.error('Error building path-to-city mapping:', e);
    }
  }, [paths, cities, convertCoord]);

  // Helper function to check if point is inside an SVG path (using SVG API)
  const isPointInPath = React.useCallback((point, pathElement) => {
    if (!pathElement) return false;
    try {
      return pathElement.isPointInFill(new DOMPoint(point.x, point.y));
    } catch (e) {
      return false;
    }
  }, []);

  const handlePathClick = (e, pathIndex) => {
    if (!svgRef.current || !onProvinceClick) return;
    
    // Get click coordinates in SVG space
    const point = svgRef.current.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    
    const svgPoint = point.matrixTransform(
      svgRef.current.getScreenCTM().inverse()
    );
    
    // Get the actual path element that was clicked
    const pathElements = svgRef.current.querySelectorAll('g#Turkey path');
    const clickedPathElement = pathElements[pathIndex];
    
    if (!clickedPathElement) return;
    
    // First, verify the click is actually inside the path using the actual border
    if (!isPointInPath(svgPoint, clickedPathElement)) {
      return; // Click is outside the province border, ignore it
    }
    
    // Get the city associated with this path
    const cityId = pathToCityMap.get(pathIndex);
    
    // Only trigger if city has unions
    if (cityId && citiesWithUnions.has(cityId)) {
      onProvinceClick(cityId);
    }
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 600"
      className="w-full h-full max-w-full scale-100 md:scale-[1.3] lg:scale-[1.6]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="mapShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25"/>
        </filter>
        <filter id="provinceGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>{`
          .province-path {
            fill: #e5e5e5;
            stroke: #1f4333;
            stroke-width: 0.7;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: fill 0.2s ease;
          }
          .province-path:hover {
            fill: #d4d4d4;
          }
          .province-path.has-unions {
            fill: #dcb557;
          }
          .province-path.has-unions:hover {
            fill: #d4b557;
          }
          .province-path.selected {
            fill: #dcb557; 
            opacity: 1;
          }
        `}</style>
      </defs>
      
      <g id="Turkey" filter="url(#mapShadow)">
        {paths.map((path, index) => {
          const hasUnions = pathsWithUnions.has(index);
          
          return (
            <path
              key={index}
              className={`province-path cursor-pointer ${hasUnions ? 'has-unions' : ''}`}
              d={path.d}
              onClick={(e) => handlePathClick(e, index)}
              style={{ pointerEvents: 'all' }}
            />
          );
        })}
      </g>
      
      {/* Province Labels */}
      <g id="ProvinceLabels">
        {provinceLabels.map((label, idx) => {
          // Only show label if province name exists and province is large enough
          if (!label.name || !label.name[language] || label.name[language] === '') return null;
          if (label.width < 15 && label.height < 15) return null; // Skip very small provinces
          
          // Calculate font size based on province size
          const fontSize = Math.max(9, Math.min(14, Math.sqrt(label.width * label.height) / 8));
          
          return (
            <text
              key={`label-${label.index}-${idx}`}
              x={label.x}
              y={label.y}
              className="province-label"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fill: '#1f4333',
                fontSize: `${fontSize}px`,
                fontWeight: '600',
                pointerEvents: 'none',
                userSelect: 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {/* Add text shadow using filter for better readability */}
              <tspan
                style={{
                  stroke: 'rgba(255, 255, 255, 0.9)',
                  strokeWidth: '0.3',
                  paintOrder: 'stroke fill'
                }}
              >
                {label.name[language]}
              </tspan>
            </text>
          );
        })}
      </g>
    </svg>
  );
};

export default TurkeyMap;

