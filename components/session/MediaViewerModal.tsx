import { COLORS } from "@/constants/Colors";
import { ResizeMode, Video } from "expo-av"; // Added Video and ResizeMode from expo-av
import { Trash2, X } from "lucide-react-native"; // Added Trash2
import React, { useRef } from "react"; // Added useRef for video
import {
  Image,
  Modal,
  Platform, // Added Platform
  SafeAreaView,
  StyleSheet,
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
  onRemove: (uri: string) => void; // Added onRemove
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isVisible,
  mediaItem,
  onClose,
  onRemove,
}) => {
  const videoRef = useRef<Video>(null);

  const handleDelete = () => {
    if (mediaItem) {
      onRemove(mediaItem.uri);
      onClose(); // Close modal after deletion
    }
  };

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
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <X size={28} color={COLORS.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.headerButton}
            >
              <Trash2 size={24} color={COLORS.error[500]} />
            </TouchableOpacity>
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
              <Video
                ref={videoRef}
                style={styles.video}
                source={{
                  uri: mediaItem.uri,
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false} // Or true, depending on preference
                shouldPlay={true} // Autoplay when modal opens
                onError={(error) => console.error("Video Error:", error)}
              />
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
    backgroundColor: "black", // Changed to solid black
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
    paddingTop: Platform.OS === "android" ? 16 : 10,
    height: 60,
    zIndex: 1,
  },
  headerButton: {
    // Renamed from closeButton for clarity
    padding: 8,
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
  video: {
    // Style for the Video component
    width: "100%",
    height: "100%",
  },
});
