# Quiz Night

Run with Node.js 20+: `npm start`, then open http://localhost:4173. No npm dependencies, API, database, or login is required for the local app. Node only serves static files; all quiz logic runs in the browser.

Includes both Episode 19 boards (50 questions). Choose a category/point tile, lock in guesses, pass the safety slide, reveal the answer, then explicitly finish the question. Reopening and leaving a question never marks it complete. Completed questions can be reviewed or marked available; Undo restores the last completion change.

Progress and edits persist in localStorage for this browser and origin. Different devices and URLs have separate progress. Clearing browser storage removes it. Use Manage board → Download backup / Restore backup to transfer state. Backups include board content, URLs and progress, but not image files; bundled assets are included with this app. External images need network access. Host the bundled files locally for use without internet (optional web fonts fall back to system fonts).

Manage board supports category names, points, text questions/answers, and HTTPS image URLs, plus adding/removing questions and categories. Category changes apply to the selected round. Save changes to apply edits. Reset clears completion marks for both rounds but retains all content.

Run `npm test` for board/asset and state-validation checks. `dist/` can also be served by any static host. Source quiz images: https://www.youtube.com/watch?v=C1bHN3fs62U

Answer views use the full original 16:9 frames shown in the PowerPoint. Older built-in cropped image references are upgraded automatically; custom images and completion marks are preserved.

## Deploy

Run `npm start` with Node.js 20 or newer. No `npm install` is needed. Set `PORT` to choose a listening port (default 4173); the server binds to 0.0.0.0.

Docker: `docker build -t quizz-master .` then `docker run --rm -p 4173:4173 quizz-master`.

Any static host can serve `dist/` directly instead. There is no authentication or ChatGPT sign-in in this standalone app. Progress remains private to each browser via localStorage, rather than being shared between players.
