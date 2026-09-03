import { LIFE_AFTER_ABUSE_COURSE } from './lifeAfterAbuseCourseData';
import { LAW_AND_RIGHTS_COURSE } from './lawAndRightsCourseData';
import { UNDERSTANDING_DV_COURSE } from './understandingDomesticViolenceCourseData';

export const ALLY_COURSE = {
  id: 'allies-and-bystanders',
  title: 'Allies & Bystanders',
  subtitle: 'Supporting someone experiencing gender-based violence',
  description:
    "For friends, family, colleagues, and anyone who wants to support someone through gender-based violence, without accidentally making things harder or more dangerous for them.",
  level: 'Beginner',
  estimatedMinutes: 35,
  whatYoullLearn: [
    'How to recognize the signs someone may be experiencing abuse',
    'How to respond to a disclosure without judgment or panic',
    'What NOT to say or do, and why it matters',
    'How to help someone connect to real support, safely',
  ],
  modules: [
    {
      id: 'recognizing-signs',
      title: 'Recognizing the signs',
      lessons: [
        {
          id: 'signs-behavioural',
          title: 'Behavioural changes to notice',
          content: `People experiencing abuse often show changes before they ever say anything. Watch for withdrawal from friends and activities they used to enjoy, anxiety around their partner's messages or calls, or explanations for injuries or absences that don't quite add up.

None of these alone prove abuse is happening. But a pattern, especially a pattern that gets more pronounced over time, is worth paying attention to.`,
        },
        {
          id: 'signs-what-not-to-assume',
          title: 'What not to assume',
          content: `Don't assume someone would tell you if something were wrong. Shame, fear, and love mixed with fear all keep people quiet, even with people they trust.

Don't assume a lack of visible injury means nothing is wrong. Emotional, financial, and psychological abuse leave no marks but can be just as controlling and damaging.`,
        },
      ],
      quiz: {
        id: 'quiz-recognizing-signs',
        passScore: 2,
        questions: [
          {
            q: 'Someone withdrawing from friends they used to see often is:',
            options: [
              'Definitive proof of abuse',
              'Worth paying attention to, especially as part of a pattern',
              'Not worth noticing at all',
            ],
            correct: 1,
          },
          {
            q: "If there's no visible injury, it usually means nothing is wrong.",
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'A person experiencing abuse will always tell someone they trust right away.',
            options: ['True', 'False'],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'responding-with-support',
      title: 'Responding with support',
      lessons: [
        {
          id: 'if-someone-discloses',
          title: 'If someone discloses to you',
          content: `Start by believing them. Disclosing abuse is hard, and disbelief (even well-meaning disbelief, like "are you sure?") can shut the conversation down immediately.

Let them lead. Ask what they need rather than immediately telling them what to do. Something as simple as "I believe you, and I'm here" can matter more than any advice.`,
        },
        {
          id: 'what-not-to-say',
          title: "What not to say, and why",
          content: `Avoid "why don't you just leave?" It implies the decision is simple, and it usually isn't; leaving is often the most dangerous point in an abusive relationship.

Avoid criticizing their partner in extreme terms early on. If they're not ready to leave, harsh judgment of their partner can make them defensive and less likely to come back to you later.

Avoid taking action on their behalf without asking first, like contacting the partner or police, unless there's an immediate danger to life. Doing so without consent can remove their control over their own safety.`,
        },
      ],
      quiz: {
        id: 'quiz-responding-with-support',
        passScore: 2,
        questions: [
          {
            q: 'The most helpful first response to a disclosure is usually:',
            options: [
              'Asking "are you sure?"',
              'Believing them and asking what they need',
              'Telling them exactly what to do',
            ],
            correct: 1,
          },
          {
            q: 'Why is "why don\'t you just leave?" unhelpful?',
            options: [
              "It implies leaving is simple, when it's often the most dangerous point",
              "It's always the right question to ask first",
              'It has no real effect either way',
            ],
            correct: 0,
          },
          {
            q: 'You should contact their partner or police on their behalf without asking, whenever you\'re worried.',
            options: ['True', 'False'],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'connecting-to-help',
      title: 'Connecting them to help, safely',
      lessons: [
        {
          id: 'sharing-resources',
          title: 'Sharing resources without pressure',
          content: `Share information rather than issuing instructions: "There's a place called SafeHaven with shelters and a helpline, would it help to look at it together?" rather than "You need to call this number."

Respect their pace. Someone may need to hear about a resource several times, over weeks or months, before they're ready to use it. That's normal, not a failure on your part.`,
        },
        {
          id: 'protecting-yourself-too',
          title: 'Looking after yourself too',
          content: `Supporting someone through this can be emotionally heavy. Set boundaries around what you can realistically offer, and don't take on the role of their only support system; encourage other trusted people and professional services too.

If you ever feel unsafe yourself, for example if the partner becomes aggressive towards you, prioritize your own safety and involve the authorities.`,
        },
      ],
      quiz: {
        id: 'quiz-connecting-to-help',
        passScore: 2,
        questions: [
          {
            q: 'The best way to share a resource like a helpline is usually:',
            options: [
              'As a firm instruction: "You need to call this number"',
              'As an offer, at their pace, without pressure',
              "Only once, then don't bring it up again",
            ],
            correct: 1,
          },
          {
            q: 'You should try to be someone\'s only source of support through this.',
            options: ['True', 'False'],
            correct: 1,
          },
        ],
      },
    },
  ],
  finalAssessment: {
    id: 'final-assessment',
    passScore: 4,
    questions: [
      {
        q: 'A pattern of behavioural changes over time is:',
        options: ['Meaningless', 'Worth paying attention to', 'Always proof of abuse'],
        correct: 1,
      },
      {
        q: 'The first response to a disclosure should usually be:',
        options: ['Disbelief until proven', 'Belief and support', 'Immediate advice on what to do'],
        correct: 1,
      },
      {
        q: '"Why don\'t you just leave?" is unhelpful mainly because:',
        options: [
          'Leaving is often the most dangerous point, and it oversimplifies a hard decision',
          "It's rude",
          'It has no effect either way',
        ],
        correct: 0,
      },
      {
        q: 'Sharing a resource works best when it is:',
        options: ['An instruction, said once', 'An offer, at their pace', 'Kept secret until asked'],
        correct: 1,
      },
      {
        q: 'If you ever feel unsafe yourself while supporting someone, you should:',
        options: [
          'Ignore it and keep helping regardless',
          'Prioritize your own safety and involve authorities if needed',
          'Confront the partner directly',
        ],
        correct: 1,
      },
    ],
  },
};

// Lookup array so course pages can find a course by id. Add future
// advanced courses here as they're written.
export const ADVANCED_COURSES = [ALLY_COURSE, LIFE_AFTER_ABUSE_COURSE, LAW_AND_RIGHTS_COURSE, UNDERSTANDING_DV_COURSE];
