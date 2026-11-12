# Schewels Home redesign concepts

Nine working redesigns of schewelshome.com, plus a gallery with a live viewer and the audit behind them. Unofficial design exploration, not affiliated with Schewels Home.

| Path | Concept | The bet |
|---|---|---|
| `/` | Gallery | Live viewer (desktop, tablet, phone), comparison, about the maker |
| `/a/` | Since 1897 | Lead with the family story; mega menu, financing FAQ |
| `/b/` | Room first | Room picker that filters stock; payment estimator |
| `/c/` | Find your Schewels | Showroom finder is the hero |
| `/d/` | Doorbusters | One sale voice; savings calculator and tier savings |
| `/e/` | Match my room | Four-question quiz with top-three matches |
| `/f/` | Lookbook | Shop-the-photo hotspots, add the whole room |
| `/g/` | Aperture | Futuristic glass look, Ctrl K command bar, 3D tilt spotlight |
| `/h/` | Material Library | Shop by material and texture |
| `/i/` | Schewels OS | A desktop with draggable windows, Start menu and wallpapers |

## Shared features
`shared/features.js` powers every concept: cart and saved drawer, quick view, search suggestions, 52-showroom picker, filter and sort grids, financing estimate. State lives in `localStorage` so it carries across concepts.

## Deploy
Static files, no build. Works on GitHub Pages (deploy from `main`, root), Netlify, Vercel, Cloudflare Pages. Links are relative, so sub-path hosting is fine. Pages carry `noindex` and `robots.txt` disallows crawling.

## Sample content
Photos (Unsplash), products, prices and payment math are placeholders for demo only.

## Copyright
© 2026 Jacob Lucado. All rights reserved.

LucadoOS™ is a trademark of Jacob Lucado. Concept I is a Schewels-branded desktop inspired by it.
