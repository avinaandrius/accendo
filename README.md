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
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env`.
4. Add the Project URL and publishable key. Never place a `sb_secret_...` key in a `VITE_` variable.
5. Restart the app.

If your Supabase project was connected before the onboarding/readiness update, also run `supabase/migration_app_readiness.sql` once in the SQL editor.

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
