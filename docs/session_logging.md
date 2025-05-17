# Feature: Session Logging

## Overview

This feature allows users to log detailed information about their surf sessions. It's a core input mechanism for the application, providing the data for session tracking, analytics, and progression monitoring.

## User Interface (UI)

*   Accessed via the primary "+" tab in the main navigation and potentially from the "Session Tracking" tab.
*   Form-based input for various session parameters.

## Data Points to Capture:

*   **Date & Time:** When the session occurred.
*   **Duration:** Length of the session (e.g., in hours).
*   **Location:** Surf spot where the session took place.
*   **Wave Height:** Estimated wave height (e.g., in meters/feet).
*   **Wind Speed & Direction:** (Optional, but useful for context).
*   **Temperature:** Air/Water temperature (Optional).
*   **Overall Experience Rating:** Subjective rating (e.g., 1-5 stars).
*   **Notes:** Free-text area for personal observations, what was practiced, etc.
*   **Media:**
    *   Ability to upload photos.
    *   Ability to upload short video clips.
*   **Coach's Comments:** A dedicated section for a coach (if applicable) to add feedback or notes.

## Supabase Integration:

### 1. `sessions` Table:
    *   `id` (uuid, primary key, auto-generated)
    *   `user_id` (uuid, foreign key to `auth.users` table)
    *   `created_at` (timestamp with time zone, default `now()`)
    *   `session_date` (timestamp with time zone) - *Note: Renamed from `date` to be more specific*
    *   `duration_hours` (float)
    *   `location_name` (text) - *Consider normalizing to a `locations` table later if more detail is needed per location.*
    *   `wave_height_meters` (float, nullable)
    *   `wind_speed_kmh` (integer, nullable)
    *   `temperature_celsius` (integer, nullable)
    *   `overall_rating` (integer, 1-5, nullable)
    *   `notes` (text, nullable)
    *   `coach_comments` (text, nullable)

### 2. `session_media` Table:
    *   `id` (uuid, primary key, auto-generated)
    *   `session_id` (uuid, foreign key to `sessions.id`, onDelete: cascade)
    *   `user_id` (uuid, foreign key to `auth.users` table)
    *   `created_at` (timestamp with time zone, default `now()`)
    *   `file_path` (text) - Path to the file in Supabase Storage.
    *   `media_type` (enum: 'image', 'video')
    *   `storage_bucket` (text, default 'session_media') - To specify which bucket the file is in.
    *   `file_name` (text, nullable)
    *   `file_size_bytes` (integer, nullable)
    *   `mime_type` (text, nullable)

### 3. Supabase Storage:
    *   A bucket named `session_media` will be created.
    *   Row Level Security (RLS) policies will be set up to ensure users can only upload/access their own media.

## Key Functionalities:

*   Form validation for required fields.
*   Date and time pickers.
*   Sliders or numerical inputs for quantitative data.
*   Location selection (initially text input, could evolve to a picker from saved locations).
*   Media upload interface (select from gallery, take new photo/video).
*   Saving session data to Supabase.
*   Displaying success/error messages.
*   Clearing the form after successful submission.

## Future Enhancements:

*   Tagging sessions (e.g., board used, maneuvers practiced).
*   More detailed condition logging (tide, swell period/direction).
*   Integration with surf forecasting APIs to pre-fill conditions.
