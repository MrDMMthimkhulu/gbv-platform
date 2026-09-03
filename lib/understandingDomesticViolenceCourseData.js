// "Understanding Domestic Violence and Recognising the Patterns" — an
// 18+ course adapted from the team's Knowledge Library ebook of the
// same name (Lina Mtshatsha). Sits alongside Allies & Bystanders, Life
// After Abuse and The Law and Your Rights as an advanced course: shown
// only to users whose age group is 18+ (see the !isGirl check in
// pages/learn/index.js).
//
// Sourced and cited from: Donovan & Hester (2010), Jones et al. (2010),
// Robinson, Pinchevsky & Guthrie (2015), Charlot, Campbell & Joel
// (2026), Charlot, Joel & Campbell (2023), Flynn & Graham (2010),
// People (2005), Hulley et al. (2022), Cuesta-García & Crespo (2022),
// and the World Health Organization (2024).

export const UNDERSTANDING_DV_COURSE = {
  id: 'understanding-domestic-violence',
  title: 'Understanding Domestic Violence',
  subtitle: "Recognising the patterns, even when abuse isn't physical",
  description:
    "Many survivors only recognise they were in an abusive relationship after leaving it. This course looks at why domestic violence is often harder to see than people expect, the warning signs research links to future violence, and the real barriers, cultural, systemic and emotional, that keep so many survivors from coming forward. Written for those 18 and older, drawing on research from Donovan & Hester, Jones et al., Charlot et al., Hulley et al., and the World Health Organization.",
  level: 'Survivor-centred · 18+',
  estimatedMinutes: 40,
  whatYoullLearn: [
    "Why domestic violence isn't always physical, and the many forms coercive control can take",
    'The warning signs and abuser patterns research associates with future violence',
    "Why so many survivors don't report, and the specific barriers that keep them silent",
    'How to recognise patterns rather than isolated incidents, and when to trust what you feel',
  ],
  modules: [
    {
      id: 'recognising-domestic-violence',
      title: 'Recognising Domestic Violence',
      lessons: [
        {
          id: 'what-it-actually-looks-like',
          title: 'What domestic violence actually looks like',
          content: `Domestic violence isn't always obvious, even to the person experiencing it. Many survivors only recognise they were in an abusive relationship after leaving it. It can involve abusive, intimidating or terrorising behaviour between family members or romantic partners, and it takes many forms: sexual, financial, physical, psychological, and coercive control (Donovan and Hester, 2010).

Research identifies different patterns among people who abuse: dysphoric batterers tend to be reactive and inconsistent, while antisocial batterers show more consistent, controlling violence (Jones et al., 2010). Coercive, verbal and threatening behaviour often escalates the risk of physical violence over time.

Physical violence is only one tool. Others include sexual jealousy, isolation, threats, extreme dominance, humiliation and verbal abuse (Robinson, Pinchevsky and Guthrie, 2015). Many survivors believe they need visible injuries to justify seeking help, but non-violent gender-based abuse is often found to be just as distressing, sometimes more so, than physical violence.`,
        },
        {
          id: 'warning-signs-of-ipv',
          title: 'Warning signs of intimate partner violence',
          content: `Warning signs are the thoughts, feelings or behaviours that predict future abuse without being abusive themselves (Charlot, Campbell and Joel, 2026). Many abusive patterns emerge within the first year of a relationship, and the longer they go unaddressed, the harder they become to leave.

Early signs include extreme jealousy, a sense of entitlement or arrogance, creating uncomfortable situations in public, and disregarding your boundaries or reacting badly to being told no (Charlot, Joel and Campbell, 2023). No single sign guarantees future violence. What matters more is the combination, frequency, intensity and context of these behaviours together, not any one incident on its own.`,
        },
        {
          id: 'why-ipv-happens',
          title: 'Why IPV happens',
          content: `There's no single explanation for why intimate partner violence happens, and none of the reasons researchers describe justify it (Flynn and Graham, 2010). Relationship insecurities, like fear of infidelity or fear of a partner leaving, are commonly cited factors. So are difficulty communicating and unmanaged anger.

Some perpetrators use violence to seek attention or express feelings they can't otherwise communicate. Self-defence has also been identified as a factor in some cases. Understanding these patterns can help explain the dynamics of an abusive relationship, but they never shift responsibility away from the person who chooses to use violence.`,
        },
      ],
      quiz: {
        id: 'quiz-recognising-domestic-violence',
        passScore: 3,
        questions: [
          {
            q: 'Gender-based abuse is always physical.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'Which of these is NOT a recognised indicator of abuse?',
            options: ['Physical aggression', 'Threatening behaviour', 'Verbal abuse', 'Complimenting'],
            correct: 3,
          },
          {
            q: 'Which batterer typology demonstrates reactive and inconsistent violence?',
            options: ['Dysphoric', 'Anxious', 'Devious', 'Antisocial'],
            correct: 0,
          },
          {
            q: 'Which typology demonstrates consistent and more controlling violent behaviour?',
            options: ['Dysphoric', 'Alcoholic', 'Whimsical', 'Antisocial'],
            correct: 3,
          },
        ],
      },
    },
    {
      id: 'barriers-to-disclosing-abuse',
      title: 'Barriers to Disclosing Abuse',
      lessons: [
        {
          id: 'why-it-often-goes-unreported',
          title: 'Why domestic violence often goes unreported',
          content: `Domestic violence isn't new, and in some cultures it's still treated as normal or a private matter rather than a crime (People, 2005). That view discourages reporting: under 40% of threats and violent incidents are ever reported to police.

Common reasons include not viewing the incident as serious enough, feeling ashamed or wanting to keep it private, and not trusting that the justice system will actually help. Many survivors also stay in abusive relationships out of fear, powerlessness, or isolation, sometimes made worse by housing instability or a lack of access to support (Hulley et al., 2022).`,
        },
        {
          id: 'specific-barriers-women-face',
          title: 'The specific barriers women face',
          content: `Research identifies several recurring barriers to disclosure (Cuesta-García and Crespo, 2022). Social isolation leaves some survivors financially and emotionally dependent on their partner with no alternative support network to turn to.

Cultural and religious pressure, like shame, community gossip, or beliefs that emphasise preserving a marriage above all else, can make asking for help feel impossible. A lack of awareness of legal rights or available services means many survivors don't even know that what they're experiencing is a crime, or that help exists.

Emotional and psychological barriers matter too: hope that a partner will change, fear of judgement, and shame or guilt about sharing something so personal all make it harder to come forward.`,
        },
      ],
      quiz: {
        id: 'quiz-barriers-to-disclosing-abuse',
        passScore: 3,
        questions: [
          {
            q: 'How can cultural or religious expectations become a barrier to seeking help?',
            options: [
              'They can discourage disclosure because of stigma or pressure to preserve the relationship',
              'They guarantee access to professional services',
              'They always encourage women to report immediately',
              'They eliminate concerns about family reactions',
            ],
            correct: 0,
          },
          {
            q: 'Why can limited awareness of available services prevent women from seeking help?',
            options: [
              'Women automatically receive professional support',
              'Services become easier to access without information',
              'Women are always informed about legal procedures',
              'Women may not know what services exist or what their legal rights are',
            ],
            correct: 3,
          },
          {
            q: 'Which concern was identified as a barrier for some immigrant women with uncertain immigration status?',
            options: [
              'Fear of receiving too much community support',
              'Concern about having too much information about their rights',
              'Concern that services would improve their legal status automatically',
              'Fear that seeking services could lead to immigration consequences',
            ],
            correct: 3,
          },
          {
            q: 'Which combination of emotions was identified as potentially making help-seeking more difficult?',
            options: [
              'Confidence, optimism, and independence',
              'Fear, shame, guilt, and despair',
              'Trust, security, and belonging',
              'Curiosity, excitement, and satisfaction',
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'the-wider-picture',
      title: 'The Wider Picture & Moving Forward',
      lessons: [
        {
          id: 'context-and-intersecting-barriers',
          title: 'Context, culture and intersecting barriers',
          content: `Domestic violence doesn't happen in a vacuum. Patriarchy, and both overt and covert racism, shape individual experiences of threat, fear, isolation and powerlessness (Hulley et al., 2022). For some survivors, these are made worse by exacerbating factors: service gaps, immigration status, and cultural or religious pressure all combine to make disclosure and help-seeking harder.

Understanding this bigger picture matters because it shows that the barriers survivors face aren't personal failings, they're shaped by intersecting social, systemic and cultural forces well beyond any one person's control.`,
        },
        {
          id: 'what-this-means-for-you',
          title: 'What this means for you',
          content: `Domestic violence is not just physical, it includes control, manipulation, isolation, coercive control and emotional abuse: patterns that are psychological as much as physical. You don't need bruises, broken bones or any visible injury for what you're experiencing to count as abuse.

The first step in recognising gender-based violence is learning to identify these signs and patterns, rather than dismissing them as jealousy or overprotectiveness. Your feelings and wellbeing matter. Every person deserves a relationship where they feel valued, loved, safe and respected, and it's okay to reach out for support.`,
        },
      ],
      quiz: {
        id: 'quiz-the-wider-picture',
        passScore: 2,
        questions: [
          {
            q: 'You need visible injuries, like bruises, for something to count as abuse.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'According to the intersecting-barriers model, factors like immigration status or service gaps combine with patriarchy and racism to shape:',
            options: [
              'How much a survivor is believed in court',
              'Individual experiences of threat, fear, isolation and powerlessness',
              'Nothing significant',
            ],
            correct: 1,
          },
          {
            q: 'The first step in recognising domestic violence is:',
            options: [
              'Waiting for physical evidence',
              'Identifying the signs and patterns of harmful behaviour',
              'Confronting the abuser directly',
            ],
            correct: 1,
          },
        ],
      },
    },
  ],
  finalAssessment: {
    id: 'final-assessment-understanding-domestic-violence',
    passScore: 4,
    questions: [
      {
        q: 'Gender-based abuse is always physical.',
        options: ['True', 'False'],
        correct: 1,
      },
      {
        q: 'Which typology shows consistent, controlling violent behaviour?',
        options: ['Dysphoric', 'Antisocial', 'Whimsical', 'Alcoholic'],
        correct: 1,
      },
      {
        q: 'Cultural or religious expectations can be a barrier to seeking help because they:',
        options: [
          'Guarantee access to services',
          'Can pressure someone to preserve the relationship despite abuse',
          'Always encourage immediate reporting',
        ],
        correct: 1,
      },
      {
        q: 'Limited awareness of available services can prevent someone from seeking help because:',
        options: [
          'They may not know what services exist or what their rights are',
          'Services are always well known',
          'Awareness has no effect on help-seeking',
        ],
        correct: 0,
      },
      {
        q: 'Fear that seeking help could affect immigration status is a barrier for:',
        options: ['No one', 'Some immigrant survivors', 'Only people born in South Africa'],
        correct: 1,
      },
      {
        q: 'The first step in recognising domestic violence is:',
        options: [
          'Waiting for visible injury',
          'Identifying signs and patterns of harmful behaviour',
          'Ignoring the relationship entirely',
        ],
        correct: 1,
      },
    ],
  },
};
