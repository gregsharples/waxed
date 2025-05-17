/* eslint-env node */
const fs = require("fs");
const path = require("path");

// eslint-disable-next-line no-undef
const INPUT_JSON_PATH = path.join(__dirname, "..", "data", "spots.json");
// eslint-disable-next-line no-undef
const OUTPUT_CSV_PATH = path.join(__dirname, "..", "processed_spots.csv");
const MAX_PATH_LEVELS = 6;

function getNestedValue(obj, pathString, defaultValue = null) {
  const keys = pathString.split(".");
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  return current;
}

function getSurflineLink(links, key) {
  if (!Array.isArray(links)) {
    return null;
  }
  const link = links.find((l) => l && typeof l === "object" && l.key === key);
  return link ? link.href : null;
}

function parseEnumeratedPath(enumeratedPath) {
  const pathParts = (enumeratedPath || "").split(",").slice(1); // Skip the first empty or "Earth" part
  const levels = {};
  for (let i = 0; i < MAX_PATH_LEVELS; i++) {
    levels[`path_level_${i + 1}`] = pathParts[i] || null;
  }
  return levels;
}

async function processSpots() {
  try {
    console.log(`Reading JSON from: ${INPUT_JSON_PATH}`);
    const rawData = fs.readFileSync(INPUT_JSON_PATH, "utf-8");
    const jsonData = JSON.parse(rawData);

    if (!jsonData.contains || !Array.isArray(jsonData.contains)) {
      console.error(
        "Error: JSON structure is not as expected. Missing contains array."
      );
      return;
    }

    const spots = jsonData.contains;
    console.log(`Found ${spots.length} entries to process.`);

    const csvHeaders = [
      "id",
      "name",
      "latitude",
      "longitude",
      "depth",
      "full_hierarchical_path",
      ...Array.from(
        { length: MAX_PATH_LEVELS },
        (_, i) => `path_level_${i + 1}`
      ),
      "geoname_id",
      "geonames_fcode",
      "geonames_fcode_name",
      "geonames_country_name",
      "geonames_country_code",
      "geonames_admin1_name",
      "category",
      "has_spots_flag",
      "surfline_www_url",
      "surfline_travel_url",
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    for (const spot of spots) {
      let latValue = getNestedValue(spot, "location.coordinates.1");
      let lonValue = getNestedValue(spot, "location.coordinates.0");

      let parsedLat = parseFloat(latValue);
      let parsedLon = parseFloat(lonValue);

      const finalLat = !isNaN(parsedLat) ? parsedLat : "";
      const finalLon = !isNaN(parsedLon) ? parsedLon : "";

      const pathLevels = parseEnumeratedPath(spot.enumeratedPath);

      const row = [
        spot._id || "",
        `"${(spot.name || "").replace(/"/g, '""')}"`, // Escape double quotes in name
        finalLat,
        finalLon,
        spot.depth,
        `"${(spot.enumeratedPath || "").replace(/"/g, '""')}"`,
        ...Array.from(
          { length: MAX_PATH_LEVELS },
          (_, i) =>
            `"${(pathLevels[`path_level_${i + 1}`] || "").replace(/"/g, '""')}"`
        ),
        spot.geonameId || "",
        getNestedValue(spot, "geonames.fcode", ""),
        `"${getNestedValue(spot, "geonames.fcodeName", "").replace(
          /"/g,
          '""'
        )}"`,
        `"${getNestedValue(spot, "geonames.countryName", "").replace(
          /"/g,
          '""'
        )}"`,
        getNestedValue(spot, "geonames.countryCode", ""),
        `"${getNestedValue(spot, "geonames.adminName1", "").replace(
          /"/g,
          '""'
        )}"`,
        spot.category || "",
        spot.hasSpots === undefined ? "" : spot.hasSpots,
        getSurflineLink(getNestedValue(spot, "associated.links"), "www") || "",
        getSurflineLink(getNestedValue(spot, "associated.links"), "travel") ||
          "",
      ];
      csvContent +=
        row
          .map((val) => (val === null || val === undefined ? "" : val))
          .join(",") + "\n";
    }

    fs.writeFileSync(OUTPUT_CSV_PATH, csvContent);
    console.log(
      `Successfully processed data. Output CSV written to: ${OUTPUT_CSV_PATH}`
    );
  } catch (error) {
    console.error("Error processing spots:", error);
  }
}

processSpots();
