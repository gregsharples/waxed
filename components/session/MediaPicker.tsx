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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      onAddMedia({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        onAddMedia({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        });
      }
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
