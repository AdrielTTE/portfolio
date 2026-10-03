import { describe, it, expect } from 'vitest';
import { projectsForOffer, offersWithProjects } from '../src/lib/offers';
import { makeEntry } from './helpers';

const site = makeEntry('no-offers', { title: 'No offers', order: 0, offers: [] });
const pt = makeEntry('web-app', { title: 'Web', order: 2, offers: ['webapps', 'apis'] });
const hab = makeEntry('mobile-app', { title: 'Mobile', order: 1, offers: ['mobile', 'apis'] });

describe('offers', () => {
  it('filters by offer, sorted by order', () => {
    expect(projectsForOffer([pt, hab, site], 'apis').map((e) => e.id)).toEqual(['mobile-app', 'web-app']);
  });
  it('drops offers with no projects', () => {
    const out = offersWithProjects([hab]);
    expect(out.map((o) => o.id)).toEqual(['apis', 'mobile']);
  });
  it('keeps canonical tab order webapps, apis, mobile', () => {
    expect(offersWithProjects([hab, pt, site]).map((o) => o.id)).toEqual(['webapps', 'apis', 'mobile']);
  });
  it('a project with no offers never appears in a tab', () => {
    for (const o of offersWithProjects([hab, pt, site])) expect(o.projects.map((p) => p.id)).not.toContain('no-offers');
  });
});
