# tossful.com — marketing site

Static HTML/CSS/JS marketing site for tossful.com. No framework. No build step. Five pages + calorie calculator.

## Pages

- `/` — Home (hero carousel, signature bowls, menu preview, popup welcome offer)
- `/menu` — Full menu (signatures, BYO, drinks)
- `/about` — Câu chuyện Tossful + store cards (Capital Place HN + Metropole Thủ Thiêm HCMC)
- `/news` — Tin tức (4 tabs: All / Promotions / Events / Announcements)
- `/careers` — Tuyển dụng (HN / HCM tabs + Google Form apply links)
- `/calculator/` — Calo & nutrition calculator (synced copy from web-order project)

## Stack

- Plain HTML5 + CSS + vanilla JS. No Node, no build.
- Fraunces (display) + Questrial (body) from Google Fonts.
- Brand tokens at top of `style.css`.
- Bilingual VI/EN — `html[lang]` + `localStorage('tossful-lang')`.

## Local preview

Open `index.html` in any browser. No server needed.

## Deploy

Vercel auto-deploys from `main` branch.

Production target: `tossful.com`. Preview deployments at `tossful-com-*.vercel.app`.

## Order CTA

All Order / "Đặt hàng" buttons link to `https://beacons.ai/tossful`.

## Related projects

- `web-order` — Tossful.com v1 customer dashboard + ordering (separate Next.js project, future merger planned)
- `calculator/` — synced copy of `web-order/workshop/nutrition-calculator/`

## Maintenance notes

- Social links: Facebook + Instagram in footer. TikTok / LinkedIn add when handles confirmed.
- News articles currently static — full CMS deferred.
- Add favicon PNG 512×512 (currently SVG mark only).
