// "The Law and Your Rights in South Africa" — an 18+ survivor-centred
// course adapted from the team's Knowledge Library guide of the same
// name (S.J. Moshasha). Sits alongside Allies & Bystanders and Life
// After Abuse as an advanced course: shown only to users whose age
// group is 18+ (see the !isGirl check in pages/learn/index.js).
//
// Sourced and cited from: the Constitution of the Republic of South
// Africa (1996), the Domestic Violence Act 116 of 1998, the Protection
// from Harassment Act 17 of 2011, the Sexual Offences and Related
// Matters Amendment Act 32 of 2007, the Criminal Law Amendment Act 105
// of 1997, the Criminal Procedure Act, Legal Aid South Africa (2023),
// the National Prosecuting Authority (2024), Botha (2025) and
// Adefuye et al. (2024).

export const LAW_AND_RIGHTS_COURSE = {
  id: 'law-and-your-rights',
  title: 'The Law and Your Rights',
  subtitle: "A survivor's guide to South African law, from the Constitution to court",
  description:
    "Being a survivor doesn't take away your rights or your dignity. This course walks through what South African law actually gives you: your constitutional rights, what happens when you report a crime, how protection orders and sexual offences law work, what to expect from the criminal justice process, and where to find free legal help. Written for survivors 18 and older, drawing on the Constitution, the Domestic Violence Act, the Sexual Offences Act, and guidance from Legal Aid South Africa and the National Prosecuting Authority.",
  level: 'Survivor-centred · 18+',
  estimatedMinutes: 60,
  whatYoullLearn: [
    'Which constitutional rights protect you as a survivor, and how they can be enforced',
    'What happens, step by step, when you report a crime to SAPS',
    'How protection orders and sexual offences law actually work in South Africa',
    'Where to get free legal help, and how your privacy is protected through the process',
  ],
  modules: [
    {
      id: 'your-constitutional-rights',
      title: 'Your Constitutional Rights',
      lessons: [
        {
          id: 'equality-and-dignity',
          title: 'Equality and dignity',
          content: `The Constitution of the Republic of South Africa is the highest law in the country, and Chapter 2, the Bill of Rights, protects everyone in it, built on human dignity, equality and freedom (Constitution of the Republic of South Africa, 1996).

Section 9 says everyone is equal before the law and entitled to equal protection, with unfair discrimination prohibited on grounds including race, gender, sex, pregnancy, marital status, disability, religion and age. As a survivor, your circumstances or identity should never make you less deserving of protection, assistance or justice.

Section 10 protects everyone's inherent dignity. Experiencing violence or abuse doesn't make you less worthy of respect, your dignity isn't determined by what happened to you or how you responded to it.`,
        },
        {
          id: 'freedom-security-and-privacy',
          title: 'Freedom, security and privacy',
          content: `Section 12 protects your right to freedom and security, including the right to be free from violence from public or private sources, and from torture or cruel, inhuman or degrading treatment. It also recognises your right to bodily and psychological integrity, control over your own body.

Section 14 protects your right to privacy, including protection against interference with your family, home and communications. As a survivor who may need to share sensitive information with institutions, this right means that information should be handled appropriately, not treated carelessly.`,
        },
        {
          id: 'access-to-justice',
          title: 'Your right to access the courts',
          content: `Section 34 gives everyone the right to have a legal dispute decided in a fair, public hearing before a court or another independent, impartial tribunal. This means the justice system isn't reserved for the wealthy or powerful, it's a right you hold regardless of your circumstances.

Together, these constitutional rights don't just say you have rights, the Constitution also provides ways for those rights to be enforced when they're threatened or violated. Knowing that is often the first step toward using it.`,
        },
      ],
      quiz: {
        id: 'quiz-your-constitutional-rights',
        passScore: 2,
        questions: [
          {
            q: 'Which section of the Constitution protects the right to equality?',
            options: ['Section 9', 'Section 14', 'Section 34'],
            correct: 0,
          },
          {
            q: 'Your dignity as a survivor is determined by what happened to you.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'Access to the courts under Section 34 is:',
            options: [
              'Reserved for people who can afford it',
              'A right held by everyone, regardless of wealth or power',
              'Only available in criminal cases',
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'reporting-and-protection-orders',
      title: 'Reporting a Crime & Protection Orders',
      lessons: [
        {
          id: 'reporting-to-saps',
          title: 'Reporting a crime to SAPS',
          content: `You have the right to report a crime at your nearest police station, or by calling 10111 in an emergency. Reporting is free, and a police official will usually complete the paperwork, taking your statement so a case can be opened and registered.

SAPS has an obligation to make sure you understand the statement you give before it's recorded: you can read it yourself, have someone read it for you, or receive it in a language you understand, with an interpreter provided if needed.

Once your case is registered, you'll receive a CAS number, keep it safe, it's your reference for every future enquiry. You also have the right to be told about developments in your case, and the investigating officer should notify you about court hearings.`,
        },
        {
          id: 'applying-for-a-protection-order',
          title: 'Applying for a protection order',
          content: `A protection order is an official court document that protects you from harm or violence. In South Africa, protection orders fall under the Domestic Violence Act 116 of 1998 and the Protection from Harassment Act of 2011, and applying for either is completely free.

The Domestic Violence Act covers abusive behaviour within domestic relationships. The Protection from Harassment Act covers stalking, unwanted contact and online harassment, including conduct directed at someone connected to you, and qualifying under one Act doesn't stop you applying under the other (Botha, 2025).

To apply, you'll typically complete an affidavit and application form at your nearest police station, which is then taken to the relevant court. Officers may ask for messages, photos, videos, incident details and dates, or names of witnesses to support your application.`,
        },
      ],
      quiz: {
        id: 'quiz-reporting-and-protection-orders',
        passScore: 2,
        questions: [
          {
            q: 'Reporting a crime to SAPS costs money.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'Which document should you receive once your case is registered?',
            options: ['A CAS number', 'A protection order', 'A court date only'],
            correct: 0,
          },
          {
            q: 'Qualifying for protection under the Domestic Violence Act means you cannot also apply under the Protection from Harassment Act.',
            options: ['True', 'False'],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'sexual-offences-and-the-law',
      title: 'Sexual Offences and the Law',
      lessons: [
        {
          id: 'legal-definitions',
          title: 'How the law defines rape and sexual assault',
          content: `Under the Sexual Offences and Related Matters Amendment Act 32 of 2007, rape is any unlawful, intentional act of sexual penetration without consent, a gender-neutral definition that applies regardless of who's involved. The Act also recognises compelled rape, when someone is forced to sexually penetrate another person against their will.

Sexual assault covers sexual violation without penetration, such as unwanted touching, and is also gender-neutral. It doesn't depend on the relationship between the people involved, it can happen within a marriage just as it can between strangers.`,
        },
        {
          id: 'consent-and-age-of-consent',
          title: 'Consent and the age of consent',
          content: `Consent must be given freely and voluntarily before any sexual act, and it must be explicit, never assumed from silence, a lack of resistance, or an existing relationship. In South Africa, the age of consent is 16, applied equally regardless of gender.`,
        },
        {
          id: 'sentencing-and-the-register',
          title: 'Sentencing and the National Register for Sex Offenders',
          content: `The Criminal Law Amendment Act 105 of 1997 sets a minimum sentence of 10 years for rape and compelled rape, with the exact sentence depending on the circumstances. Factors like the victim being underage, multiple perpetrators, or grievous bodily harm can lead to a sentence of life imprisonment.

Convicted sex offenders are placed on the National Register for Sex Offenders, used to screen anyone who may work with children or vulnerable people, and to block adoptions and foster care placements involving them.`,
        },
      ],
      quiz: {
        id: 'quiz-sexual-offences-and-the-law',
        passScore: 2,
        questions: [
          {
            q: 'The legal definition of rape in South Africa is:',
            options: [
              'Limited to specific genders',
              'Gender-neutral and covers any non-consensual sexual penetration',
              'Only applies between strangers',
            ],
            correct: 1,
          },
          {
            q: "Consent can be assumed if someone doesn't resist.",
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'The age of consent in South Africa is:',
            options: ['14', '16', '18'],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'the-criminal-justice-process',
      title: 'The Criminal Justice Process',
      lessons: [
        {
          id: 'investigation-and-prosecution',
          title: 'Investigation and prosecution',
          content: `Once a crime is reported, an investigating officer is assigned and builds a case docket, a file containing medical reports, witness statements, your own statement and other evidence. You may be asked for further information at any stage.

When the investigation is complete, the docket goes to a public prosecutor, who decides whether there's enough evidence to go to court. That decision belongs to the state, not to you or the investigating officer (National Prosecuting Authority, 2024).`,
        },
        {
          id: 'court-proceedings-and-impact',
          title: 'Court proceedings and victim impact',
          content: `Court proceedings start with a pre-trial phase, where the prosecutor submits documents and both sides appear for the first time; the accused enters a plea and may apply for bail. The trial phase follows, with evidence presented and witnesses cross-examined before a judge delivers the verdict.

If you're a vulnerable witness, you have the right to testify with an intermediary or from behind a screen, rather than face-to-face with the accused, if that would help you feel safer.

If the accused is found guilty, you may submit a victim impact statement describing how the crime affected you, mentally, physically or financially, and the court can order the convicted person to compensate you directly.`,
        },
      ],
      quiz: {
        id: 'quiz-the-criminal-justice-process',
        passScore: 2,
        questions: [
          {
            q: 'The decision to prosecute a case belongs to:',
            options: [
              'The victim',
              'The state, through the public prosecutor',
              'The investigating officer alone',
            ],
            correct: 1,
          },
          {
            q: 'Vulnerable witnesses always have to testify face-to-face with the accused.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'A victim impact statement is used to:',
            options: [
              'Decide guilt or innocence',
              "Describe how the crime affected the victim, for the court's consideration",
              'Replace a police statement',
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 'legal-aid-privacy-and-support',
      title: 'Legal Aid, Privacy and Support',
      lessons: [
        {
          id: 'getting-legal-help',
          title: 'Getting free legal help',
          content: `Legal Aid South Africa provides free legal advice and representation to people who can't afford a private lawyer. Most applicants need to pass a free means test based on income, though unemployed people, children and grant or pension recipients are usually exempt (Legal Aid South Africa, 2023). Reach them at your nearest justice centre or on 0800 110 110.

University law clinics also offer free legal advice and, where possible, supervised representation, open to the wider public, not just students. Organisations like Rape Crisis Cape Town, the Women's Legal Centre, Lawyers for Human Rights and TEARS Foundation specialise in supporting survivors of gender-based violence with guidance, referrals and court accompaniment.`,
        },
        {
          id: 'privacy-and-the-media',
          title: 'Your privacy and the media',
          content: `The Criminal Procedure Act protects information that could reveal your identity as a victim or witness, including your name, photo and address, to protect you from public exploitation or stigma and to encourage reporting.

Courts can order closed proceedings in sensitive cases, such as sexual offences or matters involving children. Your medical and counselling records stay confidential, and professionals holding them are bound by confidentiality obligations (Adefuye et al., 2024). If your case attracts public attention, you are never obligated to speak to journalists, give interviews, or be photographed, your story remains yours to share or not.`,
        },
        {
          id: 'where-to-turn-for-support',
          title: 'Where to turn for support',
          content: `For emergencies: SAPS on 10111, Emergency Medical Services on 10177. For GBV-specific support: the GBV Command Centre on 0800 428 428, the Gender Violence Helpline on 0800 150 150, Childline South Africa on 116, and the National Shelter Movement on 0800 001 005.

For legal help: Legal Aid South Africa on 0800 110 110. For specialised support: Rape Crisis Cape Town, the Women's Legal Centre, and Lawyers for Human Rights. You can also ask any SAPS official, hospital or clinic whether there's a Thuthuzela Care Centre near you.`,
        },
      ],
      quiz: {
        id: 'quiz-legal-aid-privacy-and-support',
        passScore: 2,
        questions: [
          {
            q: 'Who is generally exempt from the Legal Aid means test?',
            options: [
              'High-income earners',
              'Unemployed people, children and grant or pension recipients',
              'No one, everyone must pass it',
            ],
            correct: 1,
          },
          {
            q: 'A survivor is legally required to speak to the media if their case becomes public.',
            options: ['True', 'False'],
            correct: 1,
          },
          {
            q: 'Which number connects you to the GBV Command Centre?',
            options: ['10111', '0800 428 428', '116'],
            correct: 1,
          },
        ],
      },
    },
  ],
  finalAssessment: {
    id: 'final-assessment-law-and-your-rights',
    passScore: 5,
    questions: [
      {
        q: "The Constitution's Bill of Rights protects survivors' rights to equality, dignity, security and privacy.",
        options: ['True', 'False'],
        correct: 0,
      },
      {
        q: 'Reporting a crime to SAPS is:',
        options: [
          'A paid service',
          'A free service',
          'Only available to certain victims',
        ],
        correct: 1,
      },
      {
        q: 'Protection orders in South Africa can be applied for:',
        options: [
          'Only with a lawyer, for a fee',
          'Free of charge, through the court',
          'Only after a criminal conviction',
        ],
        correct: 1,
      },
      {
        q: 'The legal age of consent in South Africa is:',
        options: ['14', '16', '18'],
        correct: 1,
      },
      {
        q: 'The decision to prosecute a case belongs to:',
        options: [
          'The victim',
          'The state, via the public prosecutor',
          'The police officer who took the statement',
        ],
        correct: 1,
      },
      {
        q: 'Legal Aid South Africa provides:',
        options: [
          'Paid legal services only',
          'Free legal advice and representation for those who qualify',
          'Advice only to convicted criminals',
        ],
        correct: 1,
      },
      {
        q: "A survivor's identity in a criminal case is:",
        options: [
          'Publicly available by default',
          'Protected under the Criminal Procedure Act',
          'Only protected if they pay for privacy',
        ],
        correct: 1,
      },
    ],
  },
};
