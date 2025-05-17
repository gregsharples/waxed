export interface User {
  id: string;
  email?: string;
  // Add other user-related fields as needed
}

export interface Session {
  id: string;
  userId: string;
  date: string; // ISO string
  time: string; // HH:MM
  duration: number; // in minutes
  location: string; // or a more complex Location object
  spotName?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  overallRating?: number; // e.g., 1-5 stars
  waveCount?: number;
  // Add other session-related fields
  board?: string; // Name or ID of the board used
  wetsuit?: string; // Thickness or type
  media?: MediaItem[];
  waveHeight?: WaveHeightOption;
  waveQuality?: WaveQualityOption;
  crowd?: CrowdOption;
}

export interface CrowdOption {
  id: string;
  label: string;
  iconName: string; // To store the name of the lucide icon (if used for a button UI)
  imageUri: string; // Added for ImageCarouselPicker
}

export interface MediaItem {
  id: string;
  type: "image" | "video";
  uri: string; // local or remote URI
  thumbnailUri?: string; // for videos
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  dateAchieved?: string; // ISO string
  iconName?: string; // For an icon library
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  maxLevel: number;
  description?: string;
  // lastPracticed?: string; // ISO string
}

export interface Lesson {
  id: string;
  title: string;
  category: string; // e.g., 'Beginner', 'Turns', 'Barrels'
  duration: string; // e.g., '15 min'
  contentUrl: string; // Link to video or article
  isCompleted: boolean;
  thumbnailUrl?: string;
  description?: string;
}

export interface LocationSuggestion {
  id: string; // Could be place_id from Google Places or similar
  name: string; // Main text (e.g., "Fistral Beach")
  description: string; // Secondary text (e.g., "Newquay, Cornwall, UK")
  latitude?: number;
  longitude?: number;
}

export interface WaveHeightOption {
  id: string;
  label: string; // e.g., "Ankle Biters"
  metric: string; // e.g., "< 0.3m"
  imageUri: string; // Placeholder: "placeholder_wave_ankle_biters.png"
  description?: string; // Optional detailed description
}

export interface WaveQualityOption {
  id: string;
  label: string; // e.g., "Blown Out"
  description: string; // e.g., "Total mess — strong wind, no shape"
  imageUri: string; // Placeholder: "placeholder_quality_blown_out.png"
}
