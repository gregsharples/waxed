import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import { supabase } from "@/lib/supabase";
import * as Location from "expo-location";
import { Check, Crosshair, Search } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

interface SpotData {
  id: string;
  name: string; // Corresponds to spot_name from DB
  lat: number;
  lng: number;
  isFavorite: boolean;
  continent?: string;
  country?: string;
  region?: string;
  area?: string;
  type?: string;
  category?: string;
}

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

// Interface for items that are definitely spots and can be shown on the map
interface MappableSpot {
  name: string;
  isCategory: false;
  id: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  selectedLocation: string;
  onSelectLocation: (
    locationName: string,
    locationId?: string,
    lat?: number,
    lng?: number
  ) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [currentUserLocation, setCurrentUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const mapViewRef = useRef<MapView>(null);

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

  // For map view
  const [visibleSpots, setVisibleSpots] = useState<MappableSpot[]>([]);

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setCurrentUserLocation(location);
        }
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    })();
  }, []);

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

            // For map view
            const mappableSpots = spotsData.filter(
              (item): item is MappableSpot =>
                !item.isCategory &&
                typeof item.id === "string" &&
                typeof item.lat === "number" &&
                typeof item.lng === "number"
            );
            setVisibleSpots(mappableSpots);
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

          // Update visible spots for map view
          const mappableSpots = searchResults.filter(
            (item): item is MappableSpot =>
              !item.isCategory &&
              typeof item.id === "string" &&
              typeof item.lat === "number" &&
              typeof item.lng === "number"
          );
          setVisibleSpots(mappableSpots);
        } else {
          setDisplayItems([]);
          setSectionTitle(`No results for "${searchQuery}"`);
          setVisibleSpots([]);
        }
      } catch (error) {
        console.error("Error during search:", error);
        setLoadingError(`Search failed. Please try again.`);
        setDisplayItems([]);
        setSectionTitle(`Error searching for "${searchQuery}"`);
        setVisibleSpots([]);
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

  // Handle tab changes
  useEffect(() => {
    if (activeTab === "map" && visibleSpots.length === 0 && !searchQuery) {
      // If switching to map view with no spots visible, try to fetch spots for the current level
      const depth = currentPath.length;
      if (depth >= 3) {
        // We're at a region or deeper, try to fetch spots
        const continent = currentPath[0];
        const country = currentPath[1];
        const region = currentPath[2];
        const area = depth >= 4 ? currentPath[3] : undefined;

        fetchHierarchyLevel("spots", {
          continent,
          country,
          region,
          area,
        });
      }
    }
  }, [
    activeTab,
    visibleSpots.length,
    currentPath,
    fetchHierarchyLevel,
    searchQuery,
  ]);

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

  const goToCurrentUserLocation = useCallback(() => {
    if (mapViewRef.current && currentUserLocation) {
      mapViewRef.current.animateToRegion(
        {
          latitude: currentUserLocation.coords.latitude,
          longitude: currentUserLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.002,
        },
        1000
      );
    }
  }, [currentUserLocation]);

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
        ListHeaderComponent={
          currentPath.length > 0 || searchQuery ? (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>
                {searchQuery ? "< Clear Search" : "< Back"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.customSectionHeader}>
            <Text style={styles.sectionHeader}>{title}</Text>
            {!searchQuery && currentPath.length > 0 && (
              <Text style={styles.breadcrumbs}>{currentPath.join(" > ")}</Text>
            )}
          </View>
        )}
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
    );
  };

  return (
    <View style={styles.pickerSheetContent}>
      <View style={styles.searchContainer}>
        <Search
          size={20}
          color={COLORS.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "list" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "list" && styles.activeTabButtonText,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "map" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("map")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "map" && styles.activeTabButtonText,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "map" && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapViewRef}
            style={styles.map}
            zoomEnabled={true}
            scrollEnabled={true}
            initialRegion={
              currentUserLocation
                ? {
                    latitude: currentUserLocation.coords.latitude,
                    longitude: currentUserLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }
                : undefined
            }
          >
            {visibleSpots.map((spot: MappableSpot) => (
              <Marker
                key={spot.id}
                coordinate={{
                  latitude: spot.lat,
                  longitude: spot.lng,
                }}
                title={spot.name}
                onPress={() =>
                  onSelectLocation(spot.name, spot.id, spot.lat, spot.lng)
                }
              />
            ))}
          </MapView>
          {currentUserLocation && (
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={goToCurrentUserLocation}
            >
              <Crosshair size={24} color={COLORS.core.boardBlack} />
            </TouchableOpacity>
          )}
          {isLoading && (
            <View style={styles.mapLoadingOverlay}>
              <ActivityIndicator
                size="large"
                color={COLORS.core.midnightSurf}
              />
            </View>
          )}
          {visibleSpots.length === 0 && !isLoading && (
            <View style={styles.mapEmptyOverlay}>
              <Text style={styles.mapEmptyText}>
                {searchQuery
                  ? "No spots found for your search."
                  : currentPath.length <= 2
                  ? "Navigate to a region to see spots."
                  : "No spots available in this area."}
              </Text>
            </View>
          )}
        </View>
      )}

      {activeTab === "list" && listOrLoadingIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerSheetContent: {
    width: "100%",
    flex: 1,
    paddingBottom: 20,
    flexDirection: "column",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "white",
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.core.seafoamGrey,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.text.primary,
    height: 36,
    textAlignVertical: "center",
  },
  listStyle: {
    flex: 1,
  },
  sectionHeader: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.core.boardBlack,
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  backButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  customSectionHeader: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  breadcrumbs: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    paddingBottom: 5,
    marginTop: -5,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    position: "relative",
  },
  map: {
    flex: 1,
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 50,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mapLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  mapEmptyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapEmptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: "center",
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: COLORS.core.boardBlack,
    backgroundColor: "transparent",
  },
  tabButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  activeTabButtonText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.core.boardBlack,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
