# LKN AI Lab — API (for new pages)

When you add a new page that uses AI, tell Cursor:

> Follow `API.md`. Use our backend. Include my student ID.

## Rules

1. **Endpoint**
   ```
   POST https://lkn-ai-backend.vercel.app/api/generate
   ```

2. **Body** (JSON)
   ```json
   {
     "prompt": "your prompt string here",
     "userId": "<from lib/student-id.ts>"
   }
   ```

3. **Student ID**
   - Import from `@/lib/student-id`
   - Do **not** hardcode a new ID in the page
   - Set the ID once in `lib/student-id.ts`

## Example

```ts
import { userId } from "@/lib/student-id";

const BASE_URL = "https://lkn-ai-backend.vercel.app";

const res = await fetch(`${BASE_URL}/api/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt, userId }),
});

const data = await res.json();
// data.ideas = AI text reply
// data.creditsRemaining = credits left
```

## Notes

- Any prompt string is fine — the route does not require a special format.
- Credits come from the same backend (`/api/credits?userId=...`).
- This is shared AI text help, not a separate API per student app.
