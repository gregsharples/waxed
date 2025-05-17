# Feature: Progression Framework

## Overview

This feature allows users to track their development against a predefined surfing skill framework. Users can update their proficiency in various skills and access learning materials relevant to their current level and goals.

## User Interface (UI)

*   Accessed via the "Progression" tab in the main navigation.
*   Will likely display categories of skills (e.g., Paddling, Wave Riding, Maneuvers).
*   Within each category, individual skills will be listed, showing current proficiency.
*   Users can interact to update their skill levels.

## Data Model / Supabase Integration:

### 1. `skill_categories` Table (Potentially static or admin-managed):
    *   `id` (uuid, primary key)
    *   `name` (text, unique)
    *   `description` (text, nullable)
    *   `sort_order` (integer, nullable)

### 2. `skills` Table (Potentially static or admin-managed):
    *   `id` (uuid, primary key)
    *   `category_id` (uuid, foreign key to `skill_categories.id`)
    *   `name` (text)
    *   `description` (text, nullable)
    *   `levels_of_proficiency` (jsonb, e.g., `["Beginner", "Developing", "Competent", "Advanced"]` or defined criteria for each level)
    *   `sort_order` (integer, nullable)

### 3. `user_skill_progress` Table:
    *   `id` (uuid, primary key, auto-generated)
    *   `user_id` (uuid, foreign key to `auth.users.id`)
    *   `skill_id` (uuid, foreign key to `skills.id`)
    *   `current_level` (text) - Matches one of the defined levels in `skills.levels_of_proficiency`.
    *   `last_updated` (timestamp with time zone, default `now()`)
    *   `notes` (text, nullable) - User's notes on their progress for this skill.
    *   Unique constraint on (`user_id`, `skill_id`).

### 4. `skill_learning_resources` Table (Many-to-Many between `skills` and a future `learning_resources` table):
    *   `skill_id` (uuid, foreign key to `skills.id`)
    *   `resource_id` (uuid, foreign key to `learning_resources.id`) - *`learning_resources` table to be defined for the "Learn" tab.*
    *   Primary key (`skill_id`, `resource_id`).

## Key Functionalities:

*   **Display Skill Framework:** Show categories and skills with current user progress.
*   **Update Skill Level:** Allow users to select their new proficiency level for a skill.
*   **View Skill Details:** Show description, proficiency levels, and potentially user notes for a skill.
*   **Link to Learning Resources:**
    *   Display or link to learning materials from the "Learn" tab that are specifically tagged for the selected skill or skill level.
*   **Track Progress Over Time (Future):** Visualize how skill levels have changed.

## Content Management:

*   The `skill_categories` and `skills` tables will likely be pre-populated with the surfing progression framework. This might be done via seed data or an admin interface.

## Future Enhancements:

*   Personalized skill recommendations based on logged sessions or goals.
*   Gamification elements (badges, points for skill advancement).
*   Coach validation of skill levels.
*   Community benchmarks or comparisons (anonymous).
