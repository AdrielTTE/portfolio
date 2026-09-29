// Slug -> drawn composition component. See docs/design-spec.md §7.1.
// When real screenshots exist for a project, delete its entry here, set
// `cover` + `coverAlt` in its frontmatter, and keep the same `plate`.
import HabitectCover from './HabitectCover.astro';
import PackageTrackerCover from './PackageTrackerCover.astro';

export const coverRegistry: Record<string, any> = {
  habitect: HabitectCover,
  'package-tracker': PackageTrackerCover,
};
