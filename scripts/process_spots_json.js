/* eslint-env node */
const fs = require("fs");
const path = require("path");

// eslint-disable-next-line no-undef
const INPUT_JSON_PATH = path.join(__dirname, "..", "data", "spots.json");

const OUTPUT_CSV_PATH = path.join(
  __dirname,
  "..",
  "data",
  "processed_spots_flat_v2.csv"
); // New output file name
const MAX_GEONAME_PATH_LEVELS_TO_CONSIDER = 5; // For Continent, Country, Region, Area

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

function parseEnumeratedPath(
  enumeratedPath,
  maxLevels = MAX_GEONAME_PATH_LEVELS_TO_CONSIDER
) {
  const pathParts = (enumeratedPath || "").split(",").slice(1); // Skip the first empty or "Earth" part
  const levels = {};
  for (let i = 0; i < maxLevels; i++) {
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

    const allEntitiesFromJSON = jsonData.contains;
    console.log(`Found ${allEntitiesFromJSON.length} total entities in JSON.`);

    // First pass: Extract geonames and their relevant paths
    const geonamesById = new Map();
    for (const entity of allEntitiesFromJSON) {
      if (entity.category === "geonames") {
        // We need path_level_2 (Continent) to path_level_5 (Area)
        const paths = parseEnumeratedPath(
          entity.enumeratedPath,
          MAX_GEONAME_PATH_LEVELS_TO_CONSIDER
        );
        geonamesById.set(entity._id, {
          name: entity.name,
          continent: paths.path_level_2,
          country: paths.path_level_3,
          region: paths.path_level_4,
          area: paths.path_level_5, // Added Area
        });
      }
    }
    console.log(`Processed ${geonamesById.size} geonames entities for lookup.`);

    const csvHeaders = [
      "id",
      "spot_name",
      "latitude",
      "longitude",
      "continent",
      "country",
      "region",
      "area", // Added area column
      "type",
      "category",
      "has_spots_flag",
      "surfline_www_url",
      "surfline_travel_url",
      "original_depth",
      "original_enumerated_path",
      "lies_in_1",
      "lies_in_2",
      "lies_in_3",
    ];
    let csvContent = csvHeaders.join(",") + "\n";
    let spotsProcessedCount = 0;
    // let nonSpotEntitiesSkipped = 0; // Optional: if you want to count them

    // Second pass: Process spots and link to geonames hierarchy
    for (const entity of allEntitiesFromJSON) {
      if (entity.type === "spot") {
        spotsProcessedCount++;
        let spotContinent = null;
        let spotCountry = null;
        let spotRegion = null;
        let spotArea = null; // Added Area

        const liesInIds = entity.liesIn || [];
        for (const parentId of liesInIds) {
          if (geonamesById.has(parentId)) {
            const geonameParent = geonamesById.get(parentId);
            spotContinent = geonameParent.continent || spotContinent;
            spotCountry = geonameParent.country || spotCountry;
            spotRegion = geonameParent.region || spotRegion;
            spotArea = geonameParent.area || spotArea; // Get area
            // If we find a geoname parent that provides all levels, we can break
            // or we can let it iterate to see if a "closer" geoname parent in liesIn provides more specific info
            // For now, let's assume the first one that provides data is good enough or we take the most complete.
            // A simple strategy: take the first one that gives us something.
            if (spotContinent && spotCountry && spotRegion && spotArea) break;
          }
        }

        if (
          !spotContinent ||
          !spotCountry ||
          !spotRegion /* || !spotArea // Area might be optional */
        ) {
          // console.warn(`Spot ID ${entity._id} (${entity.name}) could not fully resolve geoname hierarchy. C: ${spotContinent}, Co: ${spotCountry}, R: ${spotRegion}, A: ${spotArea}. LiesIn: [${liesInIds.join(',')}]`);
        }

        let latValue = getNestedValue(entity, "location.coordinates.1");
        let lonValue = getNestedValue(entity, "location.coordinates.0");
        let parsedLat = parseFloat(latValue);
        let parsedLon = parseFloat(lonValue);
        const finalLat = !isNaN(parsedLat) ? parsedLat : "";
        const finalLon = !isNaN(parsedLon) ? parsedLon : "";

        const row = [
          entity._id || "",
          `"${(entity.name || "").replace(/"/g, '""')}"`,
          finalLat,
          finalLon,
          `"${(spotContinent || "").replace(/"/g, '""')}"`,
          `"${(spotCountry || "").replace(/"/g, '""')}"`,
          `"${(spotRegion || "").replace(/"/g, '""')}"`,
          `"${(spotArea || "").replace(/"/g, '""')}"`, // Added area value
          entity.type || "",
          entity.category || "",
          entity.hasSpots === undefined ? "" : entity.hasSpots,
          getSurflineLink(getNestedValue(entity, "associated.links"), "www") ||
            "",
          getSurflineLink(
            getNestedValue(entity, "associated.links"),
            "travel"
          ) || "",
          entity.depth || "",
          `"${(entity.enumeratedPath || "").replace(/"/g, '""')}"`,
          `"${(liesInIds[0] || "").replace(/"/g, '""')}"`,
          `"${(liesInIds[1] || "").replace(/"/g, '""')}"`,
          `"${(liesInIds[2] || "").replace(/"/g, '""')}"`,
        ];
        csvContent +=
          row
            .map((val) => (val === null || val === undefined ? "" : val))
            .join(",") + "\n";
      } else {
        // nonSpotEntitiesSkipped++; // Optional: count skipped entities
      }
    }

    fs.writeFileSync(OUTPUT_CSV_PATH, csvContent);
    console.log(
      `Successfully processed ${spotsProcessedCount} spots. Output CSV written to: ${OUTPUT_CSV_PATH}`
    );
    // if (nonSpotEntitiesSkipped > 0) { // Optional
    //   console.log(`Skipped ${nonSpotEntitiesSkipped} non-spot entities.`);
    // }
  } catch (error) {
    console.error("Error processing spots:", error);
  }
}

processSpots();
