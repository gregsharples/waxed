import {
  CarouselPickerOption,
  ImageCarouselPicker,
} from "@/components/common/ImageCarouselPicker";
import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import { CrowdOption, WaveHeightOption, WaveQualityOption } from "@/types"; // Added CrowdOption
import { Droplet, TrendingUp, Users } from "lucide-react-native"; // Added User, Users, Smile, Frown
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Mock Data for Pickers
const MOCK_WAVE_HEIGHT_OPTIONS: WaveHeightOption[] = [
  {
    id: "wh1",
    label: "Ankle Biters",
    metric: "< 0.3m",
    imageUri: "https://source.unsplash.com/random/800x600/?small,wave,surf",
  },
  {
    id: "wh2",
    label: "Below Knee",
    metric: "0.3 – 0.5m",
    imageUri: "https://source.unsplash.com/random/800x600/?small,surf,wave",
  },
  {
    id: "wh3",
    label: "Knee to Waist",
    metric: "0.5 – 0.9m",
    imageUri: "https://source.unsplash.com/random/800x600/?medium,wave,surfing",
  },
  {
    id: "wh4",
    label: "Waist to Shoulder",
    metric: "0.9 – 1.2m",
    imageUri: "https://source.unsplash.com/random/800x600/?wave,surfing,ocean",
  },
  {
    id: "wh5",
    label: "Head High",
    metric: "~1.5m",
    imageUri:
      "https://source.unsplash.com/random/800x600/?surfing,wave,headhigh",
  },
  {
    id: "wh6",
    label: "Overhead (1.5x)",
    metric: "1.5 – 2m",
    imageUri: "https://source.unsplash.com/random/800x600/?big,wave,surfing",
  },
  {
    id: "wh7",
    label: "Double Overhead",
    metric: "2 – 3m",
    imageUri: "https://source.unsplash.com/random/800x600/?large,wave,surf",
  },
  {
    id: "wh8",
    label: "Triple / Huge!",
    metric: "3m+",
    imageUri: "https://source.unsplash.com/random/800x600/?huge,wave,ocean",
  },
];

const MOCK_WAVE_QUALITY_OPTIONS: WaveQualityOption[] = [
  {
    id: "wq1",
    label: "Blown Out",
    description: "Total mess — strong wind, no shape",
    imageUri: "https://source.unsplash.com/random/800x600/?windy,ocean,messy",
  },
  {
    id: "wq2",
    label: "Choppy",
    description: "Disorganized, short-period, windy",
    imageUri: "https://source.unsplash.com/random/800x600/?choppy,sea,wind",
  },
  {
    id: "wq3",
    label: "Bumpy",
    description: "Rideable but uneven",
    imageUri: "https://source.unsplash.com/random/800x600/?bumpy,water,ocean",
  },
  {
    id: "wq4",
    label: "Fair",
    description: "Decent shape, a bit soft or inconsistent",
    imageUri: "https://source.unsplash.com/random/800x600/?average,wave,surf",
  },
  {
    id: "wq5",
    label: "Clean",
    description: "Well-formed, consistent lines",
    imageUri: "https://source.unsplash.com/random/800x600/?clean,wave,surfing",
  },
  {
    id: "wq6",
    label: "Glassy",
    description: "Dream conditions, silky smooth surface",
    imageUri:
      "https://source.unsplash.com/random/800x600/?glassy,ocean,perfectwave",
  },
];

const MOCK_CROWD_OPTIONS: CrowdOption[] = [
  // Changed back to CrowdOption[]
  {
    id: "c1",
    label: "Empty",
    iconName: "Smile", // Retaining iconName in case it's useful for other UI later
    imageUri: "https://source.unsplash.com/random/800x600/?beach,empty,calm",
  },
  {
    id: "c2",
    label: "A few surfers",
    iconName: "User",
    imageUri: "https://source.unsplash.com/random/800x600/?beach,few,surfers",
  },
  {
    id: "c3",
    label: "Manageable",
    iconName: "Users",
    imageUri:
      "https://source.unsplash.com/random/800x600/?beach,surfers,moderate",
  },
  {
    id: "c4",
    label: "Busy",
    iconName: "Users",
    imageUri:
      "https://source.unsplash.com/random/800x600/?beach,crowded,surfers",
  },
  {
    id: "c5",
    label: "Hectic",
    iconName: "Frown",
    imageUri:
      "https://source.unsplash.com/random/800x600/?beach,very,crowded,surf",
  },
];

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
      // No description or metric for crowd options
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
        options={mapWaveOptionsToCarousel(MOCK_WAVE_HEIGHT_OPTIONS)}
        title="Select Wave Height"
        onClose={() => setShowWaveHeightPicker(false)}
        onSelectOption={(option) => {
          const selected = MOCK_WAVE_HEIGHT_OPTIONS.find(
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
        options={mapWaveOptionsToCarousel(MOCK_WAVE_QUALITY_OPTIONS)}
        title="Select Wave Quality"
        onClose={() => setShowWaveQualityPicker(false)}
        onSelectOption={(option) => {
          const selected = MOCK_WAVE_QUALITY_OPTIONS.find(
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
        options={mapCrowdOptionsToCarousel(MOCK_CROWD_OPTIONS)}
        title="Select Crowd Level"
        onClose={() => setShowCrowdPicker(false)}
        onSelectOption={(carouselOption) => {
          const selected = MOCK_CROWD_OPTIONS.find(
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
    marginBottom: 12, // Spacing between picker buttons
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
