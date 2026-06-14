# Missing YAZIO Endpoints Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 endpoints from `juriadams/yazio` reference repo to `swagger.json` and create one runnable example JS script per endpoint.

**Architecture:** All changes touch two areas: (1) `swagger.json` gets new `tags`, `paths`, and `definitions` entries; (2) `examples/` gets one plain-Node.js script per endpoint matching the existing style (`fetch`, hardcoded bearer token placeholder, `console.log`).

**Tech Stack:** Swagger 2.0 JSON, plain Node.js (no dependencies, native `fetch`)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `swagger.json` | Modify | Add 4 new tags, 6 new paths, 6 new schema definitions |
| `examples/get_dietary_preferences.js` | Create | Demo `GET /user/dietary-preferences` |
| `examples/get_exercises.js` | Create | Demo `GET /user/exercises?date=` |
| `examples/get_goals.js` | Create | Demo `GET /user/goals/unmodified?date=` |
| `examples/get_settings.js` | Create | Demo `GET /user/settings` |
| `examples/get_weight.js` | Create | Demo `GET /user/bodyvalues/weight/last?date=` |
| `examples/get_suggested_products.js` | Create | Demo `GET /user/products/suggested?date=&daytime=` |

---

### Task 1: Extend swagger.json — tags, paths, definitions

**Files:**
- Modify: `swagger.json`

- [ ] **Step 1: Add 4 new tags** inside the `"tags"` array (after the existing `"water"` tag):

```json
{ "name": "exercises",  "description": "User exercise and training log" },
{ "name": "goals",      "description": "User nutrition and activity goals" },
{ "name": "settings",   "description": "User app settings and preferences" },
{ "name": "bodyvalues", "description": "Body measurements (weight, etc.)" }
```

- [ ] **Step 2: Add 6 new paths** inside the `"paths"` object (after `/user/water-intake`):

```json
"/user/dietary-preferences": {
    "get": {
        "tags": ["user"],
        "summary": "Get dietary preferences",
        "description": "Returns the user's dietary restriction (e.g. vegetarian, vegan).",
        "security": [{ "oauth2": [] }],
        "responses": {
            "200": {
                "description": "Dietary preferences",
                "schema": { "$ref": "#/definitions/UserDietaryPreferences" }
            }
        }
    }
},
"/user/exercises": {
    "get": {
        "tags": ["exercises"],
        "summary": "Get exercises for a date",
        "description": "Returns training and custom_training entries logged by the user for a specific day.",
        "security": [{ "oauth2": [] }],
        "parameters": [
            { "name": "date", "in": "query", "required": true, "type": "string", "format": "date", "description": "e.g. 2024-01-15" }
        ],
        "responses": {
            "200": {
                "description": "Exercise entries",
                "schema": { "$ref": "#/definitions/UserExercisesResponse" }
            }
        }
    }
},
"/user/goals/unmodified": {
    "get": {
        "tags": ["goals"],
        "summary": "Get user goals for a date",
        "description": "Returns calorie, macro, water, step, and weight goals for the specified day.",
        "security": [{ "oauth2": [] }],
        "parameters": [
            { "name": "date", "in": "query", "required": true, "type": "string", "format": "date", "description": "e.g. 2024-01-15" }
        ],
        "responses": {
            "200": {
                "description": "User goals",
                "schema": { "$ref": "#/definitions/UserGoals" }
            }
        }
    }
},
"/user/settings": {
    "get": {
        "tags": ["settings"],
        "summary": "Get user settings",
        "description": "Returns boolean feature flags for trackers, reminders, and other app settings.",
        "security": [{ "oauth2": [] }],
        "responses": {
            "200": {
                "description": "User settings",
                "schema": { "$ref": "#/definitions/UserSettings" }
            }
        }
    }
},
"/user/bodyvalues/weight/last": {
    "get": {
        "tags": ["bodyvalues"],
        "summary": "Get last weight entry",
        "description": "Returns the most recent weight entry for the user on or before the given date, or null if none exists.",
        "security": [{ "oauth2": [] }],
        "parameters": [
            { "name": "date", "in": "query", "required": true, "type": "string", "format": "date", "description": "e.g. 2024-01-15" }
        ],
        "responses": {
            "200": {
                "description": "Weight entry or null",
                "schema": { "$ref": "#/definitions/UserWeight" }
            }
        }
    }
},
"/user/products/suggested": {
    "get": {
        "tags": ["products"],
        "summary": "Get suggested products for a meal slot",
        "description": "Returns products suggested for the user based on their history for a specific date and meal (daytime).",
        "security": [{ "oauth2": [] }],
        "parameters": [
            { "name": "date",    "in": "query", "required": true, "type": "string", "format": "date", "description": "e.g. 2024-01-15" },
            { "name": "daytime", "in": "query", "required": true, "type": "string", "enum": ["breakfast", "lunch", "dinner", "snack"] }
        ],
        "responses": {
            "200": {
                "description": "Suggested products",
                "schema": {
                    "type": "array",
                    "items": { "$ref": "#/definitions/UserSuggestedProduct" }
                }
            }
        }
    }
}
```

