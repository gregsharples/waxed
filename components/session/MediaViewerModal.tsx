import { COLORS } from "@/constants/Colors";
import { TYPOGRAPHY } from "@/constants/Typography";
import { X } from "lucide-react-native";
import React from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MediaItem {
  uri: string;
  type: "image" | "video";
  thumbnailUri?: string;
}

interface MediaViewerModalProps {
  isVisible: boolean;
  mediaItem: MediaItem | null;
  onClose: () => void;
  // onRemove: (uri: string) => void; // Will add later
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isVisible,
  mediaItem,
  onClose,
  // onRemove,
}) => {
  if (!mediaItem) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={28} color={COLORS.text.primary} />
            </TouchableOpacity>
            {/* TODO: Add Delete button here later */}
          </View>

          <View style={styles.contentContainer}>
            {mediaItem.type === "image" && (
              <Image
                source={{ uri: mediaItem.uri }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            {mediaItem.type === "video" && (
              // TODO: Implement video player using expo-av
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>
                  Video playback coming soon
                </Text>
                {mediaItem.thumbnailUri && (
                  <Image
                    source={{ uri: mediaItem.thumbnailUri }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)", // Semi-transparent background
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0, // Adjust if using status bar height
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between", // Pushes close to left, (future delete to right)
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 10, // Basic status bar handling
    height: 60, // Adjust as needed
    zIndex: 1,
  },
  closeButton: {
    padding: 8, // Make it easier to tap
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    width: "90%",
    height: "70%",
    backgroundColor: COLORS.neutral[200],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  videoPlaceholderText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: 10,
  },
});
