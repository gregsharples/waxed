import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { Platform } from 'react-native';
import { Slider } from '@react-native-community/slider';
import { Droplet, Clock, MapPin, Wind, Thermometer } from 'lucide-react-native';
import { MOCK_LOCATIONS } from '@/data/mockData';
import { LocationPicker } from '@/components/session/LocationPicker';
import { RatingPicker } from '@/components/session/RatingPicker';

export default function LogSessionScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [waveHeight, setWaveHeight] = useState(0.5);
  const [windSpeed, setWindSpeed] = useState(5);
  const [temperature, setTemperature] = useState(20);
  const [notes, setNotes] = useState('');
  const [overallRating, setOverallRating] = useState(3);
  
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleSubmit = () => {
    console.log({
      date,
      duration,
      selectedLocation,
      waveHeight,
      windSpeed,
      temperature,
      notes,
      overallRating
    });
    // This would normally save the data and navigate back
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Log New Session</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
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
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.formSection}>
            <View style={styles.inputHeader}>
              <Clock size={20} color={COLORS.text.secondary} />
              <Text style={styles.sectionTitle}>Duration (hours)</Text>
            </View>
            <Text style={styles.sliderValue}>{duration.toFixed(1)} hours</Text>
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
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.formSection}>
            <View style={styles.inputHeader}>
              <MapPin size={20} color={COLORS.text.secondary} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <LocationPicker
              locations={MOCK_LOCATIONS}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.formSection}>
            <View style={styles.inputHeader}>
              <Droplet size={20} color={COLORS.text.secondary} />
              <Text style={styles.sectionTitle}>Wave Height (meters)</Text>
            </View>
            <Text style={styles.sliderValue}>{waveHeight.toFixed(1)} m</Text>
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
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.formRow}>
            <View style={[styles.formSection, styles.halfWidth]}>
              <View style={styles.inputHeader}>
                <Wind size={20} color={COLORS.text.secondary} />
                <Text style={styles.sectionTitle}>Wind (km/h)</Text>
              </View>
              <Text style={styles.sliderValue}>{windSpeed.toFixed(0)} km/h</Text>
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

            <View style={[styles.formSection, styles.halfWidth]}>
              <View style={styles.inputHeader}>
                <Thermometer size={20} color={COLORS.text.secondary} />
                <Text style={styles.sectionTitle}>Temp (°C)</Text>
              </View>
              <Text style={styles.sliderValue}>{temperature.toFixed(0)}°C</Text>
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
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Overall Experience</Text>
            <RatingPicker rating={overallRating} onRatingChange={setOverallRating} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(500)}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
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

        <Animated.View entering={FadeInDown.delay(800).duration(500)}>
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
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  halfWidth: {
    width: '48%',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  datePickerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
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
    alignItems: 'center',
  },
  submitButtonText: {
    ...TYPOGRAPHY.buttonText,
    color: 'white',
  },
});