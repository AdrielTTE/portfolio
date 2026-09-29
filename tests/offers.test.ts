import { describe, it, expect } from 'vitest';
import { projectsForOffer, offersWithProjects } from '../src/lib/offers';
import { makeEntry } from './helpers';

const site = makeEntry('this-site', { title: 'This site', order: 0, offers: ['websites'] });
const pt = makeEntry('package-tracker', { title: 'PT', order: 2, offers: ['webapps'] });
const hab = makeEntry('habitect', { title: 'Hab', order: 1, offers: ['mobile', 'webapps'] });

describe('offers', () => {
  it('filters by offer, sorted by order', () => {
    expect(projectsForOffer([pt, hab, site], 'webapps').map((e) => e.id)).toEqual(['habitect', 'package-tracker']);
  });
  it('drops offers with no projects', () => {
    const out = offersWithProjects([pt]);
    expect(out.map((o) => o.id)).toEqual(['webapps']);
  });
  it('keeps canonical tab order websites, webapps, mobile', () => {
    expect(offersWithProjects([hab, pt, site]).map((o) => o.id)).toEqual(['websites', 'webapps', 'mobile']);
  });
});
