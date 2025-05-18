import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import { supabase } from "@/lib/supabase";
import { Check, Search } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DisplayItem {
  name: string;
  isCategory: boolean;
  id?: string;
  lat?: number;
  lng?: number;
}

interface Section {
  title: string;
  data: DisplayItem[];
}

interface LocationPickerProps {
  selectedLocation: string;
  onSelectLocation: (
    locationName: string,
    locationId?: string,
    lat?: number,
    lng?: number
  ) => void;
  onClose?: () => void;
  onDone?: () => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocation,
  onSelectLocation,
  onClose,
  onDone,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Hierarchical navigation state
  const [hierarchy, setHierarchy] = useState<{
    continents: string[];
    countries: Record<string, string[]>;
    regions: Record<string, string[]>;
    areas: Record<string, string[]>;
  }>({
    continents: [],
    countries: {},
    regions: {},
    areas: {},
  });

  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
  const [sectionTitle, setSectionTitle] = useState("Continents");

  // Initial fetch for continents
  useEffect(() => {
    fetchHierarchyLevel("continents");
  }, []);

  // This will fetch data for any level of the hierarchy
  const fetchHierarchyLevel = useCallback(
    async (
      level: "continents" | "countries" | "regions" | "areas" | "spots",
      parent?: {
        continent?: string;
        country?: string;
        region?: string;
        area?: string;
      }
    ) => {
      setIsLoading(true);
      setLoadingError(null);

      try {
        let queryResult;
        let title = "";

        // Configure the query based on the hierarchy level
        switch (level) {
          case "continents":
            title = "Continents";
            queryResult = await supabase.from("spots").select("continent");
            break;

          case "countries":
            if (!parent?.continent)
              throw new Error("Continent is required for countries");
            title = `Countries in ${parent.continent}`;
            queryResult = await supabase
              .from("spots")
              .select("country")
              .eq("continent", parent.continent);
            break;

          case "regions":
            if (!parent?.continent || !parent?.country)
              throw new Error("Continent and country are required for regions");
            title = `Regions in ${parent.country}`;
            queryResult = await supabase
              .from("spots")
              .select("region")
              .eq("continent", parent.continent)
              .eq("country", parent.country);
            break;

          case "areas":
            if (!parent?.continent || !parent?.country || !parent?.region)
              throw new Error(
                "Continent, country, and region are required for areas"
              );
            title = `Areas in ${parent.region}`;
            queryResult = await supabase
              .from("spots")
              .select("area")
              .eq("continent", parent.continent)
              .eq("country", parent.country)
              .eq("region", parent.region);
            break;

          case "spots":
            if (!parent)
              throw new Error("Parent location is required for spots");
            title = parent.area
              ? `Spots in ${parent.area}`
              : `Spots in ${parent.region}`;

            // Build the query
            let spotsQuery = supabase
              .from("spots")
              .select("id, spot_name, latitude, longitude")
              .eq("continent", parent.continent!);

            if (parent.country)
              spotsQuery = spotsQuery.eq("country", parent.country);
            if (parent.region)
              spotsQuery = spotsQuery.eq("region", parent.region);
            if (parent.area) spotsQuery = spotsQuery.eq("area", parent.area);

            queryResult = await spotsQuery;
            break;
        }

        const { data, error } = queryResult;

        if (error) throw error;

        if (data && data.length > 0) {
          // Process the results based on the level
          if (level === "spots") {
            // These are actual spot locations, not categories
            const spotsData = data
              .map((spot: any) => ({
                name: spot.spot_name,
                isCategory: false,
                id: spot.id.toString(),
                lat: spot.latitude,
                lng: spot.longitude,
              }))
              .sort((a, b) => a.name.localeCompare(b.name));

            setDisplayItems(spotsData);
          } else {
            // Extract unique values for the current field
            const fieldToSelect =
              level === "continents"
                ? "continent"
                : level === "countries"
                ? "country"
                : level === "regions"
                ? "region"
                : "area";

            const uniqueValues = Array.from(
              new Set(
                data.map((item: any) => item[fieldToSelect]).filter(Boolean)
              )
            ).sort();

            // Update the display items as categories
            const items = uniqueValues.map((name) => ({
              name,
              isCategory: true,
            }));

            setDisplayItems(items);

            // Update our hierarchy state to cache results
            if (level === "continents") {
              setHierarchy((prev) => ({
                ...prev,
                continents: uniqueValues,
              }));
            } else if (level === "countries" && parent?.continent) {
              setHierarchy((prev) => ({
                ...prev,
                countries: {
                  ...prev.countries,
                  [parent.continent as string]: uniqueValues,
                },
              }));
            } else if (
              level === "regions" &&
              parent?.continent &&
              parent?.country
            ) {
              const key = `${parent.continent}:${parent.country}`;
              setHierarchy((prev) => ({
                ...prev,
                regions: {
                  ...prev.regions,
                  [key]: uniqueValues,
                },
              }));
            } else if (
              level === "areas" &&
              parent?.continent &&
              parent?.country &&
              parent?.region
            ) {
              const key = `${parent.continent}:${parent.country}:${parent.region}`;
              setHierarchy((prev) => ({
                ...prev,
                areas: {
                  ...prev.areas,
                  [key]: uniqueValues,
                },
              }));
            }

            // If we fetched areas but there are none, directly fetch spots
            if (level === "areas" && uniqueValues.length === 0 && parent) {
              return await fetchHierarchyLevel("spots", parent);
            }
          }

          setSectionTitle(title);
        } else {
          // No results found
          setDisplayItems([]);
          setSectionTitle(`No ${level} found`);

          // If we're looking for areas but none found, try to fetch spots directly
          if (level === "areas" && parent) {
            return await fetchHierarchyLevel("spots", parent);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${level}:`, error);
        setLoadingError(`Failed to load ${level}. Please try again.`);
        setDisplayItems([]);
        setSectionTitle(`Error loading ${level}`);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Handle navigation through the hierarchy
  const handleItemPress = useCallback(
    (item: DisplayItem) => {
      if (item.isCategory) {
        // Navigate deeper into the hierarchy
        const newPath = [...currentPath, item.name];
        setCurrentPath(newPath);

        // Determine what to fetch next based on our current depth
        const depth = newPath.length;
        const continent = depth >= 1 ? newPath[0] : undefined;
        const country = depth >= 2 ? newPath[1] : undefined;
        const region = depth >= 3 ? newPath[2] : undefined;
        const area = depth >= 4 ? newPath[3] : undefined;

        if (depth === 1) {
          // Clicked a continent, fetch countries
          fetchHierarchyLevel("countries", { continent });
        } else if (depth === 2) {
          // Clicked a country, fetch regions
          fetchHierarchyLevel("regions", { continent, country });
        } else if (depth === 3) {
          // Clicked a region, fetch areas
          fetchHierarchyLevel("areas", { continent, country, region });
        } else if (depth === 4) {
          // Clicked an area, fetch spots
          fetchHierarchyLevel("spots", { continent, country, region, area });
        }
      } else {
        // Selected an actual spot
        onSelectLocation(item.name, item.id, item.lat, item.lng);
      }
    },
    [currentPath, fetchHierarchyLevel, onSelectLocation]
  );

  // Handle back navigation
  const handleBackPress = useCallback(() => {
    if (searchQuery) {
      // Clear search and return to previous view
      setSearchQuery("");

      // Restore the display items based on current path
      const depth = currentPath.length;
      if (depth === 0) {
        fetchHierarchyLevel("continents");
      } else if (depth === 1) {
        const continent = currentPath[0];
        fetchHierarchyLevel("countries", { continent });
      } else if (depth === 2) {
        const continent = currentPath[0];
        const country = currentPath[1];
        fetchHierarchyLevel("regions", { continent, country });
      } else if (depth === 3) {
        const continent = currentPath[0];
        const country = currentPath[1];
        const region = currentPath[2];
        fetchHierarchyLevel("areas", { continent, country, region });
      } else if (depth === 4) {
        const continent = currentPath[0];
        const country = currentPath[1];
        const region = currentPath[2];
        const area = currentPath[3];
        fetchHierarchyLevel("spots", { continent, country, region, area });
      }
    } else if (currentPath.length > 0) {
      // Go back one level in the hierarchy
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      // Determine what to display based on the new path length
      const depth = newPath.length;
      if (depth === 0) {
        fetchHierarchyLevel("continents");
      } else if (depth === 1) {
        const continent = newPath[0];
        fetchHierarchyLevel("countries", { continent });
      } else if (depth === 2) {
        const continent = newPath[0];
        const country = newPath[1];
        fetchHierarchyLevel("regions", { continent, country });
      } else if (depth === 3) {
        const continent = newPath[0];
        const country = newPath[1];
        const region = newPath[2];
        fetchHierarchyLevel("areas", { continent, country, region });
      }
    }
  }, [currentPath, fetchHierarchyLevel, searchQuery]);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery || searchQuery.length < 2) return;

      setIsLoading(true);
      setLoadingError(null);
      setSectionTitle(`Searching for "${searchQuery}"...`);
      setDisplayItems([]);

      try {
        const lowerCaseQuery = searchQuery.toLowerCase();

        // Use a single query with ilike and limit operators
        const { data, error } = await supabase
          .from("spots")
          .select(
            "id, spot_name, latitude, longitude, continent, country, region, area"
          )
          .or(
            `spot_name.ilike.%${lowerCaseQuery}%,country.ilike.%${lowerCaseQuery}%,region.ilike.%${lowerCaseQuery}%,area.ilike.%${lowerCaseQuery}%`
          )
          .limit(50); // Reasonable limit for search results

        if (error) throw error;

        if (data && data.length > 0) {
          const searchResults = data
            .map((spot: any) => ({
              name: spot.spot_name,
              isCategory: false,
              id: spot.id.toString(),
              lat: spot.latitude,
              lng: spot.longitude,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          setDisplayItems(searchResults);
          setSectionTitle(`Results for "${searchQuery}"`);
        } else {
          setDisplayItems([]);
          setSectionTitle(`No results for "${searchQuery}"`);
        }
      } catch (error) {
        console.error("Error during search:", error);
        setLoadingError(`Search failed. Please try again.`);
        setDisplayItems([]);
        setSectionTitle(`Error searching for "${searchQuery}"`);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        performSearch();
      } else if (searchQuery === "") {
        // If search is cleared, restore the display based on current path
        const depth = currentPath.length;
        if (depth === 0) {
          fetchHierarchyLevel("continents");
        } else if (depth === 1) {
          const continent = currentPath[0];
          fetchHierarchyLevel("countries", { continent });
        } else if (depth === 2) {
          const continent = currentPath[0];
          const country = currentPath[1];
          fetchHierarchyLevel("regions", { continent, country });
        } else if (depth === 3) {
          const continent = currentPath[0];
          const country = currentPath[1];
          const region = currentPath[2];
          fetchHierarchyLevel("areas", { continent, country, region });
        } else if (depth === 4) {
          const continent = currentPath[0];
          const country = currentPath[1];
          const region = currentPath[2];
          const area = currentPath[3];
          fetchHierarchyLevel("spots", { continent, country, region, area });
        }
      }
    }, 500); // Debounce search for 500ms

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, currentPath, fetchHierarchyLevel]);

  const getSectionedData = (): Section[] => {
    return [{ title: sectionTitle, data: displayItems }];
  };

  const ListItem = React.memo(
    ({
      item,
      selectedItemName,
      onItemPress,
    }: {
      item: DisplayItem;
      selectedItemName: string;
      onItemPress: (item: DisplayItem) => void;
    }) => {
      return (
        <TouchableOpacity
          style={[
            styles.locationItem,
            !item.isCategory &&
              selectedItemName === item.name &&
              styles.selectedItem,
          ]}
          onPress={() => onItemPress(item)}
        >
          <Text style={styles.locationName}>{item.name}</Text>
          {!item.isCategory && selectedItemName === item.name && (
            <Check
              size={20}
              color={COLORS.core.sunsetCoral}
              style={styles.checkIconStyle}
            />
          )}
          {item.isCategory && (
            <Text style={styles.categoryIndicator}>{">"}</Text>
          )}
        </TouchableOpacity>
      );
    }
  );
  ListItem.displayName = "ListItem";

  const listOrLoadingIndicator = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={COLORS.core.midnightSurf}
          style={styles.fullScreenLoader}
        />
      );
    }

    if (loadingError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{loadingError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // Retry the current level fetch
              const depth = currentPath.length;
              if (depth === 0) {
                fetchHierarchyLevel("continents");
              } else if (depth === 1) {
                const continent = currentPath[0];
                fetchHierarchyLevel("countries", { continent });
              } else if (depth === 2) {
                const continent = currentPath[0];
                const country = currentPath[1];
                fetchHierarchyLevel("regions", { continent, country });
              } else if (depth === 3) {
                const continent = currentPath[0];
                const country = currentPath[1];
                const region = currentPath[2];
                fetchHierarchyLevel("areas", { continent, country, region });
              } else if (depth === 4) {
                const continent = currentPath[0];
                const country = currentPath[1];
                const region = currentPath[2];
                const area = currentPath[3];
                fetchHierarchyLevel("spots", {
                  continent,
                  country,
                  region,
                  area,
                });
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.listWithHeaderContainer}>
        {currentPath.length > 0 || searchQuery ? (
          <View style={styles.normalHeader}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>
                {searchQuery ? "< Clear Search" : "< Back"}
              </Text>
            </TouchableOpacity>

            {!searchQuery && currentPath.length > 0 && (
              <Text
                style={styles.breadcrumbs}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentPath.join(" > ")}
              </Text>
            )}
          </View>
        ) : null}

        <SectionList<DisplayItem, Section>
          sections={getSectionedData()}
          keyExtractor={(item, index) => item.name + index}
          style={styles.listStyle}
          renderItem={({ item }: { item: DisplayItem }) => (
            <ListItem
              item={item}
              selectedItemName={selectedLocation}
              onItemPress={handleItemPress}
            />
          )}
          renderSectionHeader={() => null} // No section headers, using breadcrumbs instead
          ListEmptyComponent={
            <Text style={styles.emptyListText}>
              {searchQuery
                ? `No results for "${searchQuery}"`
                : displayItems.length === 0
                ? "No locations found."
                : ""}
            </Text>
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search
          size={20}
          color={COLORS.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a surf spot..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={COLORS.text.secondary}
        />
      </View>

      {listOrLoadingIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48, // Set a fixed height
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text.primary,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    height: 48, // Match container height
    paddingVertical: 0, // Remove padding to align text properly
  },
  listStyle: {
    flex: 1,
  },
  sectionHeader: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.core.boardBlack,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  locationName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
    flex: 1,
  },
  selectedItem: {
    // backgroundColor: COLORS.neutral[100],
  },
  categoryIndicator: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  checkIconStyle: {
    marginLeft: 8,
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  backButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  breadcrumbs: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 4,
    flexShrink: 1,
    flexWrap: "nowrap",
  },
  emptyListText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.core.seafoamGrey,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listWithHeaderContainer: {
    flex: 1,
    position: "relative",
    overflow: "visible",
  },
  normalHeader: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
