import { GBV_AWARENESS_COURSE } from './gbvAwarenessCourseData';
import { HEALTHY_RELATIONSHIPS_COURSE } from './healthyRelationshipsCourseData';
import { CONSENT_COURSE } from './consentCourseData';
import { ONLINE_SAFETY_COURSE } from './onlineSafetyCourseData';
import { CULTURE_AND_GENDER_NORMS_COURSE } from './cultureAndGenderNormsCourseData';
import { UNDERSTANDING_GBV_YOUNG_PEOPLE_COURSE } from './understandingGbvYoungPeopleCourseData';
import { HEALTHY_ADOLESCENT_RELATIONSHIPS_COURSE } from './healthyAdolescentRelationshipsCourseData';

// Simple courses (no modules, no quiz, no certificate) shown to everyone.
// Add future simple courses here as they're written, one file each.
export const COURSES = [
  GBV_AWARENESS_COURSE,
  HEALTHY_RELATIONSHIPS_COURSE,
  CONSENT_COURSE,
  ONLINE_SAFETY_COURSE,
];

// Courses shown ONLY to under-18 accounts (age_group === 'under18'),
// symmetric to how ADVANCED_COURSES in allyCourseData.js is shown only
// to 18+ accounts. Same simple shape as COURSES (no modules, no quiz,
// no certificate) — see pages/learn/[courseId].js and pages/learn/index.js.
export const UNDER18_COURSES = [
  CULTURE_AND_GENDER_NORMS_COURSE,
  UNDERSTANDING_GBV_YOUNG_PEOPLE_COURSE,
  HEALTHY_ADOLESCENT_RELATIONSHIPS_COURSE,
];
