import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import * as Location from "expo-location";
import { Check, Crosshair, Search } from "lucide-react-native"; // Reverted to Crosshair
import React, { useEffect, useRef, useState } from "react"; // Added useRef
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"; // Removed Modal
import MapView, { Marker } from "react-native-maps";

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  isFavorite: boolean;
}

interface Section {
  title: string;
  data: Location[];
}

interface LocationPickerProps {
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
  // modalVisible and setModalVisible will be controlled by the parent component (LogSessionScreen)
  // We might need a prop to close the sheet from within this component if a selection is made directly
  // For now, the "Done" button in LogSessionScreen handles closing.
}

// Mock data - replace with Supabase data
const MOCK_LOCATIONS = [
  {
    id: "1",
    name: "Malibu Beach",
    lat: 34.0259,
    lng: -118.7798,
    region: "California",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Huntington Beach",
    lat: 33.6595,
    lng: -118.0043,
    region: "California",
    isFavorite: false,
  },
  {
    id: "3",
    name: "Newport Beach",
    lat: 33.6189,
    lng: -117.9289,
    region: "California",
    isFavorite: false,
  },
  {
    id: "4",
    name: "Santa Monica Pier",
    lat: 34.0105,
    lng: -118.4969,
    region: "California",
    isFavorite: true,
  },
  {
    id: "5",
    name: "Venice Beach",
    lat: 33.985,
    lng: -118.4695,
    region: "California",
    isFavorite: false,
  },
  {
    id: "6",
    name: "Zuma Beach",
    lat: 34.0214,
    lng: -118.8297,
    region: "California",
    isFavorite: false,
  },
  {
    id: "7",
    name: "El Porto Beach",
    lat: 33.8979,
    lng: -118.4137,
    region: "California",
    isFavorite: false,
  },
  {
    id: "8",
    name: "Surfrider Beach",
    lat: 34.0325,
    lng: -118.7945,
    region: "California",
    isFavorite: true,
  },
  {
    id: "9",
    name: "Pipeline",
    lat: 21.6649,
    lng: -158.053,
    region: "Hawaii",
    isFavorite: true,
  },
  {
    id: "10",
    name: "Waimea Bay",
    lat: 21.6426,
    lng: -158.0647,
    region: "Hawaii",
    isFavorite: false,
  },
  {
    id: "11",
    name: "Uluwatu",
    lat: -8.815,
    lng: 115.0884,
    region: "Indonesia",
    isFavorite: false,
  },
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserLocation, setCurrentUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const mapViewRef = useRef<MapView>(null); // Ref for MapView

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentUserLocation(location);
      }
    })();
  }, []);

  // Process locations for SectionList
  const getSectionedLocations = (): Section[] => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const queryFilteredLocations = MOCK_LOCATIONS.filter((location) =>
      location.name.toLowerCase().includes(lowerCaseQuery)
    );

    const favorites = queryFilteredLocations.filter(
      (location) => location.isFavorite
    );
    const nonFavoritesByRegion: { [key: string]: Location[] } = {};

    queryFilteredLocations.forEach((location) => {
      if (!location.isFavorite) {
        if (!nonFavoritesByRegion[location.region]) {
          nonFavoritesByRegion[location.region] = [];
        }
        nonFavoritesByRegion[location.region].push(location);
      }
    });

    const sections: Section[] = [];

    if (favorites.length > 0) {
      sections.push({ title: "Favorites", data: favorites });
    }

    for (const region in nonFavoritesByRegion) {
      if (nonFavoritesByRegion[region].length > 0) {
        sections.push({ title: region, data: nonFavoritesByRegion[region] });
      }
    }
    return sections;
  };

  const sectionedLocations = getSectionedLocations();

  // For map markers, we still need a flat list of filtered locations
  const mapFilteredLocations = MOCK_LOCATIONS.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // When a location is selected from the list or map, we call onSelectLocation.
  // The parent (LogSessionScreen) will then use its "Done" button to confirm and close the sheet.
  const handleSelectLocation = (locationName: string) => {
    onSelectLocation(locationName);
    // No longer setting modalVisible to false here, parent controls sheet visibility.
  };

  // The component now returns the content that was previously inside the Modal.
  // The Modal and the initial TouchableOpacity trigger are removed.

  const goToCurrentUserLocation = () => {
    if (mapViewRef.current && currentUserLocation) {
      mapViewRef.current.animateToRegion(
        {
          latitude: currentUserLocation.coords.latitude,
          longitude: currentUserLocation.coords.longitude,
          latitudeDelta: 0.005, // Significantly more zoomed in for testing
          longitudeDelta: 0.002, // Significantly more zoomed in for testing
        },
        1000 // Animation duration in ms
      );
    }
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
          placeholder="Search locations..." // Changed placeholder text
          value={searchQuery}
          onChangeText={setSearchQuery}
          // textAlignVertical="center" is already there, ensure no conflicting styles
          // For Android, includeFontPadding can sometimes help with precise vertical centering.
          // For iOS, careful padding or line-height adjustments might be needed if still off.
          // The height of 36 and TYPOGRAPHY.body (lineHeight 24) should allow centering.
        />
      </View>

      {/* Tab Buttons */}
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

      {/* Content based on activeTab */}
      {activeTab === "map" && currentUserLocation && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapViewRef} // Assign ref to MapView
            style={styles.map}
            zoomEnabled={true} // Explicitly enable zoom
            scrollEnabled={true} // Explicitly enable scroll
            initialRegion={{
              latitude: currentUserLocation.coords.latitude,
              longitude: currentUserLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {mapFilteredLocations.map(
              (
                location // Use mapFilteredLocations for map markers
              ) => (
                <Marker
                  key={location.id}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                  title={location.name}
                  onPress={() => handleSelectLocation(location.name)}
                />
              )
            )}
          </MapView>
          {currentUserLocation && (
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={goToCurrentUserLocation}
            >
              <Crosshair size={24} color={COLORS.core.boardBlack} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab === "list" && (
        <SectionList
          sections={sectionedLocations}
          keyExtractor={(item, index) => item.id + index}
          style={styles.listStyle}
          renderItem={({ item }: { item: Location }) => (
            <TouchableOpacity
              style={[
                styles.locationItem,
                selectedLocation === item.name && styles.selectedItem,
              ]}
              onPress={() => handleSelectLocation(item.name)}
            >
              <Text style={styles.locationName}>{item.name}</Text>
              {selectedLocation === item.name && (
                <Check
                  size={20}
                  color={COLORS.core.sunsetCoral} // Changed to sunsetCoral
                  style={styles.checkIconStyle}
                />
              )}
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No locations found.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // container style is removed as the component is now meant to be embedded.
  // selector, selectorText, placeholder styles are removed.
  // modalContainer, modalContent, modalHeader, modalTitle styles are removed as they are handled by parent.

  pickerSheetContent: {
    // New top-level style for the content within the parent's sheet
    width: "100%",
    flex: 1, // Allow this container to grow and fill space given by parent
    // backgroundColor: 'white', // Parent sheet will have background
    // borderTopLeftRadius: 20, // Parent sheet will have border radius
    // borderTopRightRadius: 20,
    paddingBottom: 20, // Add some padding at the bottom if needed
    flexDirection: "column", // Ensure children are laid out vertically
  },
  searchContainer: {
    flexDirection: "row", // Keep first occurrence
    alignItems: "center", // Keep first occurrence
    paddingHorizontal: 8, // Reduced padding
    paddingVertical: 6, // Reduced padding
    backgroundColor: "white", // Explicitly 'white' as requested
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    borderRadius: 8, // Standardized border radius
    borderWidth: 1,
    borderColor: COLORS.core.seafoamGrey, // Seafoam green border
  },
  searchIcon: {
    marginRight: 6, // Slightly reduced margin
  },
  searchInput: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.text.primary,
    height: 36,
    textAlignVertical: "center", // Explicitly ensure this is centered
    // If placeholder and typed text align differently, it might be due to font/platform specifics.
    // One might try adding a small paddingTop if text consistently appears low.
    // paddingTop: Platform.OS === 'ios' ? 2 : 0, // Example platform-specific tweak if needed
  },
  listStyle: {
    maxHeight: 300,
  },
  sectionHeader: {
    ...TYPOGRAPHY.subtitle, // Less prominent than h3
    color: COLORS.core.boardBlack,
    backgroundColor: "transparent", // Transparent background
    paddingVertical: 10,
    paddingHorizontal: 8, // Align with list items if they have padding
    marginHorizontal: 16, // If list items have marginHorizontal: 16
    borderBottomWidth: 1,
    borderBottomColor: COLORS.core.boardBlack, // Underline
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12, // Adjust padding as needed
    paddingHorizontal: 16, // Standard list item padding
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100], // Keep light separator for items
  },
  locationName: {
    ...TYPOGRAPHY.caption, // Smaller text for list items
    color: COLORS.text.primary,
    flex: 1, // Allow text to take space and push icon to the end
  },
  selectedItem: {
    // No specific background for selected item, only the checkmark
  },
  // selectedIndicator style is removed as it's replaced by Check icon directly
  checkIconStyle: {
    marginLeft: 8,
  },
  mapContainer: {
    flex: 1, // Make map container fill available space
    marginHorizontal: 0,
    marginBottom: 16,
    borderRadius: 12, // Consistent rounding
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  map: {
    flex: 1,
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10, // Padding around the icon
    borderRadius: 50, // Make it definitely circular (ensure width/height are equal or rely on padding)
    width: 44, // Icon size 22 + 11 padding each side = 44. Or adjust padding.
    height: 44, // Icon size 22 + 11 padding each side = 44
    alignItems: "center", // Center icon horizontally
    justifyContent: "center", // Center icon vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyListText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  // Styles for Tabs
  tabContainer: {
    flexDirection: "row",
    marginBottom: 12, // Slightly reduced margin
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10, // Reduced padding
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // Transparent background
    borderBottomWidth: 2,
    borderBottomColor: "transparent", // Inactive tab has no visible bottom border line
  },
  activeTabButton: {
    borderBottomColor: COLORS.core.boardBlack, // Underline for active tab
    backgroundColor: "transparent", // No background color for active tab itself
  },
  tabButtonText: {
    ...TYPOGRAPHY.body, // Standard body text for inactive tab
    color: COLORS.text.secondary,
  },
  activeTabButtonText: {
    ...TYPOGRAPHY.subtitle, // Slightly more prominent for active tab
    color: COLORS.core.boardBlack,
  },
});
