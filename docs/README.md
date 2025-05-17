# Waxed App - Feature Development Plan

This document outlines the planned features and development strategy for the Waxed application.

## Overall App Structure

The application will be organized around a tab-based navigation system, with user profile and settings accessible from a header icon.

### Tab Bar (5 Tabs):

1.  **Home:** Dashboard providing an overview of recent activity, key statistics, and potentially upcoming items or relevant content.
2.  **Log Session (+):** Quick access to log a new surf session. This is a primary action for the user.
3.  **Session Tracking:** View history of logged surf sessions, including details, analytics, media (photos/videos), and coach's comments.
4.  **Progression:** Manage and update skill levels within a defined surfing progression framework. Access targeted learning materials relevant to current skill development.
5.  **Learn (or Explore):** Browse a wider range of learning materials, articles, tips, videos, and other tangential content related to surfing.

### Profile & Settings:

*   Accessed via a user icon in the app header.
*   Will contain user profile information, app settings, and potentially achievement displays.

## Core Features & Development Order

Development will proceed iteratively, focusing on one tab/feature set at a time.

1.  **Session Logging:**
    *   Allow users to input detailed information about their surf sessions (date, duration, location, conditions, overall rating, notes).
    *   Integrate media uploads (photos, videos) for sessions.
    *   Allow for coach's comments on sessions.
    *   Data to be stored in Supabase (`sessions` table, `session_media` table, Supabase Storage for files).
2.  **Session Tracking:**
    *   Display a list/history of logged sessions.
    *   Allow users to view detailed information for each session, including media and comments.
    *   Implement basic analytics and summaries (e.g., total sessions, hours surfed, common locations).
3.  **Progression Framework:**
    *   Define and implement the skill progression framework.
    *   Allow users to track and update their proficiency in various skills.
    *   Link skills to relevant learning materials within the "Learn" tab or directly.
4.  **Learning Content:**
    *   Curate and present a library of learning materials (articles, videos, tutorials).
    *   Potentially categorize content and allow for searching/filtering.
    *   Surface content relevant to user's progression.
5.  **Home Screen:**
    *   Design and implement the dashboard view.
    *   Aggregate and display key information from other sections (e.g., last session, current skill focus, new learning content).

## Future Considerations

*   Community features (e.g., sharing sessions, groups).
*   Surf forecasting and conditions integration.
*   Advanced analytics and personalized insights.

## Technology Stack

*   Frontend: React Native (Expo)
*   Backend & Database: Supabase
*   Styling: As per existing constants/styles.

This plan will be refined as development progresses. Each major feature will have its own detailed markdown document in this `docs` folder.