- [ ] **Step 3: Add 6 new schema definitions** inside the `"definitions"` object (after `WaterIntakeEntry`):

```json
"UserDietaryPreferences": {
    "type": "object",
    "properties": {
        "restriction": { "type": "string", "nullable": true, "example": "vegetarian", "description": "Dietary restriction label, or null if none" }
    }
},
"Exercise": {
    "type": "object",
    "properties": {
        "id":          { "type": "string", "format": "uuid" },
        "note":        { "type": "string", "nullable": true },
        "date":        { "type": "string", "example": "2024-01-15 08:00:00" },
        "name":        { "type": "string" },
        "external_id": { "type": "string", "nullable": true },
        "energy":      { "type": "number", "description": "Calories burned" },
        "distance":    { "type": "number" },
        "duration":    { "type": "number", "description": "Duration in seconds" },
        "source":      { "type": "string", "nullable": true },
        "gateway":     { "type": "string", "nullable": true },
        "steps":       { "type": "number" }
    }
},
"UserExercisesResponse": {
    "type": "object",
    "properties": {
        "training":        { "type": "array", "items": { "$ref": "#/definitions/Exercise" } },
        "custom_training": { "type": "array", "items": { "$ref": "#/definitions/Exercise" } }
    }
},
"UserGoals": {
    "type": "object",
    "description": "Daily goals for the user",
    "properties": {
        "energy.energy":      { "type": "number", "description": "Calorie goal in kcal" },
        "nutrient.protein":   { "type": "number", "description": "Protein goal in grams" },
        "nutrient.fat":       { "type": "number", "description": "Fat goal in grams" },
        "nutrient.carb":      { "type": "number", "description": "Carbohydrate goal in grams" },
        "activity.step":      { "type": "number", "description": "Step count goal" },
        "bodyvalue.weight":   { "type": "number", "description": "Target weight in kg" },
        "water":              { "type": "number", "description": "Water intake goal in ml" }
    }
},
"UserSettings": {
    "type": "object",
    "properties": {
        "has_water_tracker":               { "type": "boolean" },
        "has_diary_tipps":                 { "type": "boolean" },
        "has_meal_reminders":              { "type": "boolean" },
        "has_usage_reminders":             { "type": "boolean" },
        "has_weight_reminders":            { "type": "boolean" },
        "has_water_reminders":             { "type": "boolean" },
        "consume_activity_calories":       { "type": "boolean" },
        "has_feelings":                    { "type": "boolean" },
        "has_fasting_tracker_reminders":   { "type": "boolean" },
        "has_fasting_stage_reminders":     { "type": "boolean" }
    }
},
"UserWeight": {
    "type": "object",
    "nullable": true,
    "properties": {
        "id":          { "type": "string", "format": "uuid" },
        "date":        { "type": "string", "example": "2024-01-15 08:00:00" },
        "value":       { "type": "number", "nullable": true, "description": "Weight in kg" },
        "external_id": { "type": "string", "nullable": true },
        "gateway":     { "type": "string", "nullable": true },
        "source":      { "type": "string", "nullable": true }
    }
},
"UserSuggestedProduct": {
    "type": "object",
    "properties": {
        "product_id":       { "type": "string", "format": "uuid" },
        "amount":           { "type": "number", "description": "Amount in grams" },
        "serving":          { "type": "string", "nullable": true },
        "serving_quantity": { "type": "number", "nullable": true }
    }
}
```

- [ ] **Step 4: Validate swagger.json is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('swagger.json','utf8')); console.log('valid')"
```

Expected output: `valid`

- [ ] **Step 5: Commit**

```bash
git add swagger.json
git commit -m "feat: add 6 missing endpoints from juriadams/yazio reference"
```

---

### Task 2: Example script — dietary preferences

**Files:**
- Create: `examples/get_dietary_preferences.js`

Reference style: `examples/get_user_info.js`

- [ ] **Step 1: Create the file**

```js
const BASE_URL = "https://yzapi.yazio.com/v15";
const BEARER_TOKEN = "YOUR_ACCESS_TOKEN_HERE";

