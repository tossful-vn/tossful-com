# CLAUDE.md — tossful-vn/tossful-com

## What this repo is
`tossful.com` — brochure/router cho Tossful Salad Bar. 5 trang + calculator: `/` · `/menu` · `/about` · `/news` · `/careers` · `/calculator/`. Deep-link per-item/per-store sang **my.tossful** (hệ order + loyalty riêng). **KHÔNG có cart, KHÔNG auth, KHÔNG PII** trong repo/app này. Spec UX chuẩn: benchmark report Sweetgreen/Salad Project 2026-07-10 (Cowork OS, `08 Technology (CTO)`).

## Stack — LOCKED (K1 · DR-045)
**Plain HTML5 + CSS + vanilla JS. KHÔNG framework, KHÔNG Node, KHÔNG build step.** Không có `package.json`. Hosting: Vercel static, config duy nhất là `vercel.json` (`cleanUrls`, redirects). Fonts: Fraunces + Questrial (Google Fonts). Song ngữ VI/EN qua `html[lang]` + `localStorage('tossful-lang')`.

**Dữ liệu dinh dưỡng:** file tĩnh `/nutrition.json`, **regenerate từ Supabase `v_menu_published`** (master = `items.published_kcal`, xem `nutrition-master` trong Cowork OS). Trình duyệt `fetch('/nutrition.json')` — **KHÔNG có supabase-js, KHÔNG gọi thẳng Supabase từ client.** Không sửa `nutrition.json` bằng tay.

> ⚠️ **Repo này KHÔNG chứa key nào — kể cả anon key.** Thêm bất kỳ key/secret nào vào đây là quyết định cần Hiếu chốt, không phải chi tiết triển khai.

**KHÔNG thêm library, framework, dependency, vendor, service mới khi Hiếu chưa cho phép rõ ràng trong session.** Cụ thể với repo này: thêm `package.json` / npm / bundler / Next.js / React / CMS / analytics-tracking SDK / đổi hosting đều là **thay đổi kiến trúc**, phải nêu rõ "đây là dependency mới, cần phép" và dừng chờ Hiếu. Không lặng lẽ `npm install`. (`.gitignore` có sẵn `node_modules/`, `.next/` chỉ là lưới an toàn — **không phải** dấu hiệu được phép thêm framework.)

## Domain boundary
- App này chỉ ĐỌC reference data non-PII (menu/nutrition/stores). **Không bao giờ** query/ghi bảng có PII khách (`web_orders`, `profiles`, `byo_bowls`, `stamp_*`…) — đó là hệ my.tossful (DR-019/020: hai hệ tách vật lý, không SSO chung).
- Recipe/công thức nội bộ (Cốt) không bao giờ xuất hiện ở client (DR-015). `nutrition.json` chỉ chứa kcal/nutrition đã publish, không chứa định lượng công thức.
- Copy khách-hàng: tiếng Việt **đủ dấu**, giọng Tossful warm-casual.
- **Repo là static hosting: mọi file trong deployment đều public.** Thêm file nội bộ (doc, note, export, csv) → phải thêm vào `.vercelignore` cùng lúc, nếu không nó lên mạng. Kiểm chứng: `/nutrition.json` truy cập được từ ngoài.

## 🚦 CỔNG DEPLOY — HARD STOP (DR-047)

**Session Claude Code KHÔNG đọc được Cowork OS, nên luật chép đủ ở đây.**

`git push` lên `main` (→ Vercel production, `tossful.com`) = **vào production**. Trước khi push phải đủ **4 điều kiện**:

