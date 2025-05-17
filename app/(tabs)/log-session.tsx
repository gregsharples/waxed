import { LocationPicker } from "@/components/session/LocationPicker";
import { MediaPicker } from "@/components/session/MediaPicker";
import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { Clock, Droplet, MapPin, Star } from "lucide-react-native";
import React, { useState } from "react";
import {
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [waveHeight, setWaveHeight] = useState(0.5);
  const [windSpeed, setWindSpeed] = useState(5);
  const [temperature, setTemperature] = useState(20);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [media, setMedia] = useState<
    { uri: string; type: "image" | "video" }[]
  >([]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
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
      windSpeed,
      temperature,
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
              <Clock size={20} color={COLORS.primary[600]} />
              <Text style={styles.cardTitle}>When did you surf?</Text>
            </View>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <View style={styles.durationContainer}>
              <Text style={styles.label}>Session Duration</Text>
              <Text style={styles.value}>{duration.toFixed(1)} hours</Text>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={5}
                step={0.5}
                value={duration}
                onValueChange={setDuration}
                minimumTrackTintColor={COLORS.primary[500]}
                maximumTrackTintColor={COLORS.neutral[200]}
                thumbTintColor={COLORS.primary[600]}
              />
            </View>
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

            <View style={styles.conditionsRow}>
              <View style={[styles.conditionItem, styles.halfWidth]}>
                <Text style={styles.label}>Wind Speed</Text>
                <Text style={styles.value}>{windSpeed.toFixed(0)} km/h</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={50}
                  step={1}
                  value={windSpeed}
                  onValueChange={setWindSpeed}
                  minimumTrackTintColor={COLORS.accent[500]}
                  maximumTrackTintColor={COLORS.neutral[200]}
                  thumbTintColor={COLORS.accent[600]}
                />
              </View>

              <View style={[styles.conditionItem, styles.halfWidth]}>
                <Text style={styles.label}>Temperature</Text>
                <Text style={styles.value}>{temperature.toFixed(0)}°C</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={40}
                  step={1}
                  value={temperature}
                  onValueChange={setTemperature}
                  minimumTrackTintColor={COLORS.warning[500]}
                  maximumTrackTintColor={COLORS.neutral[200]}
                  thumbTintColor={COLORS.warning[600]}
                />
              </View>
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
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  datePickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    alignItems: "center",
  },
  dateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  durationContainer: {
    marginTop: 16,
  },
  label: {
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
});
