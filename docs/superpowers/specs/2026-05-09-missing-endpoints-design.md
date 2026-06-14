# Missing Endpoints — Design Spec

**Date:** 2026-05-09  
**Branch:** based on `fix/api-endpoints-version-update`

## Goal

Add 6 endpoints present in the `juriadams/yazio` reference repo but missing from `swagger.json`. Add one example JS script per endpoint for manual testing.

## Endpoints to Add

| Path | Method | Tag | Description |
|---|---|---|---|
| `/user/dietary-preferences` | GET | `user` | Returns `{ restriction: string \| null }` |
| `/user/exercises` | GET | `exercises` | Date param; returns `{ training, custom_training }` arrays |
| `/user/goals/unmodified` | GET | `goals` | Date param; returns calorie/macro/step/weight goals object |
| `/user/settings` | GET | `settings` | Returns boolean flags for app features/reminders |
| `/user/bodyvalues/weight/last` | GET | `bodyvalues` | Date param; returns last weight entry or null |
| `/user/products/suggested` | GET | `products` | Date + daytime params; returns suggested product array |

## Schema Definitions to Add

- `UserDietaryPreferences` — `{ restriction: string | null }`
- `Exercise` — id, note, date, name, external_id, energy, distance, duration, source, gateway, steps
- `UserGoals` — energy, protein, fat, carb, step, weight, water fields
- `UserSettings` — boolean feature/reminder flags
- `UserWeight` — id, date, value, external_id, gateway, source
- `UserSuggestedProduct` — product_id, amount, serving, serving_quantity

## Tags to Add

New swagger tags: `exercises`, `goals`, `settings`, `bodyvalues`

## Example Scripts

One file per endpoint in `examples/`, matching existing style (plain Node.js, `fetch`, hardcoded bearer token placeholder):

- `get_dietary_preferences.js`
- `get_exercises.js`
- `get_goals.js`
- `get_settings.js`
- `get_weight.js`
- `get_suggested_products.js`

## Out of Scope

- Updating existing schema fields in `UserInfo`, `DailySummary`, `WaterIntakeEntry`
- Adding POST/DELETE for any new endpoint (reference repo doesn't document them)
