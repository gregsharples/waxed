# Feature: Home Screen

## Overview

The Home screen serves as the main dashboard for the user, providing a quick overview of their recent activity, key statistics, and potentially surfacing relevant information like upcoming sessions (if planned), new learning content, or reminders related to their progression.

## User Interface (UI)

*   Accessed via the "Home" tab in the main navigation.
*   Will likely consist of several sections or "cards" displaying different pieces of information.
*   Should be visually engaging and provide actionable insights or quick navigation to other parts of the app.

## Data Display & Content:

The Home screen will aggregate data from various other features. Examples include:

*   **Welcome Message:** Personalized greeting.
*   **Summary Statistics:**
    *   Total sessions logged.
    *   Total hours surfed.
    *   Current focus skill (from Progression).
*   **Recent Activity:**
    *   Card for the last logged session (with a link to its detail view).
    *   Recently viewed or new learning content.
*   **Progression Snapshot:**
    *   Current overall progress or a highlighted skill being worked on.
    *   Link to the Progression tab.
*   **Quick Actions (Potentially):**
    *   Button to "Log New Session".
*   **Featured Content:**
    *   Highlight a new learning article or video.

## Supabase Integration:

*   The Home screen will make multiple queries to Supabase to fetch data from:
    *   `sessions` table (for recent session, summary stats).
    *   `user_skill_progress` table (for progression snapshot).
    *   `learning_resources` table (for featured or new content).
*   All data will be filtered by `user_id`.

## Key Functionalities:

*   **Display Aggregated Data:** Combine and present information from different parts of the app in a concise way.
*   **Navigation:** Provide clear links to relevant sections (e.g., view last session, go to progression, open learning item).
*   **Personalization:** Tailor the displayed information to the user's activity and progress.
*   **Dynamic Content:** Ensure the content updates as the user interacts with other parts of the app.

## Design Considerations:

*   Prioritize the most important information for the user.
*   Use clear and visually appealing components (cards, charts, icons).
*   Ensure good performance, as it might involve fetching data from multiple sources.

## Future Enhancements:

*   Integration with surf forecasting (if added as a feature).
*   Display of upcoming planned sessions or goals.
*   More interactive charts or data visualizations.
*   Customizable dashboard layout by the user.
