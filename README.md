# 🥔 Potato Apps Website

Plain HTML/CSS/JS website for Potato Apps. No build tools, no npm, no frameworks.

---

## Quick edits

| What to change | Where |
|---|---|
| Support email | Search `PUT_YOUR_EMAIL_HERE` in all files and replace |
| App status (Coming Soon) | Find `badge-accent` + "Coming Soon" in apps.html / status-saver.html |
| Privacy policy date | `privacy.html` → Last updated line |
| Play Store link | Replace `#` in any button href with your real Play Store URL |
| Copyright year | Footer in each HTML file |

---

## File structure

```
index.html        ← Home page
apps.html         ← App catalog
status-saver.html ← App details page
privacy.html      ← Privacy policy (Google Play)
support.html      ← Support page
style.css         ← All styles + animations
script.js         ← Nav, scroll reveal, form, cursor glow
assets/           ← Put images/icons here
```

---

## Deploy to Vercel

1. Push all files to a GitHub repo
2. Go to vercel.com → Import project → Select your repo
3. Vercel auto-detects plain HTML — just click Deploy
4. Done ✅

---

## Deploy to Netlify

1. Push all files to a GitHub repo
2. Go to app.netlify.com → Add new site → Import from Git
3. Build command: leave blank
4. Publish directory: `/` (root)
5. Deploy ✅
