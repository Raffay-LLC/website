import {
  CREDENTIALS,
  HERO,
  LINKS,
  NOW,
  PARTNER,
  PROFILE,
  PROJECTS,
  QA_LIST,
  SITE,
  SKILLS,
  TIMELINE,
  WRITING,
  type Span,
} from './content'

function plain(spans: Span[]): string {
  return spans.map((s) => (typeof s === 'string' ? s : s.text)).join('')
}

/**
 * The only knowledge the "Ask about my work" function may use. Generated from
 * content.ts at build time (scripts/prerender.mjs writes it to
 * netlify/functions/knowledge.json), so answers cannot drift from the page.
 */
export function buildKnowledge() {
  return {
    generatedFrom: 'src/content.ts',
    person: {
      name: PROFILE.name,
      title: PROFILE.role,
      summary: `${HERO.line.join(' ')} ${HERO.sub[0]}${HERO.sub[1]}Tiercel.`,
      location: PROFILE.location,
      email: PROFILE.email,
      website: SITE.url,
      links: LINKS.map((l) => ({ label: l.label, url: l.href })),
    },
    company: {
      name: 'Tiercel',
      url: 'https://tiercel.io',
      about:
        'An independent software company that builds AI-powered apps and partners with companies to build theirs.',
      partnerWork: PARTNER.lead,
      partnerShapes: PARTNER.shapes,
    },
    projects: PROJECTS.map((p) => ({
      name: p.display,
      ...(p.name !== p.display ? { officialName: p.name } : {}),
      kind: p.kind,
      period: p.period,
      role: p.role,
      status: p.status.label,
      platforms: p.platforms,
      link: p.href,
      page: `${SITE.url}/work/${p.slug}`,
      tagline: p.tagline,
      problem: p.problem,
      built: p.built,
      stack: p.stack,
      outcomes: p.outcomes.map((o) => `${o.figure} ${o.label}`),
    })),
    experience: TIMELINE.map((t) => ({
      organization: t.org,
      role: t.role,
      place: t.place,
      period: t.period,
      impact: t.impact,
      stack: t.stack,
    })),
    education: CREDENTIALS.map((c) => ({
      credential: c.label,
      institution: c.detail,
      year: c.year,
      note: c.badge ?? null,
    })),
    skills: SKILLS.map((s) => ({ area: s.label, items: s.items })),
    now: NOW.map((n) => ({ date: n.date, doing: n.tag, text: plain(n.body) })),
    writing: WRITING.map((w) => ({
      title: w.title,
      date: w.date,
      url: `${SITE.notesBase}/${w.slug}`,
    })),
    commonQuestions: QA_LIST.map((q) => ({
      question: q.question,
      answer: q.answer,
    })),
  }
}
