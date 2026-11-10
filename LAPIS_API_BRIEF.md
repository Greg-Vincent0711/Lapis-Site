# Lapis API: Website Integration Brief

As of 2026-11-10. Source: https://claude.ai/artifact/BBm1RzmQcXLeeHuTofQsGe

## Purpose

The Lapis API was redeployed and every route was tested live on 2026-11-10. The website now needs eight changes, listed under "Required changes", to work end to end. This brief is written for the coding agent working in the Lapis-Site repo (`~/lapis-site`, [GitHub](https://github.com/Greg-Vincent0711/Lapis-Site)).

Ground rules:

- **Change only the website.** The API contract below is fixed and was tested against the live Lambda. If something on the API side looks wrong, list it for the owner instead of working around it.
- **A location is identified by its name.** The API has no location id; the name is the key in every URL. Don't generate ids (uuid, `Date.now()`) to send to the API.
- **Read the server's error text.** Every API error body is `{"error": "..."}` and the message is written for end users, so show it instead of a generic "Failed to ...".
- `src/components/Dashboard/Dashboard.tsx` has uncommitted local edits. Check `git diff` before rewriting it.

## API basics

**Base URL:** `VITE_APP_API_ENDPOINT` = `https://aqi3pv08r1.execute-api.us-east-1.amazonaws.com/prod`. Send `Content-Type: application/json` on every request, uploads included.

The URL changed on 2026-11-10 when the API moved into CloudFormation. Update `VITE_APP_API_ENDPOINT` in `.env` and restart `npm run dev`; the old `ccuvznal88` URL no longer exists.

**Auth:** send the Cognito **ID token** as `Authorization: Bearer <token>`; `checkTokensAndFetch` already does this. API Gateway checks the token before the Lambda runs. A missing or expired token gets `401 {"message": "Unauthorized"}` from the gateway, the one error that uses `message` instead of `error`.

**Discord linking:** the API looks up the user's Discord id from their Cognito user on every call.

1. A signed-in user who hasn't linked Discord gets `403 {"error": "Discord account not linked. Connect Discord first."}` on every route except `/auth/callback`. This is the signal to show "Connect to Discord".
2. The button sends the user to Discord's authorize page with `redirect_uri` = `VITE_APP_DISCORD_REDIRECT_URI`.
3. Discord redirects to `/auth/callback?code=...`. `CallbackPage` posts `{"authCode": code}` to `POST /auth/callback` and gets `200` on success.
4. A code works once. A reused or expired code, or a `redirect_uri` that differs from the one the Lambda uses, gets `401 {"error": "Discord rejected the authorization code. Try connecting again."}`.

**Errors:** every error body is `{"error": "<message for the user>"}`.

| Status | Meaning |
| --- | --- |
| 400 | Invalid input (bad coordinates, name length, type, image), or the 10-location limit was reached |
| 401 | No valid Cognito token, or Discord rejected the auth code |
| 403 | Discord not linked yet |
| 404 | Location (or its image, or the user's seed) doesn't exist |
| 409 | A location with that name already exists |
| 500 / 502 | Server or S3 failure; show the message and let the user retry |

**CORS:** the API only allows the origins `http://localhost:5173`, `:5174` and `:5175`. A deployed site's domain must be added on the API side before it works. Tell the owner the domain; don't work around it.

## Route reference

These are every route the website can reach. `{name}` is the location name passed through `encodeURIComponent` ("My Base" → `My%20Base`). Any route not listed here, including `PUT /locations` without a name and `POST /locations/{id}/image`, returns `404 {"message": "Not Found"}` from the gateway.

| Method and path | Request body | Success | Errors |
| --- | --- | --- | --- |
| `GET /locations` | none | `200 {"locations": [Location, ...]}`, `[]` when the user has none | 401, 403 |
| `GET /locations/{name}` | none | `200 {"Coordinates", "Type", "Image_URL"?}` | 404 |
| `POST /locations` | `{"location_name", "type", "coords"}` | `201 {"location_name", "remaining_locations"}` | 400, 409 |
| `PUT /locations/{name}` | `{"coords"}` | `200 {"message", "coords"}` | 400, 404 |
| `DELETE /locations/{name}` | none | `200 {"message"}`; also deletes the location's image | 404 |
| `PUT /locations/{name}/img` | `{"image_base64", "content_type"}` | `201 {"msg", "imageUrl"}`; replaces any earlier image | 400, 404, 502 |
| `DELETE /locations/{name}/img` | none | `200 {"message"}` | 404 |
| `POST /auth/callback` | `{"authCode"}` | `200 {"message"}` | 400, 401 |
| `GET /seed` | none | `200 {"seed"}` | 404 if no seed is saved |
| `POST /seed` | `{"seed"}` | `201 {"msg"}` | 400 |

**Location object** returned by `GET /locations`:

```json
{"Location_Name": "My Base", "Coordinates": "10,64,-20", "Type": "Nether", "Image_URL": "https://lapis-memory-444277859488.s3.amazonaws.com/uploads/<discord id>/<random>.png"}
```

`Image_URL` is present only when the location has an image. The URL is public, so use it directly in `<img src>`.

**Field rules** (the API rejects anything else with 400):

- `location_name`: 3 to 30 characters. Names are unique per user **ignoring case**, so "Home" and "home" are the same location (409).
- `type`: exactly `"Overworld"`, `"Nether"` or `"The End"`.
- `coords`: three integers as `"x, y, z"` or `"x y z"`. X and Z must be within ±30,000,000; Y within −64 to 320. The API stores and returns `"x,y,z"`.
- Images: PNG or JPEG, 4 MB or less. `image_base64` may be a full data URL (`data:image/png;base64,...`, as `FileReader.readAsDataURL` produces) or plain base64 with `content_type` set to `image/png` or `image/jpeg`.
- Users can save up to 10 locations. The 11th save returns 400 with a message saying so.

## Required changes

The eight changes below are listed in the order to make them; each says what is wrong now and what to do instead.

### 1. `src/utils/checkToken.ts`: keep the status and the server's message

**Now:** a failed request throws a plain `Error`, so callers can't tell "not linked" (403) from a real failure.

**Change:** throw an error that carries the status, using the server's message:

```ts
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
// in checkTokensAndFetch, replacing the current !response.ok branch:
if (!response.ok) {
  const body = await response.json().catch(() => ({}));
  throw new ApiError(response.status, body.error ?? body.message ?? `Request failed: ${response.status}`);
}
```

### 2. `src/utils/utility.ts`: map the API's field names

**Now:** `normalizeOne` keeps `Type` and `Image_URL` under the API's names, so cards get `type === undefined` and never show images. It also sets no `id`.

**Change:** return `{ id: Location_Name, location_name: Location_Name, type: Type, imageUrl: Image_URL, xCoord, yCoord, zCoord }`. The name is the id; see Purpose.

### 3. `Dashboard.tsx` load: show "Connect to Discord" on 403

**Now:** checks `retrievedAPIData.length == 0`, which is never true because the response is an object. An unlinked user sees "Failed to load locations".

**Change:** on `200` set the locations and hide the button; `[]` is a normal empty state. Catch `ApiError` with `status === 403`, then show the Connect button and no error banner. Any other error shows `error.message`.

### 4. `Dashboard.tsx` `handleAddLocation`

**Now:** sends a uuid `id` the API ignores, then adds a card with a different `Date.now()` id. It shows a generic error.

**Change:** send only `{ location_name, type, coords: "x, y, z" }`. On success add the card with `id: location_name`. On failure show `error.message`, which covers 409 duplicate names, 400 bad input and the 10-location limit.

### 5. `AddLocationModal.tsx` and `LocationCard.tsx`: the type field

**Now:** `type` is a free-text input, and the API rejects anything but the three exact values.

**Change:** use a `<select>` with `Overworld` (default), `Nether` and `The End`.

### 6. `Dashboard.tsx` `handleEdit`, and the `LocationCard.tsx` edit mode

**Now:** sends `PUT /locations` (no name in the path), which the gateway rejects with 404. The card also lets the user edit the name and type, which the API can't change.

**Change:** send `PUT /locations/${encodeURIComponent(name)}` with `{ coords: "x, y, z" }`. Make the name and type read-only in edit mode; renaming would be a delete plus a new save. The coordinate inputs use `Number(value) || 0`, which turns a lone "-" into 0 while the user is typing a negative number. Keep the raw string while editing and convert on save.

### 7. `Dashboard.tsx` `handleDelete`

**Change:** send `DELETE /locations/${encodeURIComponent(location_name)}` and remove the card by name. The current code works once `id` is the name (change 2), but it must encode the name.

### 8. `Dashboard.tsx` `handleImageUpload`, and the `LocationCard.tsx` file input

**Now:** posts `multipart/form-data` to `POST /locations/{id}/image`, a route that doesn't exist.

**Change:** read the file as a data URL and send JSON through `checkTokensAndFetch`:

```ts
const dataUrl = await new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});
const res = await checkTokensAndFetch(`${API_ENDPOINT}/locations/${encodeURIComponent(name)}/img`, {
  method: "PUT",
  body: JSON.stringify({ image_base64: dataUrl, content_type: file.type }),
});
// res.imageUrl is the new public URL
```

In `LocationCard.tsx`, set `accept="image/png,image/jpeg"`. Reject files over 4 MB before uploading, with a message. Optionally add a "Remove image" action that calls `DELETE /locations/{name}/img`.

### Also: `CallbackPage.tsx`

The page already expects `200`, so the flow works. `main.tsx` uses `StrictMode`, which runs the effect twice in development and can post the same single-use code twice; the second post may get a 401 and send the user home. Guard the post with a `useRef` flag so it runs once.

## How to verify

Run `npm run dev` on `http://localhost:5173`, which the API already allows. Test against the live API with a real sign-in, then run `npm run build` and `npm run lint` with no errors.

- [ ] A new account that hasn't linked Discord sees "Connect to Discord" and no error banner.
- [ ] Connecting Discord returns to the dashboard and shows the user's saved locations, with the correct type on each card.
- [ ] A linked account with no locations sees the empty state and no Connect button.
- [ ] Adding "My Test Base" (Nether, 10 64 -20) creates a card; reloading the page keeps it.
- [ ] Adding "my test base" again shows the API's "already exists" message.
- [ ] Adding Y = 999 shows the API's Y-bounds message.
- [ ] Editing coordinates to -5 70 -5 saves; reloading the page shows the new values. Name and type aren't editable.
- [ ] Uploading a PNG shows the image on the card; reloading keeps it. A second upload replaces it.
- [ ] A GIF or a file over 4 MB is rejected with a message before anything is sent.
- [ ] Deleting "My Test Base" removes the card; reloading confirms it's gone.
- [ ] With 10 locations the Add button is disabled.
- [ ] Signing out and back in still shows the locations.

## Out of scope

These are API limits, not website bugs. Don't build around them; list anything that blocks you for the API owner.

- **No rename or type change.** Only coordinates can be updated.
- **Seed tools aren't on the HTTP API.** Nearest biome or structure and spawn-near are only available in the Discord bot; the gateway has no route for them.
- **Hosting.** Deploying the site needs three things set to the same production URL: `VITE_APP_DISCORD_REDIRECT_URI` here, the redirect list in the Discord developer portal, and the Lambda's `REDIRECT_URI` and gateway CORS origins on the API side. The API owner handles the last two.
- **Images are public.** Anyone with an image URL can open it; the URLs are long and random.
