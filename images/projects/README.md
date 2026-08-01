# Project thumbnails

Every card on `work.html` shows **two images stacked in space** — a back slab and a
front slab. Nothing else. To change a thumbnail, replace the file. No HTML or CSS
edits, no cache-busting, no build step.

## Naming

```
w<NN>-<project>-a.jpg   ← back slab  (upper left, larger)
w<NN>-<project>-b.jpg   ← front slab (lower right, overlaps the back one)
```

`w<NN>` matches the W-number printed on the card, so the folder reads in the same
order as the page.

| Card | Project | Files | Source |
|------|---------|-------|--------|
| W-01 | Datalith | `w01-datalith-a/-b.jpg` | capture of ghazigh.github.io/AI_Data |
| W-02 | Sat Lab | `w02-satlab-a/-b.jpg` | capture of satlab-975f7.web.app |
| W-03 | IEEE Vis Explorer | `w03-vis-explorer-a/-b.jpg` | capture of ghazigh.github.io/3d-research |
| W-04 | RealAI | `w04-realai-a/-b.jpg` | capture of ghazigh.github.io/RealAI |
| W-05 | ARC Prize 2026 | `w05-arc-prize-a/-b.jpg` | designed panel — ARC task grids |
| W-06 | MVX | `w06-mvx-a/-b.jpg` | capture of ghazigh.github.io/MVX |
| W-07 | MecAI | `w07-mecai-a/-b.jpg` | designed panel — private project |
| W-08 | Agentic News System | `w08-agentic-news-a/-b.jpg` | designed panel — private project |

## What a good image looks like

- **1000 × 667 px** (3:2), JPEG, roughly 40–120 KB. Other ratios work — the slab
  crops from the centre — but 3:2 is what the layout is tuned for.
- **One idea per slab.** A whole page shrunk into a 280 px slab turns to mush; a
  single panel, table, map, or render stays readable.
- **Pair them so they differ.** Back slab wide and structural (a table, a map, a
  console), front slab tight and human (a phone, a chart, a detail). Two similar
  crops flatten the collage.
- The front slab covers the lower right of the back one — keep anything important
  in the back image's upper left.

## Making a new capture

```bash
# whole page, then crop in Preview
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 \
  --screenshot=shot.png "https://your-project-url/"
```

Add `--use-angle=swiftshader --enable-unsafe-swiftshader` for WebGL/Three.js pages,
which otherwise capture black.

## The designed panels

Three of these projects are confidential or have no public URL, so their slabs are
**illustrative interfaces**, not screenshots — built in
`thumb-lab/panels.html` and captured at 900 × 600. **The numbers in them are
placeholders.** Edit that file and re-capture if you want different content, or
just drop a real screenshot over the file when a project becomes shareable.

## Rolling back

The previous hand-drawn SVG plates are kept in `legacy/work-plates.html`, with the
CSS they used in `legacy/ai-researcher.css.bak`. The five directions that were
proposed live in `thumb-lab/` (`index.html`).