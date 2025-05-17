# Feature: Session Tracking

## Overview

This feature allows users to view their history of logged surf sessions, analyze their activity, and review media and comments associated with each session. It serves as the primary interface for users to reflect on their past experiences.

## User Interface (UI)

*   Accessed via the "Session Tracking" (or "Track") tab in the main navigation.
*   Likely a list-based view initially, with options to filter or sort sessions.
*   Tapping on a session in the list will navigate to a detailed view of that session.

## Data Display:

### List View:
*   Summary of each session (e.g., Date, Location, Duration, Overall Rating).
*   Potentially a thumbnail if media is attached.

### Detail View:
*   All logged data points from the `sessions` table for the selected session.
*   Display of associated media (photos, videos) from the `session_media` table.
*   Coach's comments.

## Supabase Integration:

*   Fetches data primarily from the `sessions` table, joined with `session_media` for media details.
*   Queries will be filtered by `user_id` to show only the logged-in user's sessions.
*   RLS policies on Supabase will enforce this data access.

## Key Functionalities:

*   **List Sessions:** Display a scrollable list of past sessions.
    *   Implement pagination or infinite scrolling for large numbers of sessions.
*   **View Session Details:** Show all information for a selected session.
*   **Media Display:**
    *   Image gallery/viewer.
    *   Video player.
*   **Filtering/Sorting (Future):**
    *   Filter by date range, location, rating, etc.
    *   Sort by date, duration, rating, etc.
*   **Basic Analytics (Initial):**
    *   Total number of sessions.
    *   Total hours surfed.
    *   Most frequent locations.
    *   Average rating.
*   **Edit/Delete Session (Future):** Provide functionality to modify or remove logged sessions.

## Analytics & Summaries (Can be expanded over time):

*   Charts showing sessions over time.
*   Breakdown of sessions by location.
*   Trends in wave height, duration, or ratings.

## Future Enhancements:

*   Advanced search capabilities.
*   More sophisticated analytics and visualizations.
*   Ability to compare sessions.
*   Export session data.
