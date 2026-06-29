# Accendo

A mobile-first, lesson-based SIE study MVP inspired by the momentum and clarity of modern learning apps.

## Run locally

On Windows, double-click `Start Accendo.cmd`. Keep its terminal window open while using the app.

Or run it manually:

```bash
npm install
npm run dev
```

## Connect Supabase

1. Create a Supabase project.
2. For a new Supabase project, run `supabase/schema.sql` in the Supabase SQL editor.
   For an existing Supabase project, run `supabase/migration_full_profile_schema_sync.sql` once to add every profile/progress field the current frontend expects.
3. Copy `.env.example` to `.env`.
4. Add the Project URL and publishable key. Never place a `sb_secret_...` key in a `VITE_` variable.
5. Restart the app.

If you previously ran the older piecemeal migrations, still run `supabase/migration_full_profile_schema_sync.sql`. It uses `if not exists` checks and is safe to run without deleting existing data.

The full profile schema sync migration creates or verifies the columns used by the app today:

| Column | Type | Default | Why it exists |
| --- | --- | --- | --- |
| `name` | `text` | `'SIE Candidate'` | Display name and sidebar/profile UI |
| `full_name` | `text` | `null` | Signup profile metadata compatibility |
| `username` | `text` | `null` | Settings username and uniqueness |
| `email` | `text` | `null` | Account display and support context |
| `phone_number` | `text` | `null` | Signup uniqueness / one-account-per-person guard |
| `xp` | `integer` | `0` | XP totals and level display |
| `streak` | `integer` | `0` | Daily streak display |
| `daily_goal` | `integer` | `1` | Daily lesson goal tracking |
| `weekly_goal` | `integer` | `5` | Study preference storage |
| `exam_date` | `date` | `null` | Study preference / exam planning |
| `onboarded` | `boolean` | `false` | Prevents returning users from seeing onboarding again |
| `total_questions` | `integer` | `0` | Accuracy calculation |
| `correct_answers` | `integer` | `0` | Accuracy calculation |
| `mistakes` | `jsonb` | `'[]'` | Practice Hub mistake review |
| `lessons_today` | `integer` | `0` | Daily goal progress |
| `last_study_date` | `date` | `null` | Streak and daily goal reset logic |
| `lesson_attempts` | `jsonb` | `'{}'` | Check-in scores and retake tracking |
| `app_settings` | `jsonb` | `'{}'` | Theme, privacy, learning, notification, and AI settings |
| `created_at` | `timestamptz` | `now()` | Profile creation timestamp |
| `updated_at` | `timestamptz` | `now()` | Last profile update timestamp |

The migration also verifies `lesson_progress`, `feedback`, row-level security policies, and the phone-number availability helper used during signup.

Without Supabase keys, the sign-in screen provides a local demo mode. With keys present, accounts, profiles, and lesson completion use Supabase Auth and Postgres with row-level security.

The MVP includes:

- Email/password authentication
- A structured SIE learning path
- Interactive multiple-choice and fill-in-the-blank lessons
- Lesson completion, question review, and mistake tracking
- SIE readiness scoring, daily goals, XP levels, and progress bars
- Personalized study recommendations based on mistakes, goals, accuracy, and unlocked lessons
- 4 SIE readiness units with 12 core lessons per unit
- 10+ questions per lesson, recurring check-ins after every 3 lessons, and 20-question final unit check-ins
- 80% check-in gates before advancing to the next lesson set
- A Practice Hub for missed questions, weak topics, and check-in retakes
- Profile, goal, reminder, and privacy settings
- Supabase-backed profiles and lesson progress
- Local demo persistence before Supabase is connected
- Responsive desktop and mobile layouts

AI-generated curricula, deeper analytics, social features, and additional exams are natural next phases once the core learning experience has been validated.
