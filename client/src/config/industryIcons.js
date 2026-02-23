// Industry ID to Iconify icon name mapping
export const INDUSTRY_ICONS = {
  1: "mdi:oil", // Petróleo y gas
  2: "roentgen:electricity", // Energia eléctrica
  3: "qlementine-icons:plus-16", // Servicios generales
  
};

// Default icon when industry ID is not found
export const DEFAULT_INDUSTRY_ICON = "mdi:briefcase";

/**
 * Get the icon name for an industry ID
 * @param {number} industryId - The industry ID
 * @returns {string} - The Iconify icon name
 */
export const getIndustryIcon = (industryId) => {
  return INDUSTRY_ICONS[industryId] || DEFAULT_INDUSTRY_ICON;
};

