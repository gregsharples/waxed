import {
  CarouselPickerOption,
  ImageCarouselPicker,
} from "@/components/common/ImageCarouselPicker";
import { COLORS } from "@/constants/Colors";
import {
  CROWD_OPTIONS,
  WAVE_HEIGHT_OPTIONS,
  WAVE_QUALITY_OPTIONS,
} from "@/constants/ConditionOptions"; // Import new constants
import { TYPOGRAPHY } from "@/constants/Typography";
import { CrowdOption, WaveHeightOption, WaveQualityOption } from "@/types";
import { Droplet, TrendingUp, Users } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConditionsPickerProps {
  selectedWaveHeight?: WaveHeightOption;
  onWaveHeightChange: (option: WaveHeightOption) => void;
  selectedWaveQuality?: WaveQualityOption;
  onWaveQualityChange: (option: WaveQualityOption) => void;
  selectedCrowd?: CrowdOption;
  onCrowdChange: (option: CrowdOption) => void;
}

export const ConditionsPicker: React.FC<ConditionsPickerProps> = ({
  selectedWaveHeight,
  onWaveHeightChange,
  selectedWaveQuality,
  onWaveQualityChange,
  selectedCrowd,
  onCrowdChange,
}) => {
  const [showWaveHeightPicker, setShowWaveHeightPicker] = useState(false);
  const [showWaveQualityPicker, setShowWaveQualityPicker] = useState(false);
  const [showCrowdPicker, setShowCrowdPicker] = useState(false); // Added state for crowd picker

  const mapWaveOptionsToCarousel = (
    options: (WaveHeightOption | WaveQualityOption)[]
  ): CarouselPickerOption[] => {
    return options.map((opt) => ({
      id: opt.id,
      label: opt.label,
      imageUri: opt.imageUri,
      description: (opt as WaveQualityOption).description,
      metric: (opt as WaveHeightOption).metric,
    }));
  };

  const mapCrowdOptionsToCarousel = (
    options: CrowdOption[]
  ): CarouselPickerOption[] => {
    return options.map((opt) => ({
      id: opt.id,
      label: opt.label,
      imageUri: opt.imageUri,
      description: opt.description, // Pass the description
    }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Icon removed as per request */}
        <Text style={styles.cardTitle}>Conditions</Text>
      </View>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowWaveHeightPicker(true)}
      >
        <Droplet
          size={18}
          color={COLORS.text.secondary}
          style={styles.iconStyle}
        />
        <Text style={styles.pickerButtonText}>
          {selectedWaveHeight ? selectedWaveHeight.label : "Select Wave Height"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowWaveQualityPicker(true)}
      >
        <TrendingUp
          size={18}
          color={COLORS.text.secondary}
          style={styles.iconStyle}
        />
        <Text style={styles.pickerButtonText}>
          {selectedWaveQuality
            ? selectedWaveQuality.label
            : "Select Wave Quality"}
        </Text>
      </TouchableOpacity>

      {/* Crowd Picker Trigger */}
      <TouchableOpacity
        style={styles.pickerButton} // Reuse style
        onPress={() => setShowCrowdPicker(true)}
      >
        <Users
          size={18}
          color={COLORS.text.secondary}
          style={styles.iconStyle}
        />
        <Text style={styles.pickerButtonText}>
          {selectedCrowd ? selectedCrowd.label : "Select Crowd Level"}
        </Text>
      </TouchableOpacity>

      <ImageCarouselPicker
        visible={showWaveHeightPicker}
        options={mapWaveOptionsToCarousel(WAVE_HEIGHT_OPTIONS)}
        title="Select Wave Height"
        onClose={() => setShowWaveHeightPicker(false)}
        onSelectOption={(option) => {
          const selected = WAVE_HEIGHT_OPTIONS.find(
            (opt) => opt.id === option.id
          );
          if (selected) onWaveHeightChange(selected);
        }}
        currentOption={
          selectedWaveHeight
            ? mapWaveOptionsToCarousel([selectedWaveHeight])[0]
            : undefined
        }
      />

      <ImageCarouselPicker
        visible={showWaveQualityPicker}
        options={mapWaveOptionsToCarousel(WAVE_QUALITY_OPTIONS)}
        title="Select Wave Quality"
        onClose={() => setShowWaveQualityPicker(false)}
        onSelectOption={(option) => {
          const selected = WAVE_QUALITY_OPTIONS.find(
            (opt) => opt.id === option.id
          );
          if (selected) onWaveQualityChange(selected);
        }}
        currentOption={
          selectedWaveQuality
            ? mapWaveOptionsToCarousel([selectedWaveQuality])[0]
            : undefined
        }
      />

      <ImageCarouselPicker
        visible={showCrowdPicker}
        options={mapCrowdOptionsToCarousel(CROWD_OPTIONS)}
        title="Select Crowd Level"
        onClose={() => setShowCrowdPicker(false)}
        onSelectOption={(carouselOption) => {
          const selected = CROWD_OPTIONS.find(
            (opt) => opt.id === carouselOption.id
          );
          if (selected) {
            onCrowdChange(selected);
          }
        }}
        currentOption={
          selectedCrowd
            ? mapCrowdOptionsToCarousel([selectedCrowd])[0]
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
    // marginLeft: 8, // Removed as icon is removed
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, // Matched from dateTimeItem
    paddingHorizontal: 16, // Matched from dateTimeItem. The card's padding provides outer spacing.
    // backgroundColor: COLORS.neutral[100], // Ensure no background
    borderRadius: 8, // Retain for touch feedback area if desired, though not strictly for visual match if items are full width
    // marginBottom: 12, // Removed to reduce spacing
    // borderBottomWidth: 1, // Removed border
    // borderBottomColor: COLORS.neutral[200], // Removed border
  },
  iconStyle: {
    marginRight: 6, // Matched from dateTimeItem
  },
  pickerButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    // Text will naturally align right due to justifyContent: 'space-between' and icon on left
  },
  // Removed crowdPickerContainer, crowdLabel, crowdButtonsRow, crowdButton, crowdButtonSelected, crowdButtonText, crowdButtonTextSelected
});
