import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import * as ImagePicker from "expo-image-picker"; // Added missing import
import * as VideoThumbnails from "expo-video-thumbnails";
import {
  Plus,
  Trash2,
  Trash2 as TrashIconViewer,
  Video,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image as RNImage, // Renamed to avoid conflict if Image from react-native-image-viewing is used directly
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";

interface MediaPickerProps {
  media: {
    uri: string;
    type: "image" | "video";
    thumbnailUri?: string;
  }[];
  onAddMedia: (media: {
    uri: string;
    type: "image" | "video";
    thumbnailUri?: string;
  }) => void;
  onRemoveMedia: (uri: string) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  media,
  onAddMedia,
  onRemoveMedia,
}) => {
  const [isSelectModeActive, setIsSelectModeActive] = useState(false);
  const [selectedItemUris, setSelectedItemUris] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  const imagesForViewer = media
    .filter((item) => item.type === "image")
    .map((item) => ({ uri: item.uri }));

  const handleItemLongPress = (uri: string) => {
    if (isImageViewerVisible) return; // Don't activate select mode if viewer is open
    setIsSelectModeActive(true);
    setSelectedItemUris((prevUris) =>
      prevUris.includes(uri) ? prevUris : [...prevUris, uri]
    );
  };

  const handleItemPress = (uri: string, type: "image" | "video") => {
    if (isSelectModeActive) {
      setSelectedItemUris((prevUris) =>
        prevUris.includes(uri)
          ? prevUris.filter((itemUri) => itemUri !== uri)
          : [...prevUris, uri]
      );
    } else {
      // Open media viewer
      if (type === "image") {
        const imageIndex = imagesForViewer.findIndex((img) => img.uri === uri);
        if (imageIndex !== -1) {
          setCurrentImageIndex(imageIndex);
          setIsImageViewerVisible(true);
        }
      } else {
        // TODO: Handle video viewing
        console.log("View video (not implemented yet):", uri);
      }
    }
  };

  const handleCancelSelectMode = () => {
    setIsSelectModeActive(false);
    setSelectedItemUris([]);
  };

  const handleDeleteSelected = () => {
    if (selectedItemUris.length === 0) return;
    selectedItemUris.forEach((uri) => onRemoveMedia(uri));
    setIsSelectModeActive(false);
    setSelectedItemUris([]);
  };

  const handleAddMediaPress = () => {
    if (isSelectModeActive) return;
    console.log("handleAddMediaPress called. Showing alert...");
    Alert.alert(
      "Add Media",
      "Choose an option",
      [
        {
          text: "Photo Library",
          onPress: () => pickImage(),
        },
        {
          text: "Camera",
          onPress: () => takePhoto(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    console.log("Attempting to pick image from library...");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"] as any,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: true,
      });
      console.log("Image library result:", JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets) {
        for (const asset of result.assets) {
          console.log("Selected asset (raw object):", asset);
          let thumbnailUri: string | undefined = undefined;
          if (asset.type === "video" && asset.uri) {
            console.log(
              `Attempting to generate thumbnail for video URI: ${asset.uri}`
            );
            try {
              const { uri: generatedThumbnailUri } =
                await VideoThumbnails.getThumbnailAsync(asset.uri, {
                  time: 1000,
                });
              thumbnailUri = generatedThumbnailUri;
              console.log(`Generated thumbnail URI: ${thumbnailUri}`);
            } catch (e) {
              console.warn(
                "Could not generate thumbnail for video",
                asset.uri,
                e
              );
            }
          }
          onAddMedia({
            uri: asset.uri,
            type: asset.type === "video" ? "video" : "image",
            thumbnailUri,
          });
        }
      } else {
        console.log("Image picking cancelled or no assets selected.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const takePhoto = async () => {
    console.log("Attempting to take photo/video with camera...");
    try {
      console.log("Requesting camera permissions...");
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      console.log(
        "Camera permission result:",
        JSON.stringify(permissionResult, null, 2)
      );

      if (permissionResult.status === "granted") {
        console.log("Camera permission granted. Launching camera...");
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 1,
        });
        console.log("Camera launch result:", JSON.stringify(result, null, 2));

        if (!result.canceled && result.assets) {
          const asset = result.assets[0];
          console.log("Captured asset (raw object):", asset);
          let thumbnailUri: string | undefined = undefined;
          if (asset.type === "video" && asset.uri) {
            console.log(
              `Attempting to generate thumbnail for video URI (camera): ${asset.uri}`
            );
            try {
              const { uri: generatedThumbnailUri } =
                await VideoThumbnails.getThumbnailAsync(asset.uri, {
                  time: 1000,
                });
              thumbnailUri = generatedThumbnailUri;
              console.log(`Generated thumbnail URI (camera): ${thumbnailUri}`);
            } catch (e) {
              console.warn(
                "Could not generate thumbnail for video",
                asset.uri,
                e
              );
            }
          }
          onAddMedia({
            uri: asset.uri,
            type: asset.type === "video" ? "video" : "image",
            thumbnailUri,
          });
        } else {
          console.log("Camera capture cancelled or no asset returned.");
        }
      } else {
        console.log("Camera permission denied or not determined.");
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to take photos and videos."
        );
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isSelectModeActive && (
        <View style={styles.selectModeHeader}>
          <TouchableOpacity
            onPress={handleCancelSelectMode}
            style={styles.selectModeButton}
          >
            <XCircle size={24} color={COLORS.text.primary} />
            <Text style={styles.selectModeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.selectModeTitle}>
            {selectedItemUris.length} selected
          </Text>
          <TouchableOpacity
            onPress={handleDeleteSelected}
            style={styles.selectModeButton}
            disabled={selectedItemUris.length === 0}
          >
            <Trash2
              size={24}
              color={
                selectedItemUris.length > 0
                  ? COLORS.error[600]
                  : COLORS.neutral[400]
              }
            />
            <Text
              style={[
                styles.selectModeButtonText,
                {
                  color:
                    selectedItemUris.length > 0
                      ? COLORS.error[600]
                      : COLORS.neutral[400],
                },
              ]}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        style={styles.gridScrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.addMediaButton}
          onPress={handleAddMediaPress}
          disabled={isSelectModeActive}
        >
          <Plus
            size={32}
            color={
              isSelectModeActive ? COLORS.neutral[300] : COLORS.neutral[500]
            }
          />
          <Text
            style={[
              styles.addMediaText,
              isSelectModeActive && styles.disabledText,
            ]}
          >
            Add
          </Text>
        </TouchableOpacity>
        {media.map((item) => {
          const isSelected = selectedItemUris.includes(item.uri);
          return (
            <TouchableOpacity
              key={item.uri}
              style={[
                styles.mediaItemContainer,
                isSelected && styles.mediaItemSelected,
              ]}
              onPress={() => handleItemPress(item.uri, item.type)}
              onLongPress={() => handleItemLongPress(item.uri)}
              delayLongPress={200}
            >
              <RNImage // Use renamed RNImage
                source={{
                  uri:
                    item.type === "video" && item.thumbnailUri
                      ? item.thumbnailUri
                      : item.uri,
                }}
                style={styles.mediaPreview}
              />
              {item.type === "video" && !item.thumbnailUri && (
                <View style={styles.videoIndicator}>
                  <Video size={16} color="white" />
                </View>
              )}
              {item.type === "video" && item.thumbnailUri && (
                <View style={styles.videoIndicatorBottomLeft}>
                  <Video size={12} color="white" />
                </View>
              )}
              {/* Individual remove button removed entirely from grid items */}
              {isSelectModeActive && isSelected && (
                <View style={styles.selectionOverlay}>
                  <Plus
                    size={24}
                    color="white"
                    style={{ transform: [{ rotate: "45deg" }] }}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {imagesForViewer.length > 0 && (
        <ImageViewing
          images={imagesForViewer}
          imageIndex={currentImageIndex}
          visible={isImageViewerVisible}
          onRequestClose={() => setIsImageViewerVisible(false)}
          doubleTapToZoomEnabled
          swipeToCloseEnabled
          FooterComponent={({ imageIndex }) => (
            <View style={styles.viewerFooter}>
              <TouchableOpacity
                style={styles.viewerDeleteButton}
                onPress={() => {
                  const imageUriToDelete = imagesForViewer[imageIndex]?.uri;
                  if (imageUriToDelete) {
                    onRemoveMedia(imageUriToDelete);
                    setIsImageViewerVisible(false); // Close viewer after delete
                  }
                }}
              >
                <TrashIconViewer size={24} color={COLORS.error[500]} />
                <Text style={styles.viewerDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  selectModeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  selectModeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  selectModeButtonText: {
    ...TYPOGRAPHY.body,
    marginLeft: 4,
    color: COLORS.text.primary,
  },
  selectModeTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text.primary,
  },
  gridScrollView: {
    maxHeight: 325,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addMediaButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  addMediaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral[500],
    marginTop: 4,
  },
  disabledText: {
    color: COLORS.neutral[300],
  },
  mediaItemContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  mediaItemSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary[500],
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[200],
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  videoIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  videoIndicatorBottomLeft: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
    padding: 2,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
  },
  viewerFooter: {
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerDeleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  viewerDeleteButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error[400],
    marginLeft: 8,
    fontWeight: "bold",
  },
});
