import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { ChevronDown, X, MapPin } from 'lucide-react-native';

interface LocationPickerProps {
  locations: string[];
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  locations,
  selectedLocation,
  onSelectLocation
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (location: string) => {
    onSelectLocation(location);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={() => setModalVisible(true)}
      >
        <MapPin size={18} color={COLORS.neutral[500]} style={styles.icon} />
        <Text style={[
          styles.selectorText,
          !selectedLocation && styles.placeholderText
        ]}>
          {selectedLocation || 'Select a surf spot'}
        </Text>
        <ChevronDown size={18} color={COLORS.neutral[500]} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={locations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.locationItem,
                    selectedLocation === item && styles.selectedItem
                  ]} 
                  onPress={() => handleSelect(item)}
                >
                  <Text 
                    style={[
                      styles.locationItemText,
                      selectedLocation === item && styles.selectedItemText
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedLocation === item && (
                    <View style={styles.checkmark} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
            />
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
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  selectorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.text.disabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  locationItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  selectedItem: {
    backgroundColor: COLORS.primary[50],
  },
  selectedItemText: {
    color: COLORS.primary[600],
    ...TYPOGRAPHY.subtitle,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary[600],
  },
});