# Feature: Learning Content (Learn/Explore Tab)

## Overview

This feature provides users with a library of learning materials related to surfing. This can include articles, videos, tutorials, tips, and other resources to help users improve their skills and knowledge. Content can be both directly tied to the progression framework and more general or tangential.

## User Interface (UI)

*   Accessed via the "Learn" (or "Explore") tab in the main navigation.
*   Likely a browsable interface, potentially with categories, search, and filtering.
*   Content may be presented as cards or list items, leading to detail views.

## Data Model / Supabase Integration:

### 1. `learning_resource_categories` Table (Potentially static or admin-managed):
    *   `id` (uuid, primary key)
    *   `name` (text, unique)
    *   `description` (text, nullable)
    *   `sort_order` (integer, nullable)

### 2. `learning_resources` Table:
    *   `id` (uuid, primary key, auto-generated)
    *   `category_id` (uuid, foreign key to `learning_resource_categories.id`, nullable)
    *   `title` (text)
    *   `type` (enum: 'article', 'video', 'link', 'pdf')
    *   `content_url` (text, if external like YouTube video or article link)
    *   `content_body` (text, if internally hosted article/text)
    *   `description_short` (text, nullable) - For display in lists/cards.
    *   `thumbnail_url` (text, nullable)
    *   `author` (text, nullable)
    *   `published_date` (date, nullable)
    *   `created_at` (timestamp with time zone, default `now()`)
    *   `updated_at` (timestamp with time zone, default `now()`)
    *   `is_featured` (boolean, default `false`)
    *   `tags` (array of text, nullable, e.g., `["technique", "beginner", "equipment"]`)

### 3. `skill_learning_resources` Table (Many-to-Many - defined in `progression.md`):
    *   Links `skills` to `learning_resources`. This allows learning content to be specifically associated with skills in the progression framework.

### 4. `user_learning_progress` Table (Optional, for tracking consumption):
    *   `id` (uuid, primary key)
    *   `user_id` (uuid, foreign key to `auth.users.id`)
    *   `resource_id` (uuid, foreign key to `learning_resources.id`)
    *   `status` (enum: 'not_started', 'in_progress', 'completed')
    *   `last_accessed` (timestamp with time zone)
    *   Unique constraint on (`user_id`, `resource_id`).

## Key Functionalities:

*   **Browse/List Content:** Display learning resources, possibly organized by category or recency.
*   **View Content Detail:**
    *   Display article text.
    *   Embed video player for video resources.
    *   Link out to external resources.
*   **Search & Filter:** Allow users to find specific content by keywords, tags, or categories.
*   **Content Recommendation:**
    *   Surface content relevant to the user's current skill level or goals (via `skill_learning_resources`).
    *   Highlight featured or new content.
*   **Track Consumption (Optional):** Allow users to mark content as read/watched or track progress.

## Content Management:

*   Learning resources will need to be curated and added to the `learning_resources` table. This might be done via an admin interface or by seeding data.
*   Content can be tagged and categorized for better organization and discovery.

## Future Enhancements:

*   User ratings and comments on learning resources.
*   Personalized learning paths.
*   Offline access to downloaded content.
*   Quizzes or knowledge checks related to content.
