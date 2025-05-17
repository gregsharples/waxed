import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import * as ImagePicker from "expo-image-picker";
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
  }[];
  onAddMedia: (media: { uri: string; type: "image" | "video" }) => void;
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
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Reverted: Not an array
        allowsEditing: true,
        quality: 1,
      });
      console.log("Image library result:", JSON.stringify(result, null, 2));

      if (!result.canceled) {
        const asset = result.assets[0];
        console.log("Selected asset:", JSON.stringify(asset, null, 2));
        onAddMedia({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        });
      } else {
        console.log("Image picking cancelled.");
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
          allowsEditing: true,
          quality: 1,
        });
        console.log("Camera launch result:", JSON.stringify(result, null, 2));

        if (!result.canceled) {
          const asset = result.assets[0];
          console.log("Captured asset:", JSON.stringify(asset, null, 2));
          onAddMedia({
            uri: asset.uri,
            type: asset.type === "video" ? "video" : "image",
          });
        } else {
          console.log("Camera capture cancelled.");
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
            <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
            {item.type === "video" && (
              <View style={styles.videoIndicator}>
                <Video size={16} color="white" />
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
  },
  videoIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
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
