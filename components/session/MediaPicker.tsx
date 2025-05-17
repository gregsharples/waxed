import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Plus, Trash2, Video } from "lucide-react-native"; // PlusSquare will be removed by formatter if not used
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MediaPickerProps {
  media: {
    uri: string;
    type: "image" | "video";
    thumbnailUri?: string; // Added for video thumbnails
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
  const handleAddMediaPress = () => {
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
        mediaTypes: ["images", "videos"] as any, // Using lowercase strings as per error hint
        allowsEditing: false, // Disabled cropping
        quality: 1,
        allowsMultipleSelection: true, // Enabled multiple selection
      });
      console.log("Image library result:", JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets) {
        for (const asset of result.assets) {
          console.log("Selected asset (raw object):", asset); // Log raw asset object
          let thumbnailUri: string | undefined = undefined;
          if (asset.type === "video" && asset.uri) {
            console.log(
              `Attempting to generate thumbnail for video URI: ${asset.uri}`
            );
            try {
              const { uri: generatedThumbnailUri } =
                await VideoThumbnails.getThumbnailAsync(
                  // Corrected function name
                  asset.uri,
                  { time: 1000 } // Generate thumbnail at 1 second
                );
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
          // mediaTypes: ImagePicker.MediaTypeOptions.Images, // Option removed to rely on default
          allowsEditing: false, // Disabled cropping
          quality: 1,
        });
        console.log("Camera launch result:", JSON.stringify(result, null, 2));

        if (!result.canceled && result.assets) {
          const asset = result.assets[0]; // Camera returns a single asset
          console.log("Captured asset (raw object):", asset); // Log raw asset object
          let thumbnailUri: string | undefined = undefined;
          if (asset.type === "video" && asset.uri) {
            console.log(
              `Attempting to generate thumbnail for video URI (camera): ${asset.uri}`
            );
            try {
              const { uri: generatedThumbnailUri } =
                await VideoThumbnails.getThumbnailAsync(
                  // Corrected function name
                  asset.uri,
                  { time: 1000 } // Generate thumbnail at 1 second
                );
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
      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.addMediaButton}
          onPress={handleAddMediaPress}
        >
          <Plus size={32} color={COLORS.neutral[500]} />
          <Text style={styles.addMediaText}>Add</Text>
        </TouchableOpacity>
        {media.map((item, index) => (
          <View key={index} style={styles.mediaItem}>
            <Image
              source={{
                uri:
                  item.type === "video" && item.thumbnailUri
                    ? item.thumbnailUri
                    : item.uri,
              }}
              style={styles.mediaPreview}
            />
            {item.type === "video" &&
              !item.thumbnailUri && ( // Show video icon only if no thumbnail
                <View style={styles.videoIndicator}>
                  <Video size={16} color="white" />
                </View>
              )}
            {/* Optionally, always show a small video icon even with thumbnail */}
            {item.type === "video" && item.thumbnailUri && (
              <View style={styles.videoIndicatorBottomLeft}>
                <Video size={12} color="white" />
              </View>
            )}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveMedia(item.uri)}
            >
              <Trash2 size={16} color={COLORS.error[600]} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // space between items
  },
  addMediaButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1, // Removed border
    // borderColor: COLORS.neutral[300], // Removed border
  },
  addMediaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral[500],
    marginTop: 4,
  },
  mediaItem: {
    position: "relative",
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[200], // Added a background color for loading/error states
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
    // Style for the small video icon on thumbnails
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
});