fetch(`${BASE_URL}/user/dietary-preferences`, {
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
})
  .then((r) => r.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
```

- [ ] **Step 2: Verify script runs without syntax errors**

```bash
node --check examples/get_dietary_preferences.js
```

Expected: no output (exit 0)

---

### Task 3: Example script — exercises

**Files:**
- Create: `examples/get_exercises.js`

- [ ] **Step 1: Create the file**

```js
const BASE_URL = "https://yzapi.yazio.com/v15";
const BEARER_TOKEN = "YOUR_ACCESS_TOKEN_HERE";
const DATE = new Date().toISOString().slice(0, 10);

fetch(`${BASE_URL}/user/exercises?date=${DATE}`, {
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
})
  .then((r) => r.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
```

- [ ] **Step 2: Verify script runs without syntax errors**

```bash
node --check examples/get_exercises.js
```

Expected: no output (exit 0)

---

### Task 4: Example script — goals

**Files:**
- Create: `examples/get_goals.js`

- [ ] **Step 1: Create the file**

```js
const BASE_URL = "https://yzapi.yazio.com/v15";
const BEARER_TOKEN = "YOUR_ACCESS_TOKEN_HERE";
const DATE = new Date().toISOString().slice(0, 10);

fetch(`${BASE_URL}/user/goals/unmodified?date=${DATE}`, {
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
})
  .then((r) => r.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
```

- [ ] **Step 2: Verify script runs without syntax errors**

```bash
node --check examples/get_goals.js
```

Expected: no output (exit 0)

---

### Task 5: Example script — settings

**Files:**
- Create: `examples/get_settings.js`

- [ ] **Step 1: Create the file**

```js
const BASE_URL = "https://yzapi.yazio.com/v15";
const BEARER_TOKEN = "YOUR_ACCESS_TOKEN_HERE";

fetch(`${BASE_URL}/user/settings`, {
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
})
  .then((r) => r.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
```

- [ ] **Step 2: Verify script runs without syntax errors**

```bash
node --check examples/get_settings.js
```

Expected: no output (exit 0)

---

### Task 6: Example script — weight

**Files:**
- Create: `examples/get_weight.js`

- [ ] **Step 1: Create the file**

```js
const BASE_URL = "https://yzapi.yazio.com/v15";
const BEARER_TOKEN = "YOUR_ACCESS_TOKEN_HERE";
const DATE = new Date().toISOString().slice(0, 10);

fetch(`${BASE_URL}/user/bodyvalues/weight/last?date=${DATE}`, {
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
})
  .then((r) => r.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
```

- [ ] **Step 2: Verify script runs without syntax errors**

```bash
node --check examples/get_weight.js
```

Expected: no output (exit 0)

---

### Task 7: Example script — suggested products

**Files:**
- Create: `examples/get_suggested_products.js`

- [ ] **Step 1: Create the file**

```js
const BASE_URL = "https://yzapi.yazio.com/v15";
const BEARER_TOKEN = "YOUR_ACCESS_TOKEN_HERE";
const DATE = new Date().toISOString().slice(0, 10);
const DAYTIME = "breakfast"; // change to: lunch | dinner | snack

fetch(`${BASE_URL}/user/products/suggested?date=${DATE}&daytime=${DAYTIME}`, {
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
})
  .then((r) => r.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
```

- [ ] **Step 2: Verify script runs without syntax errors**

```bash
node --check examples/get_suggested_products.js
```

Expected: no output (exit 0)

---

### Task 8: Commit example scripts and open PR

**Files:**
- All new `examples/get_*.js` files

- [ ] **Step 1: Commit all example scripts**

```bash
git add examples/get_dietary_preferences.js examples/get_exercises.js examples/get_goals.js examples/get_settings.js examples/get_weight.js examples/get_suggested_products.js
git commit -m "feat: add example scripts for 6 new endpoints"
```

- [ ] **Step 2: Push branch**

```bash
git push -u origin fix/api-endpoints-version-update
```

- [ ] **Step 3: Open PR targeting master**

```bash
gh pr create --base master --title "Add 6 missing API endpoints from juriadams/yazio reference" --body "$(cat <<'EOF'
## Summary

- Adds 6 endpoints present in the `juriadams/yazio` reference repo but missing from `swagger.json`:
  - `GET /user/dietary-preferences`
  - `GET /user/exercises`
  - `GET /user/goals/unmodified`
  - `GET /user/settings`
  - `GET /user/bodyvalues/weight/last`
  - `GET /user/products/suggested`
- Adds 4 new swagger tags: `exercises`, `goals`, `settings`, `bodyvalues`
- Adds 7 new schema definitions (including `Exercise`, `UserGoals`, `UserSettings`, `UserWeight`, `UserSuggestedProduct`, `UserDietaryPreferences`, `UserExercisesResponse`)
- Adds one runnable example JS script per new endpoint

## Test plan

- [ ] `node --check examples/get_dietary_preferences.js` — no syntax errors
- [ ] `node --check examples/get_exercises.js` — no syntax errors
- [ ] `node --check examples/get_goals.js` — no syntax errors
- [ ] `node --check examples/get_settings.js` — no syntax errors
- [ ] `node --check examples/get_weight.js` — no syntax errors
- [ ] `node --check examples/get_suggested_products.js` — no syntax errors
- [ ] `swagger.json` imports cleanly into https://editor-next.swagger.io/
- [ ] (with real token) each script returns expected JSON shape

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
