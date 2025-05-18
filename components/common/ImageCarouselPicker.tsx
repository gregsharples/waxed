import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Modal, // Use built-in Modal
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import Modal from "react-native-modal"; // Remove this

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface CarouselPickerOption {
  id: string;
  label: string;
  imageUri: number; // Changed to number to accept require() result
  description?: string;
  metric?: string;
}

interface ImageCarouselPickerProps {
  visible: boolean; // Changed from isVisible
  options: CarouselPickerOption[];
  title: string;
  onClose: () => void;
  onSelectOption: (option: CarouselPickerOption) => void;
  currentOption?: CarouselPickerOption;
}

export const ImageCarouselPicker: React.FC<ImageCarouselPickerProps> = ({
  visible, // Changed from isVisible
  options,
  title,
  onClose,
  onSelectOption,
  currentOption,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (currentOption) {
      const idx = options.findIndex((opt) => opt.id === currentOption.id);
      return idx !== -1 ? idx : Math.floor(options.length / 2);
    }
    return Math.floor(options.length / 2);
  });
  const flatListRef = useRef<FlatList<CarouselPickerOption>>(null);

  // We can keep these functions for programmatic navigation if needed
  const handleNext = () => {
    if (currentIndex < options.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: CarouselPickerOption;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // First scroll to this item if it's not the current item
        if (index !== currentIndex) {
          setCurrentIndex(index);
          flatListRef.current?.scrollToIndex({ index, animated: true });
        } else {
          // Only select if it's the current centered item
          onSelectOption(item);
          onClose();
        }
      }}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={item.imageUri}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.textOverlay}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          {item.metric && (
            <Text style={styles.itemDescription}>{item.metric}</Text>
          )}
          {item.description && !item.metric && (
            <Text style={styles.itemDescription}>{item.description}</Text>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible} // Changed from isVisible
      onRequestClose={onClose} // Standard prop for hardware back button on Android
    >
      {/* Added a wrapper View to simulate backdrop press and styling */}
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPressOut={onClose} // Close when tapping outside the sheet content
      >
        <TouchableOpacity activeOpacity={1} style={styles.sheetContainer}>
          {/* Prevent backdrop press from triggering on content */}
          <View style={styles.sheetContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.carouselContainer}>
              {options.length > 0 ? (
                <FlatList
                  ref={flatListRef}
                  data={options}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  pagingEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / (screenWidth * 0.7)
                    );
                    setCurrentIndex(index);
                  }}
                  initialScrollIndex={currentIndex}
                  getItemLayout={(_data, index) => ({
                    length: screenWidth * 0.7,
                    offset:
                      screenWidth * 0.7 * index -
                      (screenWidth * 0.85 - screenWidth * 0.7) / 2,
                    index,
                  })}
                  style={styles.flatList}
                  contentContainerStyle={[
                    styles.flatListContent,
                    {
                      paddingHorizontal:
                        (screenWidth * 0.85 - screenWidth * 0.7) / 2,
                    },
                  ]}
                  snapToInterval={screenWidth * 0.7}
                  decelerationRate="fast"
                />
              ) : (
                <Text style={styles.noOptionsText}>No options available.</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    // Style for the semi-transparent backdrop
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetContainer: {
    // Container for the actual sheet content
    backgroundColor: COLORS.background, // Or 'white' if you prefer
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20, // Overall padding
    height: screenHeight * 0.6, // Adjust height as needed
    // Removed margin: 0 as it's part of modalBackdrop now
  },
  sheetContent: {
    // Inner content wrapper, if needed for further structure
    flex: 1, // Take up available space in sheetContainer
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    flex: 1, // Allow title to take available space if header is still space-between
    textAlign: "center", // Center title now that Done button is gone
  },
  // closeButton and closeButtonText styles removed
  carouselContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Ensure positioning context for arrows
  },
  flatList: {
    width: screenWidth * 0.85, // Wider to show partial items
  },
  flatListContent: {
    alignItems: "center",
  },
  itemContainer: {
    width: screenWidth * 0.7, // Reduced from 0.8 to show more of adjacent items
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end", // Aligns textOverlay to the bottom
    borderRadius: 16,
    overflow: "hidden", // Important for borderRadius to work on ImageBackground
  },
  textOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 16, // Match image borderRadius
    borderBottomRightRadius: 16, // Match image borderRadius
    height: 80, // Fixed height for the overlay
    justifyContent: "center", // Center content vertically
  },
  itemLabel: {
    ...TYPOGRAPHY.h3,
    color: COLORS.core.waxWhite,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left", // Align text to the left
  },
  itemDescription: {
    ...TYPOGRAPHY.caption, // Smaller text for description
    color: COLORS.core.waxWhite,
    textAlign: "left", // Align text to the left
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -16 }],
    padding: 10,
    zIndex: 10, // Increase zIndex to ensure visibility
    backgroundColor: "rgba(255,255,255,0.7)", // Semi-transparent background
    borderRadius: 20, // Rounded button
  },
  leftArrow: {
    left: 5,
  },
  rightArrow: {
    right: 5,
  },
  // selectButton and selectButtonText styles removed as the button is gone
  noOptionsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginTop: 20,
  },
});
