import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { ChevronDown, MapPin, Search, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

interface LocationPickerProps {
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}

// Mock data - replace with Supabase data
const MOCK_LOCATIONS = [
  { id: '1', name: 'Malibu Beach', lat: 34.0259, lng: -118.7798 },
  { id: '2', name: 'Huntington Beach', lat: 33.6595, lng: -118.0043 },
  { id: '3', name: 'Newport Beach', lat: 33.6189, lng: -117.9289 },
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

  const filteredLocations = MOCK_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (locationName: string) => {
    onSelectLocation(locationName);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <MapPin size={20} color={COLORS.text.secondary} />
        <Text style={[styles.selectorText, !selectedLocation && styles.placeholder]}>
          {selectedLocation || 'Select location'}
        </Text>
        <ChevronDown size={20} color={COLORS.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color={COLORS.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search locations..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {showMap && userLocation && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {filteredLocations.map((location) => (
                    <Marker
                      key={location.id}
                      coordinate={{
                        latitude: location.lat,
                        longitude: location.lng,
                      }}
                      title={location.name}
                      onPress={() => handleSelectLocation(location.name)}
                    />
                  ))}
                </MapView>
              </View>
            )}

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowMap(!showMap)}
            >
              <Text style={styles.toggleButtonText}>
                {showMap ? 'Show List View' : 'Show Map View'}
              </Text>
            </TouchableOpacity>

            {!showMap && (
              <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.locationItem,
                      selectedLocation === item.name && styles.selectedItem,
                    ]}
                    onPress={() => handleSelectLocation(item.name)}
                  >
                    <Text style={styles.locationName}>{item.name}</Text>
                    {selectedLocation === item.name && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    marginTop: 8,
  },
  selectorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    flex: 1,
    marginLeft: 8,
  },
  placeholder: {
    color: COLORS.text.secondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.neutral[100],
    margin: 16,
    borderRadius: 8,
  },
  searchInput: {
    ...TYPOGRAPHY.body,
    flex: 1,
    marginLeft: 8,
    color: COLORS.text.primary,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  locationName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  selectedItem: {
    backgroundColor: COLORS.primary[50],
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[600],
  },
  mapContainer: {
    height: 300,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  toggleButton: {
    padding: 12,
    backgroundColor: COLORS.primary[50],
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  toggleButtonText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primary[600],
  },
});