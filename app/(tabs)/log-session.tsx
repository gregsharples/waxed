import { ConditionsPicker } from "@/components/session/ConditionsPicker"; // Import ConditionsPicker
import { LocationPicker } from "@/components/session/LocationPicker";
import { MediaPicker } from "@/components/session/MediaPicker";
import { RatingPicker } from "@/components/session/RatingPicker"; // Added RatingPicker
import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import { CrowdOption, WaveHeightOption, WaveQualityOption } from "@/types"; // Import types
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
// import Slider from "@react-native-community/slider"; // No longer needed for wave height
import { Picker } from "@react-native-picker/picker";
import { CalendarDays, Clock, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogSessionScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // This will be reused for the inline picker on iOS
  const [showDatePickerSheet, setShowDatePickerSheet] = useState(false);
  const [tempDate, setTempDate] = useState(new Date()); // For date & time picker sheet
  const [duration, setDuration] = useState(1); // Duration in total hours
  const [showDurationPickerSheet, setShowDurationPickerSheet] = useState(false);
  const [tempHours, setTempHours] = useState(Math.floor(duration));
  const [tempMinutes, setTempMinutes] = useState(
    Math.round((duration % 1) * 60)
  );
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationPickerSheet, setShowLocationPickerSheet] = useState(false);
  const [tempSelectedLocation, setTempSelectedLocation] = useState(""); // For location picker sheet
  // const [waveHeight, setWaveHeight] = useState(0.5); // Old wave height state
  const [selectedWaveHeight, setSelectedWaveHeight] = useState<
    WaveHeightOption | undefined
  >(undefined);
  const [selectedWaveQuality, setSelectedWaveQuality] = useState<
    WaveQualityOption | undefined
  >(undefined);
  const [selectedCrowd, setSelectedCrowd] = useState<CrowdOption | undefined>(
    undefined
  ); // Added crowd state
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [media, setMedia] = useState<
    { uri: string; type: "image" | "video"; thumbnailUri?: string }[] // Added thumbnailUri
  >([]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // Keep for inline iOS date picker if needed elsewhere
    setTempDate(currentDate); // Update tempDate for the sheet
    if (Platform.OS !== "ios") {
      // For Android, the picker closes itself
      // setDate(currentDate); // Optionally update immediately on Android
      // setShowDatePickerSheet(false); // Or close sheet after selection
    }
  };

  const handleConfirmDate = () => {
    setDate(tempDate);
    setShowDatePickerSheet(false);
  };

  const handleConfirmDuration = () => {
    const totalHours = tempHours + tempMinutes / 60;
    setDuration(totalHours);
    setShowDurationPickerSheet(false);
  };

  const handleConfirmLocation = () => {
    setSelectedLocation(tempSelectedLocation);
    setShowLocationPickerSheet(false);
  };

  const formatDuration = (totalHours: number) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours % 1) * 60);
    let durationString = "";
    if (hours > 0) {
      durationString += `${hours} hr`;
    }
    if (minutes > 0) {
      if (hours > 0) durationString += " ";
      durationString += `${minutes} min`;
    }
    if (hours === 0 && minutes === 0) {
      return "0 min"; // Or some default like "Set duration"
    }
    return durationString;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAddMedia = (newMedia: {
    uri: string;
    type: "image" | "video";
    thumbnailUri?: string; // Added thumbnailUri
  }) => {
    setMedia((prevMedia) => [...prevMedia, newMedia]); // Use functional update
  };

  const handleRemoveMedia = (uri: string) => {
    setMedia((prevMedia) => prevMedia.filter((item) => item.uri !== uri)); // Use functional update
  };

  const handleSubmit = () => {
    // TODO: Implement session saving logic
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Log New Session</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.card}>
            <View style={styles.customCardHeader}>
              <Text style={styles.customCardTitle}>Session Details</Text>
            </View>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeItem}
                onPress={() => {
                  setTempDate(date); // Initialize tempDate with current date
                  setShowDatePickerSheet(true);
                }}
              >
                <CalendarDays
                  size={18}
                  color={COLORS.text.secondary}
                  style={styles.iconStyle}
                />
                <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeItem}
                onPress={() => {
                  setTempHours(Math.floor(duration));
                  setTempMinutes(Math.round((duration % 1) * 60));
                  setShowDurationPickerSheet(true);
                }}
              >
                <Clock
                  size={18}
                  color={COLORS.text.secondary}
                  style={styles.iconStyle}
                />
                <Text style={styles.dateTimeText}>
                  {formatDuration(duration)}
                </Text>
              </TouchableOpacity>
              {/* Location Picker Trigger */}
              <TouchableOpacity
                style={styles.dateTimeItem}
                onPress={() => {
                  setTempSelectedLocation(selectedLocation); // Initialize temp location
                  setShowLocationPickerSheet(true);
                }}
              >
                <MapPin
                  size={18}
                  color={COLORS.text.secondary}
                  style={styles.iconStyle}
                />
                <Text style={styles.dateTimeText}>
                  {selectedLocation || "Select Location"}
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={tempDate} // Use tempDate for the inline picker as well if it's for the sheet
                mode="datetime" // Changed to datetime
                display="default"
                onChange={onDateChange}
              />
            )}
            {/* Date Picker Modal/Sheet */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showDatePickerSheet}
              onRequestClose={() => setShowDatePickerSheet(false)}
            >
              <View style={styles.sheetContainer}>
                <View style={styles.sheetContent}>
                  <Text style={styles.sheetTitle}>Select Date</Text>
                  {Platform.OS === "android" && (
                    // Android DateTimePicker is a dialog, so we show it when sheet is visible
                    // and it will overlay. For a more integrated look, custom component needed.
                    // This re-uses the existing logic for Android.
                    <DateTimePicker
                      value={tempDate}
                      mode="datetime" // Changed to datetime
                      display="default"
                      onChange={(event, selectedDate) => {
                        onDateChange(event, selectedDate);
                        // For Android, picker closes on selection, so we might auto-confirm or require "Done"
                        if (selectedDate) setTempDate(selectedDate); // Update tempDate
                      }}
                    />
                  )}
                  {Platform.OS === "ios" && (
                    <DateTimePicker
                      value={tempDate}
                      mode="datetime" // Changed to datetime
                      display="spinner" // Spinner is better for sheets on iOS
                      onChange={onDateChange}
                      style={styles.iosPickerStyle}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={handleConfirmDate}
                  >
                    <Text style={styles.sheetButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* Duration Picker Modal/Sheet */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showDurationPickerSheet}
              onRequestClose={() => setShowDurationPickerSheet(false)}
            >
              <View style={styles.sheetContainer}>
                <View style={styles.sheetContent}>
                  <Text style={styles.sheetTitle}>Select Duration</Text>
                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      value={new Date(0, 0, 0, tempHours, tempMinutes, 0)} // Date representing duration
                      mode="countdown"
                      display="spinner"
                      minuteInterval={5} // Changed to 5 minutes
                      textColor={COLORS.core.boardBlack} // Added textColor for iOS
                      onChange={(event, newDate?: Date) => {
                        if (newDate) {
                          // For countdown, newDate's time part gives the duration
                          setTempHours(newDate.getHours());
                          setTempMinutes(newDate.getMinutes());
                        }
                      }}
                      style={styles.iosPickerStyle} // Reuse existing style for width/height
                    />
                  ) : (
                    // Android uses the dual Picker setup
                    <View style={styles.durationPickerRow}>
                      <View style={styles.pickerContainer}>
                        <Text style={styles.pickerLabel}>Hours</Text>
                        <Picker
                          selectedValue={tempHours}
                          style={styles.pickerStyle}
                          itemStyle={styles.pickerItemStyle}
                          onValueChange={(itemValue: number) =>
                            setTempHours(itemValue)
                          }
                        >
                          {[...Array(6).keys()].map(
                            (
                              h // 0-5 hours
                            ) => (
                              <Picker.Item key={h} label={`${h}`} value={h} />
                            )
                          )}
                        </Picker>
                      </View>
                      <View style={styles.pickerContainer}>
                        <Text style={styles.pickerLabel}>Minutes</Text>
                        <Picker
                          selectedValue={tempMinutes}
                          style={styles.pickerStyle}
                          itemStyle={styles.pickerItemStyle}
                          onValueChange={(itemValue: number) =>
                            setTempMinutes(itemValue)
                          }
                        >
                          {[0, 15, 30, 45].map(
                            (
                              m // 0, 15, 30, 45 minutes
                            ) => (
                              <Picker.Item key={m} label={`${m}`} value={m} />
                            )
                          )}
                        </Picker>
                      </View>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={handleConfirmDuration}
                  >
                    <Text style={styles.sheetButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* Location Picker Modal/Sheet */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showLocationPickerSheet}
              onRequestClose={() => setShowLocationPickerSheet(false)}
            >
              <View style={styles.sheetContainer}>
                <View style={styles.locationSheetContent}>
                  {" "}
                  {/* Changed style name for specific layout */}
                  <Text style={styles.sheetTitle}>Select Location</Text>
                  <View style={styles.pickerWrapper}>
                    <LocationPicker
                      selectedLocation={tempSelectedLocation}
                      onSelectLocation={setTempSelectedLocation}
                    />
                  </View>
                  {tempSelectedLocation ? (
                    <Text style={styles.currentSelectionText}>
                      Selected Location: {tempSelectedLocation}
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={handleConfirmLocation}
                  >
                    <Text style={styles.sheetButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </Animated.View>

        {/* LocationPicker component is now inside a modal/sheet triggered from Session Details card */}
        {/* The old "Where did you surf?" card has been removed */}

        {/* Conditions Picker */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <ConditionsPicker
            selectedWaveHeight={selectedWaveHeight}
            onWaveHeightChange={setSelectedWaveHeight}
            selectedWaveQuality={selectedWaveQuality}
            onWaveQualityChange={setSelectedWaveQuality}
            selectedCrowd={selectedCrowd}
            onCrowdChange={setSelectedCrowd}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {/* Star icon removed */}
              <Text style={styles.cardTitleNoIcon}>Session Review</Text>
            </View>
            <RatingPicker rating={rating} onRatingChange={setRating} />
            <TextInput
              style={[styles.notesInput, { marginTop: 16 }]} // Added marginTop to notesInput
              multiline
              numberOfLines={4}
              placeholder="Add any notes about your session..."
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        {/* The original Notes card is removed, so the delay for Add Photos & Videos needs to be adjusted */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitleNoIcon}>Add Photos & Videos</Text>
            </View>
            <MediaPicker
              media={media}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
            />
          </View>
        </Animated.View>

        {/* Original Notes card removed */}

        {/* Delay for submit button needs to be adjusted */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Session</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 140, // Adjusted padding
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.primary,
  },
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
    marginBottom: 8, // Reduced marginBottom from 16 to 8
  },
  customCardHeader: {
    // New style for the "Time and Duration" header
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // Further reduced margin
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle, // Changed from h3 to subtitle
    color: COLORS.text.primary,
    marginLeft: 8, // For headers with icons
  },
  cardTitleNoIcon: {
    // New style for card titles without an icon
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
    // No marginLeft as there's no icon
  },
  customCardTitle: {
    // New style for the "Time and Duration" title (no icon, so no marginLeft)
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
  },
  dateTimeRow: {
    flexDirection: "column", // Changed to column
    alignItems: "stretch", // Stretch items to fill width
    marginTop: 4, // Reduced top margin
    paddingTop: 8, // Keep top padding
    paddingBottom: 4, // Reduce bottom padding to make space below duration picker smaller
    paddingHorizontal: 0, // No horizontal padding needed if items stretch
    borderRadius: 8,
    // borderWidth: 1, // Removed border
    // borderColor: COLORS.neutral[200], // Removed border
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // To push icon and text apart if desired, or center
    paddingVertical: 10, // Add some padding to each item
    paddingHorizontal: 16, // Add horizontal padding to each item
    // backgroundColor: COLORS.neutral[100], // Example if each item needs a background
    // borderRadius: 8, // Example if each item needs a border radius
    // marginBottom: 8, // Add margin if items are too close
  },
  iconStyle: {
    marginRight: 6,
  },
  dateTimeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  // Removed datePickerButton, dateText, durationContainer, label, value, slider styles as they are being refactored
  // label: { // Kept for other cards, ensure it's not removed if used elsewhere
  //   ...TYPOGRAPHY.subtitle,
  //   color: COLORS.text.secondary,
  //   marginBottom: 8,
  // },
  // value: { // Kept for other cards
  //   ...TYPOGRAPHY.body,
  //   color: COLORS.text.primary,
  //   textAlign: "center",
  //   marginBottom: 8,
  // },
  // slider: { // Kept for other cards
  //   width: "100%",
  //   height: 40,
  // },
  label: {
    // Copied from original for other cards that might use it
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  value: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  conditionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  conditionItem: {
    marginTop: 16,
  },
  halfWidth: {
    width: "48%",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginTop: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 8,
    padding: 12,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: COLORS.core.sunsetCoral, // Changed to coral color
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: "center",
  },
  submitButtonText: {
    ...TYPOGRAPHY.buttonText,
    color: "white",
  },
  sheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetContent: {
    // General sheet content style
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20, // Bottom padding for button
    paddingTop: 20, // Reduced top padding, title will have its own margin
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    // height: "auto", // Let content define height for date/duration pickers
  },
  locationSheetContent: {
    // Specific style for location picker sheet
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    flexDirection: "column", // To arrange items vertically
    justifyContent: "space-between", // Push button to bottom
  },
  pickerWrapper: {
    flex: 1, // Allows LocationPicker to take available space
    width: "100%", // Ensure LocationPicker spans width
    marginBottom: 10, // Space before current selection text or button
  },
  currentSelectionText: {
    ...TYPOGRAPHY.body, // Made more prominent
    color: COLORS.core.boardBlack, // Changed to boardBlack
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500", // Added some weight
  },
  sheetTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: 20,
  },
  iosPickerStyle: {
    width: "100%", // Ensure picker takes full width
    height: 200, // Adjust height as needed
  },
  sheetButton: {
    backgroundColor: COLORS.core.boardBlack, // Changed to boardBlack
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    width: "100%", // Make button full width
    alignItems: "center",
  },
  sheetButtonText: {
    ...TYPOGRAPHY.buttonText,
    color: "white",
  },
  durationPickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    alignItems: "center", // Center label above picker
  },
  pickerLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.secondary,
    marginBottom: 5,
  },
  pickerStyle: {
    height: Platform.OS === "ios" ? 150 : 50, // iOS needs explicit height for wheel
    width: Platform.OS === "ios" ? "auto" : 120, // Android can use fixed width
  },
  pickerItemStyle: {
    // For iOS, to style the items in the wheel picker
    height: Platform.OS === "ios" ? 150 : undefined, // Ensure items are tall enough for wheel
    fontSize: Platform.OS === "ios" ? TYPOGRAPHY.body.fontSize : undefined,
    // color: Platform.OS === "ios" ? "#000000" : undefined, // Color now applied directly to Picker.Item for iOS
  },
});
