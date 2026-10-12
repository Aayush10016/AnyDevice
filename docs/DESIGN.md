# Visual system and references

Reviewed official GitHub Desktop documentation and its actual repository-bar screenshot, plus Raycast's documented list/search/detail/loading patterns. Used a compact navigation column, clearly separated list/detail surfaces, visible operation state and restrained typography. No proprietary branding or layout was copied. Figma Community and Linear designs were not inspected; no observations from them are claimed.

References:
- https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop
- https://docs.github.com/assets/cb-54160/images/help/desktop/explore-github-desktop.png
- https://developers.raycast.com/api-reference/user-interface/list

Tokens are in `src/styles.css`: off-white/graphite background, neutral surface/border/text hierarchy, muted blue-teal accent, semantic green/amber/red only for observed status. Segoe UI, 14px body, 26px page headings, 17px section headings, 12px evidence and 10px labels. Spacing uses mainly 8/12/16/24/32px increments; corners are 3–6px. No gradients, glass, emoji icons, decorative KPIs or invented graphs.

System-native title bar, Lucide icons, responsive inspector below inventory at smaller widths, visible focus outlines, semantic nav/buttons/table, status live region, reduced-motion support. Implemented empty/loading/error/partial/stale/no-findings/save-cancel states. Screen-reader and packaged visual QA remain release gates.
