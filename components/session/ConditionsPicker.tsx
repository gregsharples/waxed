import {
  CarouselPickerOption,
  ImageCarouselPicker,
} from "@/components/common/ImageCarouselPicker";
import { COLORS } from "@/constants/Colors";
// Removed import from "@/constants/ConditionOptions"
import { TYPOGRAPHY } from "@/constants/Typography";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { CrowdOption, WaveHeightOption, WaveQualityOption } from "@/types"; // Ensure these types are updated for DB structure
import { Droplet, TrendingUp, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Static map for image paths to require() results
const imageMap: { [key: string]: number } = {
  "assets/images/conditions/wave-height-wh1.jpg": require("@/assets/images/conditions/wave-height-wh1.jpg"),
  "assets/images/conditions/wave-height-wh2.jpg": require("@/assets/images/conditions/wave-height-wh2.jpg"),
  "assets/images/conditions/wave-height-wh3.jpg": require("@/assets/images/conditions/wave-height-wh3.jpg"),
  "assets/images/conditions/wave-height-wh4.jpg": require("@/assets/images/conditions/wave-height-wh4.jpg"),
  "assets/images/conditions/wave-height-wh5.jpg": require("@/assets/images/conditions/wave-height-wh5.jpg"),
  "assets/images/conditions/wave-height-wh6.jpg": require("@/assets/images/conditions/wave-height-wh6.jpg"),
  "assets/images/conditions/wave-height-wh7.jpg": require("@/assets/images/conditions/wave-height-wh7.jpg"),
  "assets/images/conditions/wave-height-wh8.jpg": require("@/assets/images/conditions/wave-height-wh8.jpg"),
  "assets/images/conditions/wave-quality-wq1.jpg": require("@/assets/images/conditions/wave-quality-wq1.jpg"),
  "assets/images/conditions/wave-quality-wq2.jpg": require("@/assets/images/conditions/wave-quality-wq2.jpg"),
  "assets/images/conditions/wave-quality-wq3.jpg": require("@/assets/images/conditions/wave-quality-wq3.jpg"),
  "assets/images/conditions/wave-quality-wq4.jpg": require("@/assets/images/conditions/wave-quality-wq4.jpg"),
  "assets/images/conditions/wave-quality-wq5.jpg": require("@/assets/images/conditions/wave-quality-wq5.jpg"),
  "assets/images/conditions/wave-quality-wq6.jpg": require("@/assets/images/conditions/wave-quality-wq6.jpg"),
  "assets/images/conditions/crowd-level-c1.jpg": require("@/assets/images/conditions/crowd-level-c1.jpg"),
  "assets/images/conditions/crowd-level-c2.jpg": require("@/assets/images/conditions/crowd-level-c2.jpg"),
  "assets/images/conditions/crowd-level-c3.jpg": require("@/assets/images/conditions/crowd-level-c3.jpg"),
  "assets/images/conditions/crowd-level-c4.jpg": require("@/assets/images/conditions/crowd-level-c4.jpg"),
  "assets/images/conditions/crowd-level-c5.jpg": require("@/assets/images/conditions/crowd-level-c5.jpg"),
};

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
  const [showCrowdPicker, setShowCrowdPicker] = useState(false);

  const [waveHeightDbOptions, setWaveHeightDbOptions] = useState<
    WaveHeightOption[]
  >([]);
  const [waveQualityDbOptions, setWaveQualityDbOptions] = useState<
    WaveQualityOption[]
  >([]);
  const [crowdDbOptions, setCrowdDbOptions] = useState<CrowdOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConditionOptions = async () => {
      try {
        setLoading(true);
        const { data: heights, error: heightError } = await supabase
          .from("wave_heights")
          .select("id, label, metric, description, image_path") // Assuming description might exist or be added
          .order("id", { ascending: true });

        const { data: qualities, error: qualityError } = await supabase
          .from("wave_qualities")
          .select("id, label, description, image_path")
          .order("id", { ascending: true });

        const { data: crowds, error: crowdError } = await supabase
          .from("crowd_levels")
          .select("id, label, description, icon_name, image_path") // Added icon_name
          .order("id", { ascending: true });

        if (heightError) throw heightError;
        if (qualityError) throw qualityError;
        if (crowdError) throw crowdError;

        // Assuming types WaveHeightOption etc. now expect id: number, image_path: string
        setWaveHeightDbOptions(heights || []);
        setWaveQualityDbOptions(qualities || []);
        setCrowdDbOptions(crowds || []);
        setError(null);
      } catch (e: any) {
        console.error("Failed to fetch condition options:", e);
        setError("Failed to load condition options. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConditionOptions();
  }, []);

  // Set default values if nothing is selected and data is loaded
  useEffect(() => {
    if (loading || error) return;

    if (!selectedWaveHeight && waveHeightDbOptions.length > 0) {
      const middleHeightIndex = Math.floor(waveHeightDbOptions.length / 2);
      onWaveHeightChange(waveHeightDbOptions[middleHeightIndex]);
    }

    if (!selectedWaveQuality && waveQualityDbOptions.length > 0) {
      const middleQualityIndex = Math.floor(waveQualityDbOptions.length / 2);
      onWaveQualityChange(waveQualityDbOptions[middleQualityIndex]);
    }

    if (!selectedCrowd && crowdDbOptions.length > 0) {
      const middleCrowdIndex = Math.floor(crowdDbOptions.length / 2);
      onCrowdChange(crowdDbOptions[middleCrowdIndex]);
    }
  }, [
    loading,
    error,
    selectedWaveHeight,
    selectedWaveQuality,
    selectedCrowd,
    waveHeightDbOptions,
    waveQualityDbOptions,
    crowdDbOptions,
    onWaveHeightChange,
    onWaveQualityChange,
    onCrowdChange,
  ]);

  // Types for mapping functions now expect options with id: number and image_path: string
  const mapOptionsToCarousel = (
    options: (WaveHeightOption | WaveQualityOption | CrowdOption)[]
  ): CarouselPickerOption[] => {
    return options.map((opt) => {
      const imageResource = imageMap[opt.image_path];
      if (!imageResource && opt.image_path) {
        // Added a check for opt.image_path to prevent warning on undefined
        console.warn(`Image not found in map for path: ${opt.image_path}`);
      }
      return {
        id: String(opt.id), // Convert numeric ID to string for CarouselPickerOption
        label: opt.label,
        imageUri: imageResource || 0, // Fallback to 0 (or a placeholder image's require() result) if not found
        description: opt.description,
        metric: (opt as WaveHeightOption).metric,
        // icon_name is not directly part of CarouselPickerOption, handle if needed
      };
    });
  };

  if (loading) {
    return (
      <View style={[styles.card, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.core.midnightSurf} />
        <Text style={styles.loadingText}>Loading Conditions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.card, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Conditions</Text>
      </View>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowWaveHeightPicker(true)}
        disabled={waveHeightDbOptions.length === 0}
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
        disabled={waveQualityDbOptions.length === 0}
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

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowCrowdPicker(true)}
        disabled={crowdDbOptions.length === 0}
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

      {waveHeightDbOptions.length > 0 && (
        <ImageCarouselPicker
          visible={showWaveHeightPicker}
          options={mapOptionsToCarousel(waveHeightDbOptions)}
          title="Select Wave Height"
          onClose={() => setShowWaveHeightPicker(false)}
          onSelectOption={(option) => {
            // option.id is string here
            const selected = waveHeightDbOptions.find(
              (opt) => String(opt.id) === option.id
            );
            if (selected) onWaveHeightChange(selected);
          }}
          currentOption={
            selectedWaveHeight
              ? mapOptionsToCarousel([selectedWaveHeight])[0]
              : undefined
          }
        />
      )}

      {waveQualityDbOptions.length > 0 && (
        <ImageCarouselPicker
          visible={showWaveQualityPicker}
          options={mapOptionsToCarousel(waveQualityDbOptions)}
          title="Select Wave Quality"
          onClose={() => setShowWaveQualityPicker(false)}
          onSelectOption={(option) => {
            const selected = waveQualityDbOptions.find(
              (opt) => String(opt.id) === option.id
            );
            if (selected) onWaveQualityChange(selected);
          }}
          currentOption={
            selectedWaveQuality
              ? mapOptionsToCarousel([selectedWaveQuality])[0]
              : undefined
          }
        />
      )}

      {crowdDbOptions.length > 0 && (
        <ImageCarouselPicker
          visible={showCrowdPicker}
          options={mapOptionsToCarousel(crowdDbOptions)}
          title="Select Crowd Level"
          onClose={() => setShowCrowdPicker(false)}
          onSelectOption={(carouselOption) => {
            const selected = crowdDbOptions.find(
              (opt) => String(opt.id) === carouselOption.id
            );
            if (selected) {
              onCrowdChange(selected);
            }
          }}
          currentOption={
            selectedCrowd ? mapOptionsToCarousel([selectedCrowd])[0] : undefined
          }
        />
      )}
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
  centered: {
    alignItems: "center",
    justifyContent: "center",
    height: 150, // Give it some height
  },
  loadingText: {
    marginTop: 10,
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error[700], // Using a color from the error palette
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
