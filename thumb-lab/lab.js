/* Thumbnail lab — renders the same three project cards in five
   thumbnail directions so they can be compared side by side. */

const PROJECTS = [
  {
    key: 'realai',
    num: 'W-03', kind: 'Vertical agents',
    title: 'Five AI agents for real-estate brokers',
    sub: 'RealAI',
    body: 'Prospecting, voice response, listing content, Bill 96 compliance, expired-listing recapture. Bilingual FR/EN.',
    stack: 'Next.js · voice · FR/EN',
    note: 'Visit site ↑',
    url: 'ghazigh.github.io/RealAI',
    accent: '#2F6E4E',
    accentSoft: 'rgba(47,110,78,.16)',
    accentGlow: 'rgba(74,164,113,.34)',
    accentInk: '#5FA37D',
    shots: { hero: 'shots/realai-hero.jpg', back: 'shots/realai-map.jpg', front: 'shots/realai-phone.jpg' },
    caption: 'Lead map · voice agent',
    fig: 'FIG. 03'
  },
  {
    key: 'mvx',
    num: 'W-08', kind: 'Research flagship',
    title: 'A simulator for connected cars',
    sub: 'MVX',
    body: 'A city rebuilt in CARLA, wireless rebuilt in Sionna, and the two kept in step so 6G models can train on both at once.',
    stack: 'CARLA · ray tracing · multi-agent',
    note: 'Visit project ↑',
    url: 'ghazigh.github.io/MVX',
    accent: '#356E8E',
    accentSoft: 'rgba(53,110,142,.16)',
    accentGlow: 'rgba(92,158,192,.32)',
    accentInk: '#6FA9C4',
    shots: { hero: 'shots/mvx-hero.jpg', back: 'shots/mvx-heat.jpg', front: 'shots/mvx-lidar.jpg' },
    caption: 'Ray-traced power map · LiDAR',
    fig: 'FIG. 08'
  },
  {
    key: 'datalith',
    num: 'W-01', kind: 'Data for agents',
    title: 'Make company data usable by AI agents',
    sub: 'Datalith',
    body: 'Maps a whole data estate into one knowledge graph, scores it for agent-readiness, and serves it through a governed MCP gateway.',
    stack: 'Knowledge graph · MCP · governance',
    note: 'Private · deck on request',
    url: 'internal build · access controlled',
    private: true,
    accent: '#9B3E1A',
    accentSoft: 'rgba(196,85,45,.16)',
    accentGlow: 'rgba(196,85,45,.34)',
    accentInk: '#D07A50',
    caption: 'Graph coverage · gateway',
    fig: 'FIG. 01'
  }
];

/* ---------- thumbnail renderers -------------------------------- */

const A = p => p.private ? `
  <div class="thumb">
    <div class="a-window">
      <div class="a-bar"><i class="a-dot"></i><i class="a-dot"></i><i class="a-dot"></i><span class="a-url">${p.url}</span></div>
      <div class="a-private">
        <div class="a-rows">${'<div class="a-row"></div>'.repeat(9)}</div>
        <div class="a-blur"></div>
        <div class="a-seal">Private build</div>
      </div>
    </div>
    <div class="a-stamp"><span>${p.fig} · interface, redacted</span><span class="a-live">Shipping</span></div>
  </div>` : `
  <div class="thumb">
    <div class="a-window">
      <div class="a-bar"><i class="a-dot"></i><i class="a-dot"></i><i class="a-dot"></i><span class="a-url">${p.url}</span></div>
      <div class="a-shot"><img src="${p.shots.hero}" alt=""></div>
    </div>
    <div class="a-stamp"><span>${p.fig} · live capture</span><span class="a-live">Online</span></div>
  </div>`;

const REG = `<svg class="b-reg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
  <circle cx="12" cy="12" r="7"/><path d="M12 1v22M1 12h22"/></svg>`;

const B = p => `
  <div class="thumb">
    <div class="b-plate">
      ${p.private ? bFigure() : `<img src="${p.shots.hero}" alt="">`}
      <div class="b-wash"></div>
      <div class="b-halftone"></div>
      ${REG}
      <span class="b-caption">${p.fig} · ${p.sub}</span>
    </div>
  </div>`;

function bFigure() {
  return `<div class="b-fig"><svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="250" fill="#F1EAD9"/>
    <g stroke="#9B3E1A" stroke-width="1.4" fill="none" opacity=".55">
      ${[[70,70],[140,44],[196,96],[120,140],[250,70],[300,140],[214,180],[336,84]]
        .map(([x, y]) => `<path d="M200 118 L${x} ${y}"/>`).join('')}
    </g>
    <g fill="#141210">
      ${[[70,70,9],[140,44,7],[196,96,6],[120,140,8],[250,70,7],[300,140,9],[214,180,6],[336,84,7]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}
    </g>
    <circle cx="200" cy="118" r="17" fill="#9B3E1A"/>
    <circle cx="200" cy="118" r="27" fill="none" stroke="#141210" stroke-width="1.6"/>
    <rect x="24" y="206" width="352" height="1" fill="#141210" opacity=".3"/>
  </svg></div>`;
}

