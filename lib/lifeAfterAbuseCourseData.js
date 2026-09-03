// "Life After Abuse" — an 18+ survivor-centred course adapted from the
// team's Knowledge Library ebook of the same name. Sits alongside
// Allies & Bystanders as an advanced course: shown only to users whose
// age group is 18+ (see the !isGirl check in pages/learn/index.js).
//
// Sourced and cited from: World Health Organization (2026), UN Women
// (2025), CDC (2024), SAMHSA (2026), and the Republic of South Africa's
// National Strategic Plan on Gender-Based Violence and Femicide (2020).

export const LIFE_AFTER_ABUSE_COURSE = {
  id: 'life-after-abuse',
  title: 'Life After Abuse',
  subtitle: 'Healing, self-trust, healthy relationships, and rebuilding your life',
  description:
    "What happened to you was not your fault. This course is about what comes after leaving an abusive relationship or situation: understanding the lasting effects of abuse, rebuilding self-trust and personal agency, recognising what a healthy relationship actually looks like, and building a future that isn't defined by what happened to you. Written for survivors 18 and older, drawing on WHO, CDC, UN Women and SAMHSA guidance alongside South Africa's National Strategic Plan on Gender-Based Violence and Femicide.",
  level: 'Survivor-centred · 18+',
  estimatedMinutes: 55,
  whatYoullLearn: [
    'Why healing after abuse is rarely a straight line, and what to expect from the process',
    'How to rebuild self-trust and reclaim personal choice after control and coercion',
    'What defines a healthy relationship, and the warning signs of an unhealthy one',
    "How to let go without forgetting, and build a future defined by your own goals",
  ],
  modules: [
    {
      id: 'healing-and-moving-forward',
      title: 'Healing and Moving Forward',
      lessons: [
        {
          id: 'understanding-abuse',
          title: 'Understanding abuse',
          content: `Abuse isn't limited to physical injury. It includes physical, sexual and psychological violence, coercion, intimidation, isolation and controlling behaviour. The World Health Organization defines intimate partner violence as physical aggression, sexual coercion, psychological abuse and controlling behaviours by a current or former partner, and UN Women identifies economic control as another recognised form (World Health Organization, 2026; UN Women, 2025).

This broader view matters because abuse can be hard to recognise when only physical violence is treated as "real." Repeated humiliation, isolation, coercion or financial control can affect a person's autonomy and wellbeing even without a single visible injury.

Abuse is never the survivor's fault. Public-health guidance describes violence through interacting individual, relationship, community and societal risk factors, not personal choices made by the person who was harmed (Centers for Disease Control and Prevention, 2024).`,
        },
        {
          id: 'recognising-the-effects',
          title: 'Recognising the effects of abuse',
          content: `The effects of abuse often extend well beyond the relationship itself. The WHO links violence against women to depression, post-traumatic stress, anxiety, sleep difficulties and other physical and reproductive health effects that can continue long after the danger has passed (World Health Organization, 2026).

Recovery is rarely a straight line. There will be days that feel like real progress and others where old feelings return without warning; that unevenness is normal, not a sign of failure.

A trauma-informed approach doesn't ask "what's wrong with you" about these reactions, it asks what you've experienced and what would help you feel safe. Safety, trust, collaboration and empowerment sit at the centre of that approach (Substance Abuse and Mental Health Services Administration, 2026).`,
        },
        {
          id: 'leaving-the-past-behind',
          title: 'Leaving the past behind',
          content: `Leaving an abusive relationship is an important step, but moving on doesn't mean forcing yourself to forget. Acknowledging what happened can help explain why certain words, situations or behaviours still feel threatening.

Memories can resurface unexpectedly, and that doesn't mean abuse has to define your identity. What can be built over time is the ability to notice these reactions, reach for support, protect your safety, and choose responses that support your recovery rather than replay the past.

Moving forward is about meaning-making, not denial: placing what happened within a larger life story where you can also build new relationships, goals and sources of meaning.`,
        },
      ],
      quiz: {
        id: 'quiz-healing-and-moving-forward',
        passScore: 2,
        questions: [
          {
            q: 'Abuse only counts if there is visible physical injury.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'Public-health guidance describes violence as best understood through:',
            options: [
              "A survivor's personal choices",
              'Interacting individual, relationship, community and societal risk factors',
              'Random chance',
            ],
            correct: 1,
          },
          {
            q: 'Recovery from abuse typically follows:',
            options: [
              'A steady, predictable upward path',
              'Good days and difficult days, without a fixed timeline',
              'A fixed 12-month timeline',
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'reclaiming-yourself',
      title: 'Reclaiming Yourself',
      lessons: [
        {
          id: 'understanding-emotional-scars',
          title: 'Understanding emotional scars',
          content: `Emotional scars aren't visible the way physical injuries are, but that doesn't make them less real. Survivors may feel fear, sadness, anger, shame or difficulty trusting other people, and the WHO links violence to depression, anxiety and post-traumatic stress among other effects (World Health Organization, 2026).

Some coping responses that feel confusing now may have developed because they were useful for survival at the time. A trauma-informed lens asks what you needed then and what you need now to feel safe, rather than judging those responses without context (Substance Abuse and Mental Health Services Administration, 2026).`,
        },
        {
          id: 'rebuilding-self-trust',
          title: 'Rebuilding self-trust',
          content: `Abuse often involves repeated messages that your feelings, memories or decisions are wrong. Over time, that can erode confidence in your own judgement.

Self-trust can be rebuilt through small decisions: expressing a preference, saying no to something you don't want, choosing how to spend your time, or noticing when something feels uncomfortable. None of this is about becoming selfish, it's about practising agency again, one safe choice at a time.`,
        },
        {
          id: 'reclaiming-personal-choice',
          title: 'Reclaiming personal choice',
          content: `Personal agency means having real, meaningful control over decisions that affect your life. Abuse often works by taking the opposite: controlling someone's choices, movements, relationships, finances, body or emotions.

Reclaiming that agency won't always feel easy. You might feel guilty saying no, or worry about disappointing someone. The goal of boundaries and self-trust isn't guaranteed approval from others, it's making decisions that are consistent with your own safety, values and needs.`,
        },
      ],
      quiz: {
        id: 'quiz-reclaiming-yourself',
        passScore: 2,
        questions: [
          {
            q: 'Coping responses that feel confusing now may have developed because:',
            options: [
              'They were useful for survival at the time',
              'They prove something is wrong with you',
              'They have no explanation',
            ],
            correct: 0,
          },
          {
            q: 'Rebuilding self-trust usually starts with:',
            options: [
              'One big, dramatic life change',
              'Small, practised decisions like saying no or choosing how to spend your time',
              'Waiting until you feel completely confident',
            ],
            correct: 1,
          },
          {
            q: 'The goal of setting boundaries is to guarantee other people will approve of you.',
            options: ['True', 'False'],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'building-healthy-connections',
      title: 'Building Healthy Connections',
      lessons: [
        {
          id: 'safety-and-boundaries',
          title: 'Safety and boundaries',
          content: `After abuse, feeling safe around other people can take time to return. Boundaries create predictability: deciding who may contact you, how you want to be spoken to, what you share, and what happens if someone crosses a line.

A boundary isn't a demand that someone agree with you. It's a statement of what you will accept, and what you'll do if that line is crossed. This lines up with trauma-informed practice, which puts safety and empowerment at the centre of recovery (Substance Abuse and Mental Health Services Administration, 2026).`,
        },
        {
          id: 'healthy-relationships-after-abuse',
          title: 'Healthy relationships after abuse',
          content: `Love should never be confused with control. Something that once felt safe becoming a source of fear is not a sign that you did something wrong, it's a sign the relationship became unhealthy.

Healthy relationships are built on mutual respect, honesty, communication, consent and emotional safety, along with room for each person to keep interests and relationships outside the partnership. The CDC identifies teaching these relationship skills as a key part of preventing future violence (Centers for Disease Control and Prevention, 2024).`,
        },
        {
          id: 'recognising-unhealthy-patterns',
          title: 'Recognising unhealthy relationship patterns',
          content: `Warning signs include extreme jealousy, monitoring, isolation from friends or family, threats, humiliation, pressure around sex, or control over money, patterns UN Women names among the recognised forms of violence against women (UN Women, 2025).

Recognising these signs can support safer decisions, but responsibility for abuse always belongs to the person who chooses it, never to the person experiencing it. Prevention frameworks focus on changing risk factors, not blaming survivors (Centers for Disease Control and Prevention, 2024).`,
        },
      ],
      quiz: {
        id: 'quiz-building-healthy-connections',
        passScore: 2,
        questions: [
          {
            q: 'A relationship that once felt safe becoming a source of fear means:',
            options: [
              'You did something to cause it',
              'The relationship became unhealthy, not that you failed',
              'Nothing significant',
            ],
            correct: 1,
          },
          {
            q: 'Which of these is a recognised warning sign of an unhealthy relationship?',
            options: [
              'Mutual respect and consent',
              'Extreme jealousy and monitoring',
              'Open communication',
            ],
            correct: 1,
          },
          {
            q: 'Responsibility for abusive behaviour belongs to:',
            options: [
              'The person who chooses to use it',
              'The person experiencing it',
              'Both people equally',
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      id: 'reclaiming-your-future',
      title: 'Reclaiming Your Future',
      lessons: [
        {
          id: 'letting-go-without-forgetting',
          title: 'Letting go without forgetting',
          content: `Forgiveness isn't a required step in healing. You can move forward without an apology, and without pretending the harm never happened. Forgiveness is a personal decision, not a condition for recovery.

Letting go can mean reducing the power the past holds over your present choices, learning from what happened, protecting yourself going forward, and developing new sources of identity and meaning that aren't organised around what the person who hurt you did.`,
        },
        {
          id: 'building-the-life-you-deserve',
          title: 'Building the life you deserve',
          content: `Recovery isn't only about reducing distress, it's also about rebuilding the ordinary parts of life: education, work, friendships, family, hobbies, financial independence, and safety. Setting achievable goals and noticing progress, even small progress, supports this process.

Supportive social networks, safe housing, healthcare and economic resources all act as protective factors (Centers for Disease Control and Prevention, 2024). In South Africa, this also sits within a wider national response: the National Strategic Plan on Gender-Based Violence and Femicide names care and healing, and economic power, among its core areas of action (Republic of South Africa, 2020).`,
        },
      ],
      quiz: {
        id: 'quiz-reclaiming-your-future',
        passScore: 2,
        questions: [
          {
            q: 'Forgiveness is a required step for healing from abuse.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'Which of these counts as a protective factor supporting recovery?',
            options: [
              'Isolation from support networks',
              'Access to safe housing and healthcare',
              'Avoiding all future relationships',
            ],
            correct: 1,
          },
          {
            q: "South Africa's National Strategic Plan on GBV and Femicide includes:",
            options: [
              'Care and healing, and economic power, among its action areas',
              'Only criminal prosecution',
              'No specific focus on survivors',
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      id: 'embracing-a-new-future',
      title: 'Embracing a New Future',
      lessons: [
        {
          id: 'choosing-yourself',
          title: 'Choosing yourself',
          content: `Choosing yourself doesn't mean you stop caring about other people, it means recognising that your own safety, dignity and wellbeing matter too. If you were repeatedly taught that your needs came second, prioritising yourself now can feel uncomfortable at first.

That discomfort tends to ease with practice. Making choices for yourself, like rest, supportive relationships, and financial or educational planning, doesn't make you selfish. It's part of rebuilding the agency abuse tried to take away.`,
        },
        {
          id: 'beginning-a-new-chapter',
          title: 'Beginning a new chapter',
          content: `Starting a new chapter doesn't require becoming a completely different person. It can mean developing a clearer sense of your own values, needs and boundaries, and making choices based on those values rather than fear.

There's no single timetable that applies to every survivor, and healing doesn't need to look perfect to be real. The most useful measure isn't whether you're healing as fast as someone else, it's whether your life is gradually becoming safer, more autonomous, and more consistent with what you actually want.`,
        },
      ],
      quiz: {
        id: 'quiz-embracing-a-new-future',
        passScore: 2,
        questions: [
          {
            q: "Prioritising your own needs after abuse means you don't care about others.",
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'The most useful measure of healing is:',
            options: [
              'Healing exactly as fast as someone else',
              'Whether your life is gradually becoming safer and more your own',
              'Reaching a fixed deadline',
            ],
            correct: 1,
          },
          {
            q: 'Building a new chapter requires becoming a completely different person.',
            options: ['True', 'False'],
            correct: 1,
          },
        ],
      },
    },
  ],
  finalAssessment: {
    id: 'final-assessment-life-after-abuse',
    passScore: 5,
    questions: [
      {
        q: 'Abuse can only be identified through visible physical injury.',
        options: ['True', 'False'],
        correct: 1,
      },
      {
        q: 'Recovery from abuse generally follows:',
        options: [
          'A steady, straight-line improvement',
          'Good days and difficult days, without a fixed timeline',
          'A fixed 6-month recovery period',
        ],
        correct: 1,
      },
      {
        q: 'Rebuilding self-trust after abuse usually starts with:',
        options: [
          'One dramatic change',
          'Small, practised decisions like saying no',
          'Waiting for full confidence first',
        ],
        correct: 1,
      },
      {
        q: 'A relationship becoming a source of fear means:',
        options: [
          'The survivor caused it',
          'The relationship became unhealthy',
          'Nothing meaningful',
        ],
        correct: 1,
      },
      {
        q: 'Forgiveness is required before someone can heal.',
        options: ['True', 'False'],
        correct: 1,
      },
      {
        q: 'Responsibility for abusive behaviour belongs to:',
        options: [
          'The person who chooses to use it',
          'The survivor',
          'Both people equally',
        ],
        correct: 0,
      },
      {
        q: 'The most useful measure of healing is:',
        options: [
          "Matching someone else's pace",
          'Whether life is gradually becoming safer and more your own',
          'A specific age milestone',
        ],
        correct: 1,
      },
    ],
  },
};
