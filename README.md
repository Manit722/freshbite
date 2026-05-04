
Action: file_editor create /app/static/README.md --file-text "# FreshBite Cafe — Static Site

A self-contained marketing + ordering + reservation site for **FreshBite Cafe, Lucknow**. Plain HTML, CSS and JavaScript — no framework, no backend, no build step.

## Files
- `index.html` — markup for all sections (Hero, About, Menu, Reserve, Gallery, Contact, Footer) plus cart drawer & checkout modal.
- `style.css` — full design system (Cormorant Garamond + Manrope, warm sand & forest-green palette, responsive grid).
- `script.js` — menu rendering, cart with localStorage, reservation form, contact form, checkout modal, toasts.

## Run locally
Just open `index.html` in a browser. Or serve the folder:

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy
Drop the three files onto any static host:
- **Netlify** / **Vercel** / **Cloudflare Pages**: drag-drop the folder.
- **GitHub Pages**: commit to a repo, enable Pages from Settings.
- **Any web server**: just upload via FTP/SFTP.

## Demo behaviour
- Cart persists across reloads via `localStorage`.
- Reservation, order checkout, and contact form **simulate** success client-side (no data is sent anywhere). To collect real submissions, plug in a form service like **Formspree**, **Web3Forms**, or **Getform**: replace the `placeOrder`, reservation, and contact handlers in `script.js` with a `fetch()` POST to your form endpoint.

## Customisation
- **Menu items** — edit `MENU_ITEMS` at the top of `script.js`.
- **Times / max guests** — edit `TIMES` and the guest loop in `fillReservationOptions`.
- **Colours / fonts** — change CSS custom properties in `:root` at the top of `style.css`.
- **Address / hours** — update text inside the contact and footer sections of `index.html`.
"
Observation: Create successful: /app/static/README.md