const C = p => `
  <div class="thumb" style="--accent-soft:${p.accentSoft};--accent-ink:${p.accent}">
    <div class="c-field"><div class="c-grid"></div></div>
    <div class="c-stack">
      ${p.private ? `
      <div class="c-slab c-back c-panel">
        <div class="p-h">Estate scan · 412 tables</div>
        ${'<div class="p-row"><i class="p-key"></i><i class="p-bar"><span style="width:72%"></span></i></div>'.repeat(5)}
      </div>
      <div class="c-slab c-front c-panel">
        <div class="p-h">Agent-readiness</div>
        ${'<div class="p-row"><i class="p-key"></i><i class="p-bar"><span style="width:46%"></span></i></div>'.repeat(4)}
      </div>` : `
      <div class="c-slab c-back"><img src="${p.shots.back}" alt=""></div>
      <div class="c-slab c-front"><img src="${p.shots.front}" alt=""></div>`}
    </div>
    <span class="c-label">${p.caption}</span>
    <span class="c-chip">${p.private ? 'Private' : 'Live'}</span>
  </div>`;

const D_PANELS = {
  realai: `
    <div class="d-panel">
      <div class="d-top"><span>Lead engine · Montréal</span><span class="on">running</span></div>
      <div class="d-log">
        <div><b>scan</b> centris · duproprio · registre <i>· 1 284 signals</i></div>
        <div><b>qualify</b> intent + financing <i>· 47 match ICP</i></div>
        <div><b>call</b> +1 514 ••• <u>· 47 s · FR</u></div>
        <div><b>book</b> showing · thu 18:30 <i>· confirmed</i></div>
        <div><b>write</b> CRM + Centris card <i>· done</i></div>
      </div>
      <div class="d-meter" style="--to:74%"><span></span></div>
      <div class="d-rows">
        <div><span>showings booked · week</span><b>12</b></div>
        <div><span>expired listings recaptured</span><b>31</b></div>
      </div>
      <div class="d-foot"><span>five agents · one workflow</span><span><b>FR / EN</b></span></div>
    </div>`,
  mvx: `
    <div class="d-panel">
      <div class="d-top"><span>Scenario 07 · downtown</span><span class="on">ray tracing</span></div>
      <div class="d-spectrum">${Array.from({ length: 26 }, (_, i) =>
        `<i style="animation-delay:${(i * 0.09).toFixed(2)}s"></i>`).join('')}</div>
      <div class="d-track"><span></span></div>
      <div class="d-rows">
        <div><span>vehicles · sensors</span><b>48 · 6</b></div>
        <div><span>blockage predicted</span><b>t + 240 ms</b></div>
      </div>
      <div class="d-foot"><span>1.2 M paths · 28 GHz</span><span><b>SNR 24.6 dB</b></span></div>
    </div>`,
  datalith: `
    <div class="d-panel">
      <div class="d-top"><span>Estate graph · 412 tables</span><span class="on">indexing</span></div>
      <div class="d-graph"><svg viewBox="0 0 300 92" preserveAspectRatio="xMidYMid meet">
        <g class="edge">
          <path d="M40 62 L104 26"/><path d="M104 26 L168 58"/><path d="M168 58 L232 22"/>
          <path d="M40 62 L168 58"/><path d="M104 26 L232 22"/><path d="M232 22 L276 66"/>
          <path d="M168 58 L276 66"/>
        </g>
        <circle class="node dim" cx="40" cy="62" r="4"/><circle class="node" cx="104" cy="26" r="5"/>
        <circle class="node dim" cx="168" cy="58" r="4"/><circle class="node" cx="232" cy="22" r="5"/>
        <circle class="node dim" cx="276" cy="66" r="4"/>
      </svg></div>
      <div class="d-query">MATCH (t:Table)-[:JOINS]->(c:Contract) RETURN t</div>
      <div class="d-meter" style="--to:82%"><span></span></div>
      <div class="d-rows"><div><span>tables mapped · owners resolved</span><b>412 · 96%</b></div></div>
      <div class="d-foot"><span>gateway · scoped tools</span><span><b>readiness 0.82</b></span></div>
    </div>`
};

const D = p => `<div class="thumb">${D_PANELS[p.key]}</div>`;

