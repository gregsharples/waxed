import { LocationPicker } from "@/components/session/LocationPicker";
import { MediaPicker } from "@/components/session/MediaPicker";
import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import {
  CalendarDays,
  Clock,
  Droplet,
  MapPin,
  Star,
} from "lucide-react-native";
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
  const [tempDate, setTempDate] = useState(new Date()); // For date picker sheet
  const [duration, setDuration] = useState(1);
  const [showDurationPickerSheet, setShowDurationPickerSheet] = useState(false);
  const [tempDuration, setTempDuration] = useState(1); // For duration picker sheet
  const [selectedLocation, setSelectedLocation] = useState("");
  const [waveHeight, setWaveHeight] = useState(0.5);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [media, setMedia] = useState<
    { uri: string; type: "image" | "video" }[]
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
    setDuration(tempDuration);
    setShowDurationPickerSheet(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleAddMedia = (newMedia: {
    uri: string;
    type: "image" | "video";
  }) => {
    setMedia([...media, newMedia]);
  };

  const handleRemoveMedia = (uri: string) => {
    setMedia(media.filter((item) => item.uri !== uri));
  };

  const handleSubmit = () => {
    // TODO: Implement session saving logic
    console.log({
      date,
      duration,
      selectedLocation,
      waveHeight,
      notes,
      rating,
      media,
    });
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
            <View style={styles.cardHeader}>
              {/* Icon for the card itself, can be different from date/time icons */}
              <Clock size={20} color={COLORS.primary[600]} />
              <Text style={styles.cardTitle}>When did you surf?</Text>
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
                  setTempDuration(duration); // Initialize tempDuration with current duration
                  setShowDurationPickerSheet(true);
                }}
              >
                <Clock
                  size={18}
                  color={COLORS.text.secondary}
                  style={styles.iconStyle}
                />
                <Text style={styles.dateTimeText}>
                  {duration.toFixed(1)} hours
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                // display={Platform.OS === "ios" ? "spinner" : "default"} // spinner can be good for sheets
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
                      mode="date"
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
                      mode="date"
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
                  <Text style={styles.value}>
                    {tempDuration.toFixed(1)} hours
                  </Text>
                  <Slider
                    style={styles.slider} // Ensure slider style is applied
                    minimumValue={0.5}
                    maximumValue={5}
                    step={0.5}
                    value={tempDuration}
                    onValueChange={setTempDuration}
                    minimumTrackTintColor={COLORS.primary[500]}
                    maximumTrackTintColor={COLORS.neutral[200]}
                    thumbTintColor={COLORS.primary[600]}
                  />
                  <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={handleConfirmDuration}
                  >
                    <Text style={styles.sheetButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MapPin size={20} color={COLORS.primary[600]} />
              <Text style={styles.cardTitle}>Where did you surf?</Text>
            </View>
            <LocationPicker
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Droplet size={20} color={COLORS.primary[600]} />
              <Text style={styles.cardTitle}>Conditions</Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.label}>Wave Height</Text>
              <Text style={styles.value}>{waveHeight.toFixed(1)}m</Text>
              <Slider
                style={styles.slider}
                minimumValue={0.1}
                maximumValue={3}
                step={0.1}
                value={waveHeight}
                onValueChange={setWaveHeight}
                minimumTrackTintColor={COLORS.secondary[500]}
                maximumTrackTintColor={COLORS.neutral[200]}
                thumbTintColor={COLORS.secondary[600]}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Star size={20} color={COLORS.primary[600]} />
              <Text style={styles.cardTitle}>How was your session?</Text>
            </View>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={32}
                    color={
                      star <= rating ? COLORS.accent[500] : COLORS.neutral[300]
                    }
                    fill={star <= rating ? COLORS.accent[500] : "transparent"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0
                ? "Tap to rate your session"
                : rating === 1
                ? "Poor"
                : rating === 2
                ? "Fair"
                : rating === 3
                ? "Good"
                : rating === 4
                ? "Great"
                : "Excellent"}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Add Photos & Videos</Text>
            </View>
            <MediaPicker
              media={media}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Notes</Text>
            </View>
            <TextInput
              style={styles.notesInput}
              multiline
              numberOfLines={4}
              placeholder="What did you learn? How did it go?"
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(500)}>
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
    paddingBottom: 100,
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
    marginBottom: 16,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle, // Changed from h3 to subtitle
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Or 'space-between'
    alignItems: "center",
    marginTop: 8, // Add some margin if needed
    paddingVertical: 12,
    paddingHorizontal: 10, // Adjust padding as needed
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: COLORS.primary[600],
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
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center", // Center title and button
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
    backgroundColor: COLORS.primary[600],
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
});