- **PL-1 — Có Plan.** Danh sách item đánh số, chia `[rẻ/không-deploy]` vs `[gộp-1-deploy]`, kèm đúng 1 debt item. Và Hiếu đã nói **"deploy"**.
- **PL-2 — Wireframe đã duyệt** nếu chạm FE/UI/HTML — click-through, không phải ảnh tĩnh. Dùng **Vercel preview deployment** (`tossful-com-*.vercel.app`) để duyệt; preview KHÔNG tính là production, cứ push branch thoải mái.
- **PL-3 — CR nháp đã viết** vào `00_Resources/change-register.md` (Cowork OS), bắt buộc có dòng **Rollback, viết TRƯỚC khi push**. Session này không với tới file đó → **in nguyên entry CR ra chat** cho Hiếu dán.
- **PL-4 — Không đảo quyết định nào** trong decision register. Nếu có → nói rõ "cái này đảo DR-NNN", **dừng chờ Hiếu**.

Thiếu 1 → **DỪNG, không push.** In bảng ✅/❌ 4 dòng, nêu đúng 1 việc cần Hiếu, rồi làm nốt phần tự làm được.

**Override:** chỉ khi Hiếu gõ **đúng chữ `BỎ GATE`**. "deploy đi", "nhanh lên", "ok push" **không tính**. Ghi vào CR: `**Gate:** ⚠️ BỎ GATE — <lý do>`.

**Không qua cổng:** đọc code · mở `index.html` xem local · dựng wireframe · push lên branch preview (không phải `main`).

## Build rules (theo `dev-sprint-cycle.md` — bản đầy đủ trong Cowork OS `00_Resources/`)
1. **Hiếu đọc ra một feature = đầu vào pha PLAN, KHÔNG phải lệnh build.** "thêm cái…", "sửa cái…", "làm cho tôi…" → trả về Plan, chờ chữ "deploy".
2. **Thứ tự trong mỗi feature: Data → Logic → UI (K4).** Repo này "Data" = `nutrition.json` / nội dung trang, chốt trước khi dựng UI.
3. **UI change → wireframe click-through cho Hiếu duyệt TRƯỚC khi code/deploy.** Preview deployment là cách rẻ nhất để làm việc này ở đây.
4. Batch theo chi phí deploy — gộp các thay đổi vào 1 push lên `main`.
5. Sau MỌI deploy: chạy **Check** [a]–[i] (spec trong `dev-sprint-cycle.md` §3) — **tự động, không chờ nhắc**. Với repo này tối thiểu: không lỗi HTML/JS (console sạch) · URL live đúng version · marker feature mới có trong DOM · không 500/blank · **không secret/file nội bộ trong deployment** · redirect trong `vercel.json` còn đúng · [i] không thêm field PII nào.
6. **Trước khi đóng sprint — thu hoạch BẮT BUỘC, cùng turn:** fail nào → `BL-NNN` (`build-lessons.md`) · cơn đau cơ chế (>1h/tuần, lặp lại) → `TD-NNN` (`debt-register.md`) · gì được chốt → `DR-NNN` (`decision-register.md`) · điền `Check:` + `Harvest:` vào CR. **"none" cũng phải gõ ra.** Không có đường thoát "để nhớ sau".

## Deploy mechanics
`git push` lên `main` → Vercel auto-deploy production. **Không deploy tay, không upload artifact.** Mọi branch có preview deployment — dùng preview URL khi đưa Hiếu duyệt.
**Rollback:** revert commit + push (`git revert <sha> && git push`), hoặc Vercel dashboard → Deployments → promote bản trước.

## Pointers (source of truth ở Cowork OS, không copy vào đây — tránh split-record DR-035)
- Quy trình: `00_Resources/dev-sprint-cycle.md` (**§0 CỔNG DEPLOY**) · Quyết định: `00_Resources/decision-register.md` (đọc trước khi đề xuất gì "mới") · **Thay đổi production: `00_Resources/change-register.md` (CR — bắt buộc mỗi deploy)** · Bài học: `00_Resources/build-lessons.md` · Nợ: `00_Resources/debt-register.md` · Nutrition sync: `00_Resources/nutrition-master.md`
- Chiến lược chuẩn: `08 Technology (CTO)/2026-07-29_Tossful_tech-strategy-blueprint+gap-assessment_v1.md`
