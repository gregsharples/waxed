import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { TYPOGRAPHY } from '@/constants/Typography';
import { Camera, Image as ImageIcon, Trash2, Video } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface MediaPickerProps {
  media: Array<{
    uri: string;
    type: 'image' | 'video';
  }>;
  onAddMedia: (media: { uri: string; type: 'image' | 'video' }) => void;
  onRemoveMedia: (uri: string) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  media,
  onAddMedia,
  onRemoveMedia,
}) => {
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
        type: asset.type === 'video' ? 'video' : 'image',
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        onAddMedia({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <ImageIcon size={24} color={COLORS.primary[600]} />
          <Text style={styles.buttonText}>Choose Media</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={takePhoto}>
          <Camera size={24} color={COLORS.primary[600]} />
          <Text style={styles.buttonText}>Take Photo/Video</Text>
        </TouchableOpacity>
      </View>

      {media.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaContainer}
        >
          {media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
              {item.type === 'video' && (
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
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary[50],
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primary[600],
    marginLeft: 8,
  },
  mediaContainer: {
    flexDirection: 'row',
  },
  mediaItem: {
    position: 'relative',
    marginRight: 8,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
});