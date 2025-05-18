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
import { supabase } from "@/lib/supabase";
import { Picker } from "@react-native-picker/picker";
import { decode } from "base64-arraybuffer"; // Import decode
import * as FileSystem from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import { CalendarDays, Check, Clock, MapPin, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogSessionScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerSheet, setShowDatePickerSheet] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [showDurationPickerSheet, setShowDurationPickerSheet] = useState(false);
  const [tempHours, setTempHours] = useState(Math.floor(duration));
  const [tempMinutes, setTempMinutes] = useState(
    Math.round((duration % 1) * 60)
  );
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationPickerSheet, setShowLocationPickerSheet] = useState(false);
  const [tempSelectedLocation, setTempSelectedLocation] = useState("");
  const [tempSelectedLocationId, setTempSelectedLocationId] = useState<
    string | undefined
  >(undefined);

  const [selectedWaveHeight, setSelectedWaveHeight] = useState<
    WaveHeightOption | undefined
  >(undefined);
  const [selectedWaveQuality, setSelectedWaveQuality] = useState<
    WaveQualityOption | undefined
  >(undefined);
  const [selectedCrowd, setSelectedCrowd] = useState<CrowdOption | undefined>(
    undefined
  );
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [media, setMedia] = useState<
    { uri: string; type: "image" | "video"; thumbnailUri?: string }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [])
  );

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setTempDate(currentDate);
    if (Platform.OS !== "ios") {
      // Android specific logic if any
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

  const handleTempLocationSelect = (
    locationName: string,
    locationId?: string
  ) => {
    setTempSelectedLocation(locationName);
    setTempSelectedLocationId(locationId);
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
      return "0 min";
    }
    return durationString;
  };

  const formatDate = (dateToFormat: Date) => {
    return dateToFormat.toLocaleString("en-US", {
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
    thumbnailUri?: string;
  }) => {
    setMedia((prevMedia) => [...prevMedia, newMedia]);
  };

  const handleRemoveMedia = (uri: string) => {
    setMedia((prevMedia) => prevMedia.filter((item) => item.uri !== uri));
  };

  const resetForm = () => {
    setDate(new Date());
    setDuration(1);
    setSelectedLocation("");
    setTempSelectedLocation("");
    setTempSelectedLocationId(undefined);
    setSelectedWaveHeight(undefined);
    setSelectedWaveQuality(undefined);
    setSelectedCrowd(undefined);
    setNotes("");
    setRating(0);
    setMedia([]);
  };

  const handleSubmit = async () => {
    if (!selectedLocation) {
      Alert.alert(
        "Missing Information",
        "Please select a location for your session."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Authentication Error", "Please log in to save sessions.");
        setIsSubmitting(false);
        return;
      }

      const sessionData = {
        user_id: user.id,
        date: date.toISOString(),
        duration_minutes: Math.round(duration * 60),
        location: selectedLocation,
        location_id: tempSelectedLocationId,
        wave_height_id: selectedWaveHeight?.id || null,
        wave_quality_id: selectedWaveQuality?.id || null,
        crowd_id: selectedCrowd?.id || null,
        notes: notes,
        rating: rating,
        created_at: new Date().toISOString(),
      };

      const uploadedMediaData = [];
      if (media.length > 0) {
        for (const mediaItem of media) {
          try {
            console.log(`Processing mediaItem: ${mediaItem.uri}`);
            const localUri = mediaItem.uri;

            const fileInfo = await FileSystem.getInfoAsync(localUri);
            if (!fileInfo.exists) {
              console.warn(`File does not exist: ${localUri}`);
              continue;
            }
            console.log(`File info for ${localUri}:`, fileInfo);

            const originalFilename =
              localUri.split("/").pop() || `media-${Date.now()}`;
            const fileExtension = originalFilename
              .split(".")
              .pop()
              ?.toLowerCase();
            const baseFilename = originalFilename.substring(
              0,
              originalFilename.lastIndexOf(".")
            );
            const uniqueFilename = `${baseFilename}-${Date.now()}.${fileExtension}`;
            const filePath = `${user.id}/${uniqueFilename}`;
            console.log(`Generated filePath: ${filePath}`);

            let contentType =
              mediaItem.type === "image" ? "image/jpeg" : "video/mp4";
            if (fileExtension === "png") contentType = "image/png";
            if (fileExtension === "gif") contentType = "image/gif";
            console.log(`Determined contentType: ${contentType}`);

            console.log(`Reading file as base64: ${localUri}`);
            const base64 = await FileSystem.readAsStringAsync(localUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            console.log(`Base64 string length: ${base64.length}`);

            console.log(`Decoding base64 to ArrayBuffer...`);
            const arrayBuffer = decode(base64);
            console.log(`ArrayBuffer created. Size: ${arrayBuffer.byteLength}`);

            console.log(
              `Attempting to upload ${filePath} to Supabase Storage...`
            );
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("session-media")
                .upload(filePath, arrayBuffer, {
                  contentType,
                  upsert: false,
                });

            if (uploadError) {
              console.error(`UPLOAD ERROR for ${filePath}:`, uploadError);
              continue;
            }

            console.log(`Upload successful for ${filePath}. Data:`, uploadData);

            const uploadedPath = uploadData?.path || filePath;
            const { data: publicUrlResult } = supabase.storage
              .from("session-media")
              .getPublicUrl(uploadedPath);

            if (publicUrlResult && publicUrlResult.publicUrl) {
              console.log(
                `Public URL for ${uploadedPath}: ${publicUrlResult.publicUrl}`
              );
              uploadedMediaData.push({
                url: publicUrlResult.publicUrl,
                type: mediaItem.type,
                originalFilename: originalFilename,
              });
            } else {
              console.warn(
                `No publicUrl or data returned for ${uploadedPath}.`
              );
            }
          } catch (e: any) {
            console.error(
              `EXCEPTION during processing media item ${mediaItem.uri}:`,
              e.message,
              e.stack
            );
          }
        }
      }

      const { data, error } = await supabase
        .from("sessions")
        .insert([
          {
            ...sessionData,
            media:
              uploadedMediaData.length > 0
                ? JSON.stringify(uploadedMediaData)
                : null,
          },
        ])
        .select();

      if (error) {
        console.error(
          "Error inserting session after media upload:",
          error.message
        );
        throw error;
      }

      setShowSuccessMessage(true);
      resetForm();
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace("/sessions");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving session:", error.message);
      Alert.alert("Error", `Failed to save session: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
                  setTempDate(date);
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
              <TouchableOpacity
                style={styles.dateTimeItem}
                onPress={() => {
                  setTempSelectedLocation(selectedLocation);
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
                    <DateTimePicker
                      value={tempDate}
                      mode="datetime"
                      display="default"
                      onChange={(event, selectedDate) => {
                        onDateChange(event, selectedDate);
                        if (selectedDate) setTempDate(selectedDate);
                      }}
                    />
                  )}
                  {Platform.OS === "ios" && (
                    <DateTimePicker
                      value={tempDate}
                      mode="datetime"
                      display="spinner"
                      onChange={onDateChange}
                      style={styles.iosPickerStyle}
                    />
                  )}
                  <TouchableOpacity
                    style={[
                      styles.sheetButton,
                      { backgroundColor: COLORS.core.sunsetCoral },
                    ]}
                    onPress={handleConfirmDate}
                  >
                    <Text style={styles.sheetButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
                      value={new Date(0, 0, 0, tempHours, tempMinutes, 0)}
                      mode="countdown"
                      display="spinner"
                      minuteInterval={5}
                      textColor={COLORS.core.boardBlack}
                      onChange={(event, newDate?: Date) => {
                        if (newDate) {
                          setTempHours(newDate.getHours());
                          setTempMinutes(newDate.getMinutes());
                        }
                      }}
                      style={styles.iosPickerStyle}
                    />
                  ) : (
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
                          {[...Array(6).keys()].map((h) => (
                            <Picker.Item key={h} label={`${h}`} value={h} />
                          ))}
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
                          {[0, 15, 30, 45].map((m) => (
                            <Picker.Item key={m} label={`${m}`} value={m} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.sheetButton,
                      { backgroundColor: COLORS.core.sunsetCoral },
                    ]}
                    onPress={handleConfirmDuration}
                  >
                    <Text style={styles.sheetButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showLocationPickerSheet}
              onRequestClose={() => setShowLocationPickerSheet(false)}
            >
              <View style={styles.sheetContainer}>
                <View style={styles.locationSheetContent}>
                  <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Select Location</Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowLocationPickerSheet(false)}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                      <X size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <LocationPicker
                      selectedLocation={tempSelectedLocation}
                      onSelectLocation={handleTempLocationSelect}
                    />
                  </View>
                  {tempSelectedLocation ? (
                    <Text style={styles.currentSelectionText}>
                      Selected Location: {tempSelectedLocation}
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    style={[
                      styles.sheetButton,
                      { backgroundColor: COLORS.core.sunsetCoral },
                    ]}
                    onPress={handleConfirmLocation}
                  >
                    <Text style={styles.sheetButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </Animated.View>

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
              <Text style={styles.cardTitleNoIcon}>Session Review</Text>
            </View>
            <RatingPicker rating={rating} onRatingChange={setRating} />
            <TextInput
              style={[styles.notesInput, { marginTop: 16 }]}
              multiline
              numberOfLines={4}
              placeholder="Add any notes about your session..."
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

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

        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={{ width: "100%" }}
        >
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Saving..." : "Save Session"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {showSuccessMessage && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.successOverlay}
        >
          <View style={styles.successContent}>
            <Check size={40} color={COLORS.core.waxWhite} />
            <Text style={styles.successText}>Session Saved!</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 140,
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
    marginBottom: 8,
  },
  customCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  cardTitleNoIcon: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
  },
  customCardTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
  },
  dateTimeRow: {
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 4,
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  iconStyle: {
    marginRight: 6,
  },
  dateTimeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
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
    backgroundColor: COLORS.core.sunsetCoral,
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  locationSheetContent: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  pickerWrapper: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
  },
  currentSelectionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.core.boardBlack,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  sheetTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: 20,
  },
  iosPickerStyle: {
    width: "100%",
    height: 200,
  },
  sheetButton: {
    backgroundColor: COLORS.core.boardBlack,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    width: "100%",
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
    alignItems: "center",
  },
  pickerLabel: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.secondary,
    marginBottom: 5,
  },
  pickerStyle: {
    height: Platform.OS === "ios" ? 150 : 50,
    width: Platform.OS === "ios" ? "auto" : 120,
  },
  pickerItemStyle: {
    height: Platform.OS === "ios" ? 150 : undefined,
    fontSize: Platform.OS === "ios" ? TYPOGRAPHY.body.fontSize : undefined,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  closeButton: {
    padding: 0,
    marginTop: -20,
  },
  buttonWrapper: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  successContent: {
    backgroundColor: COLORS.core.sunsetCoral,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  successText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.core.waxWhite,
    marginTop: 16,
  },
});
