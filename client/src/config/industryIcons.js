// Industry ID to Iconify icon name mapping
export const INDUSTRY_ICONS = {
  1: "mdi:oil", // Petróleo y gas
  2: "mdi:hospital-building", // Healthcare
  3: "mdi:factory", // Manufacturing
  4: "mdi:laptop", // Technology
  5: "mdi:bank", // Finance/Banking
  6: "mdi:school", // Education
  7: "mdi:truck-delivery", // Logistics
  8: "mdi:food", // Food & Beverage
  9: "mdi:hammer-wrench", // Construction
  10: "mdi:shopping", // Retail
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

