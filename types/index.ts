export interface User {
  id: string;
  email?: string;
  // Add other user-related fields as needed
}

export interface Session {
  id: string;
  user_id: string;
  date: string; // ISO string
  duration_minutes: number;
  location: string;
  location_id?: string;
  latitude?: number;
  longitude?: number;
  wave_height?: string;
  wave_quality?: string;
  crowd?: string;
  notes?: string;
  rating?: number;
  media?: string; // JSON string in the DB
  created_at: string;
  updated_at: string;

  // Keep legacy fields for backward compatibility
  userId?: string;
  time?: string;
  duration?: number;
  description?: string;
  overallRating?: number;
  waveCount?: number;
  board?: string;
  wetsuit?: string;
  waveHeight?: WaveHeightOption;
  waveQuality?: WaveQualityOption;
  spotName?: string;
}

export interface CrowdOption {
  id: string;
  label: string;
  iconName: string; // To store the name of the lucide icon (if used for a button UI)
  imageUri: number; // Changed to number for require() result
  description?: string; // Added for crowd descriptions
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
  imageUri: number; // Changed to number for require() result
  description?: string; // Optional detailed description
}

export interface WaveQualityOption {
  id: string;
  label: string; // e.g., "Blown Out"
  description: string; // e.g., "Total mess — strong wind, no shape"
  imageUri: number; // Changed to number for require() result
}