const E = p => `
  <div class="thumb" style="--accent-glow:${p.accentGlow};--accent-ink:${p.accentInk}">
    <div class="e-field"></div>
    <span class="e-num">${p.num.split('-')[1]}</span>
    <span class="e-cap"><b>${p.sub}</b>${p.caption}</span>
    ${p.private ? `<div class="e-fig"><svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
        <g stroke="rgba(242,235,220,.32)" stroke-width="1" fill="none">
          ${[[250,60],[310,120],[218,168],[330,196],[192,96]].map(([x, y]) => `<path d="M266 124 L${x} ${y}"/>`).join('')}
        </g>
        <g fill="#D07A50">
          ${[[250,60,4],[310,120,5],[218,168,4],[330,196,3],[192,96,4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}
        </g>
        <circle cx="266" cy="124" r="9" fill="#D07A50"/>
        <circle cx="266" cy="124" r="20" fill="none" stroke="rgba(208,122,80,.45)"/>
      </svg></div>`
    : `<div class="e-inset"><img src="${p.shots.back}" alt=""></div>`}
    <div class="e-noise"></div>
  </div>`;

/* ---------- directions ----------------------------------------- */

const NOW = p => `
  <div class="thumb now-thumb"><img src="shots/cur-${p.key}.jpg" alt=""></div>`;

const DIRECTIONS = [
  {
    id: 'now', letter: '·', name: 'What is live today',
    thesis: 'The current plates, captured from work.html for comparison. Every project is drawn as the same kind of line figure, so nine cards end up with one texture and one weight — nothing tells you which of these actually shipped.',
    facts: ['<b>Private work</b> identical to public work', '<b>Effort</b> already built', '<b>Kept</b> nothing below replaces this until you pick'],
    thumb: NOW
  },
  {
    id: 'a', letter: 'A', name: 'Live capture, plated',
    thesis: 'The real product, shot in a browser and matted on paper like a plate in a printed report. Muted while resting so nine different colour schemes still sit together; the capture returns to full colour on hover.',
    facts: ['<b>Private work</b> redacted build sheet + seal', '<b>Effort</b> low — captures already made', '<b>Risk</b> nine site palettes fighting the paper'],
    thumb: A
  },
  {
    id: 'b', letter: 'B', name: 'Riso duotone',
    thesis: 'Every capture printed in the same two inks — rust and paper — with a halftone screen over it. The most editorial option and the only one where a green SaaS site and a blue city render read as one body of work. Hover restores the true colour.',
    facts: ['<b>Private work</b> drawn figure, same two inks', '<b>Effort</b> low — pure CSS blending', '<b>Risk</b> detail loss in dense screenshots'],
    thumb: B
  },
  {
    id: 'c', letter: 'C', name: 'Depth collage',
    thesis: 'Two real fragments of the interface tilted in space with true shadow, over a field tinted with the project\'s own accent. This is the case-study opener look — it shows the product is built, not diagrammed.',
    facts: ['<b>Private work</b> drawn panels, same geometry', '<b>Effort</b> medium — one crop pair per project', '<b>Risk</b> tilt is a trend; ages faster than A or B'],
    thumb: C
  },
  {
    id: 'd', letter: 'D', name: 'Instrument panel',
    thesis: 'No screenshots anywhere. Each card runs a small piece of the product itself — an agent run log, a spectrum sweep, a graph query typing itself. Public and private projects get identical treatment, so nothing looks second-class.',
    facts: ['<b>Private work</b> no disadvantage at all', '<b>Effort</b> high — one panel per project', '<b>Risk</b> nine live panels can get noisy'],
    thumb: D
  },
  {
    id: 'e', letter: 'E', name: 'Night plate',
    thesis: 'The work section goes dark against the warm page: a cinematic field lit by the project\'s accent, an oversized figure number, and the capture set into the panel. Highest contrast with the rest of the site — a deliberate gear change at §01.',
    facts: ['<b>Private work</b> constellation instead of a capture', '<b>Effort</b> medium — dark card variant needed', '<b>Risk</b> breaks the paper continuity of the site'],
    thumb: E
  }
];

/* ---------- render --------------------------------------------- */

const card = (p, dir) => `
  <article class="card">
    ${dir.thumb(p)}
    <div class="tag"><span class="num">${p.num}</span><span class="kind">${p.kind}</span></div>
    <h3>${p.title}</h3>
    <p class="sub">${p.sub}</p>
    <p class="body">${p.body}</p>
    <div class="meta"><span>${p.stack}</span><span class="note">${p.note}</span></div>
  </article>`;

document.getElementById('lab-main').innerHTML = DIRECTIONS.map(d => `
  <section class="dir ${d.id}" id="dir-${d.id}">
    <div class="dir-head">
      <div class="dir-num">${d.letter}</div>
      <div>
        <h2>${d.name}</h2>
        <p class="dir-thesis">${d.thesis}</p>
        <ul class="dir-facts">${d.facts.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="grid">${PROJECTS.map(p => card(p, d)).join('')}</div>
  </section>`).join('');

document.getElementById('lab-nav').innerHTML = DIRECTIONS
  .map(d => `<a href="#dir-${d.id}">${d.letter} · ${d.name}</a>`).join('');
