// lib/courseVideos.js
// Map each course to its YouTube intro video for enhanced learning

export const COURSE_VIDEOS = {
  // ADVANCED COURSES
  'allies-and-bystanders': {
    title: 'How to Support Someone Through Trauma',
    channel: 'Counselor Kym',
    youtubeId: 'A8Jz-YKzg98',
    duration: '8 min',
    description: 'Practical steps for being a good ally, what to say/not to say to survivors'
  },
  'life-after-abuse': {
    title: 'Healing After Trauma: A Guide to Recovery',
    channel: 'Psychology Today',
    youtubeId: 'LkHFEJLn9oA',
    duration: '9 min',
    description: 'Explores recovery stages after trauma, rebuilding self-trust, and creating a new chapter'
  },
  'law-and-rights': {
    title: 'Know Your Rights: Domestic Violence Protection Orders',
    channel: 'National Domestic Violence Hotline',
    youtubeId: 'U7sHKFLjDaQ',
    duration: '7 min',
    description: 'How to get a restraining/protection order, legal rights, safety planning'
  },
  'understanding-domestic-violence': {
    title: 'The Cycle of Abuse Explained',
    channel: 'Psych2Go',
    youtubeId: 'V1yHZaKKfqE',
    duration: '7 min',
    description: 'Breaking down the cycle of abuse, warning signs, and how control works'
  },

  // LEARNING COURSES
  'gbv-awareness': {
    title: 'Gender-Based Violence: Definitions, Types & Impact',
    channel: 'UN Women',
    youtubeId: 'R4FYQqZCbVY',
    duration: '6 min',
    description: 'Comprehensive overview of what GBV is, its forms, and societal impact'
  },
  'healthy-relationships': {
    title: 'What Makes a Healthy Relationship?',
    channel: 'The School of Life',
    youtubeId: '0MS2VUfIIoo',
    duration: '8 min',
    description: 'Core elements of healthy relationships - respect, communication, trust, independence'
  },
  'consent': {
    title: 'Consent is Everything',
    channel: 'Planned Parenthood',
    youtubeId: 'oQbei5JGiT8',
    duration: '3 min',
    description: 'What consent is, enthusiastic consent, ongoing consent, how to ask/listen'
  },
  'online-safety': {
    title: 'How to Stay Safe Online: Digital Security for Everyone',
    channel: 'Google Security',
    youtubeId: 'mYKp0LvPCrA',
    duration: '5 min',
    description: 'Password security, recognizing phishing, safe browsing, protecting personal info'
  },

  // UNDER-18 COURSES
  'culture-and-gender-norms': {
    title: 'How Culture Shapes Gender',
    channel: 'Crash Course Humanities',
    youtubeId: 'TXnqQJwNDDo',
    duration: '10 min',
    description: 'Explores how culture creates gender norms, stereotypes, and their impact'
  },
  'understanding-gbv-young-people': {
    title: 'Teen Dating Violence: What You Need to Know',
    channel: 'National Domestic Violence Hotline',
    youtubeId: 'dVXNsA5HBYY',
    duration: '6 min',
    description: 'Warning signs of unhealthy teen relationships, how to get help'
  },
  'healthy-adolescent-relationships': {
    title: 'Building Healthy Teen Relationships',
    channel: 'Scarleteen / Planned Parenthood',
    youtubeId: 'S0sB7xFHVlQ',
    duration: '7 min',
    description: 'Communication, boundaries, respect, handling conflicts in teen relationships'
  }
};

// Helper function to get video for a course
export function getCourseVideo(courseId) {
  return COURSE_VIDEOS[courseId] || null;
}

// Helper function to build YouTube embed URL
export function getYoutubeEmbedUrl(youtubeId) {
  return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;
}

// Helper function to build YouTube watch URL
export function getYoutubeWatchUrl(youtubeId) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
