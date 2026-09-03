export const COURSES = [
  {
    id: 'gbv-awareness',
    title: 'GBV Awareness',
    tagline: 'What gender-based violence actually looks like',
    lessons: [
      {
        id: 'what-is-gbv',
        title: 'What is GBV?',
        content: `Gender-based violence (GBV) is any harmful act directed at a person because of their gender. It includes physical, sexual, emotional, verbal, financial, and psychological abuse, as well as stalking, harassment, and coercive control.

GBV can happen in relationships, families, workplaces, schools, and online. It affects people of all ages, backgrounds, and genders, though women and girls are disproportionately affected in South Africa.

You don't need visible injuries or a police case for something to count as abuse. Patterns of control, fear, and harm are enough.`,
      },
      {
        id: 'forms-of-abuse',
        title: 'The many forms abuse takes',
        content: `Physical abuse is the most visible form, but it's often not the first. Emotional abuse (constant criticism, humiliation, threats) frequently comes first and can be just as damaging.

Financial abuse means controlling someone's access to money: taking their salary, preventing them from working, or forcing them to explain every purchase.

Coercive control is a pattern, not a single incident: isolating someone from friends and family, monitoring their phone or movements, and making them feel like they have no choice.`,
      },
      {
        id: 'why-people-stay',
        title: 'Why people stay, and why that\'s the wrong question',
        content: `"Why didn't they just leave?" is one of the most common questions asked, and one of the most harmful. Leaving is often the most dangerous time in an abusive relationship: risk of violence increases sharply around separation.

People stay for real reasons: fear for their safety or their children's safety, financial dependence, lack of support, shame, or genuine love mixed with fear. Understanding this shifts the question from "why do they stay" to "what would make it safer for them to leave."`,
      },
    ],
  },
  {
    id: 'healthy-relationships',
    title: 'Healthy Relationships',
    tagline: 'What trust and respect actually look like day to day',
    lessons: [
      {
        id: 'trust-vs-control',
        title: 'Trust vs. control',
        content: `Healthy relationships are built on trust: the freedom to have friends, opinions, and a life outside the relationship, without needing permission or explaining yourself.

Control often disguises itself as care: "I just worry about you" can become a reason to check your phone, dictate what you wear, or decide who you're allowed to see. If you feel like you're managing someone else's feelings to avoid conflict, that's worth paying attention to.`,
      },
      {
        id: 'communication',
        title: 'Communication that works',
        content: `Healthy communication means both people can disagree without it turning into a threat, punishment, or silent treatment used as control. Disagreements are normal; feeling afraid to disagree is not.

A useful test: after a difficult conversation, do you feel heard, even if you didn't get your way? Or do you feel like you have to walk on eggshells to avoid the next blow-up?`,
      },
      {
        id: 'red-flags',
        title: 'Early warning signs',
        content: `Some patterns worth noticing early: wanting to move very fast, jealousy framed as flattery, isolating you from friends and family "because they don't understand us," and blaming you for their anger ("you made me do this").

None of these guarantee abuse on their own, but a pattern of several together is worth taking seriously. Trust your own discomfort even if you can't fully explain it yet.`,
      },
    ],
  },
  {
    id: 'consent',
    title: 'Consent',
    tagline: 'Clear, ongoing, and freely given',
    lessons: [
      {
        id: 'what-consent-means',
        title: 'What consent actually means',
        content: `Consent is a clear, freely given, and ongoing agreement. It can be withdrawn at any time, for any reason, even partway through. Silence or not saying "no" is not the same as saying "yes."

Consent given under pressure, fear, or manipulation isn't real consent. Someone who is asleep, unconscious, or incapacitated cannot consent.`,
      },
      {
        id: 'consent-in-relationships',
        title: 'Consent doesn\'t disappear in a relationship',
        content: `Being in a relationship, being married, or having said yes before does not mean consent is automatically given every time after. Each time matters, and either person can say no at any point.

A partner who respects you will not punish you, guilt-trip you, or pressure you for saying no.`,
      },
    ],
  },
  {
    id: 'online-safety',
    title: 'Online Safety',
    tagline: 'Protecting yourself in digital spaces',
    lessons: [
      {
        id: 'digital-abuse',
        title: 'What digital abuse looks like',
        content: `Digital abuse includes constant monitoring of your messages and location, demanding your passwords, controlling who you follow or talk to online, and threatening to share private photos or information without consent.

This is a real and growing part of GBV, not "just online" or less serious than in-person abuse.`,
      },
      {
        id: 'protecting-yourself',
        title: 'Practical steps to protect yourself',
        content: `Use strong, unique passwords and enable two-factor authentication where you can. Review which apps have access to your location, and turn off location sharing you don't need.

If someone has access to your accounts or devices and you no longer want them to, changing passwords from a device they don't have access to is safer than doing it from a shared device.`,
      },
    ],
  },
];

// Courses shown ONLY to under-18 accounts (age_group === 'under18'),
// symmetric to how ADVANCED_COURSES in allyCourseData.js is shown only
// to 18+ accounts. Same simple shape as COURSES (no modules, no quiz,
// no certificate) — see pages/learn/[courseId].js and pages/learn/index.js.
export const UNDER18_COURSES = [
  {
    id: 'culture-and-gender-norms',
    title: 'Raised by Culture, Shaped by Choices',
    tagline: 'Understanding culture, gender norms, and gender-based violence',
    lessons: [
      {
        id: 'where-ideas-about-gender-come-from',
        title: 'Where our ideas about gender come from',
        content: `Every family and community has its own way of doing things, and growing up, you learn what's considered "normal": how to speak to elders, how to behave, and often what boys and girls are "supposed" to do. Culture can give you identity, belonging and values, but not everything passed down from one generation to the next is automatically fair or healthy.

Gender-based violence (GBV) doesn't start only when someone gets physically hurt. Harmful attitudes about power, control, masculinity and femininity can make inequality feel normal long before that (World Health Organization, 2026). Culture doesn't cause GBV on its own, but certain norms, like the idea that men must always have the final say, can create the unequal power that makes controlling behaviour look acceptable (UN Women, 2026).

You don't have to reject your culture to notice this. A useful question for any belief you were taught is: does this encourage respect, equality and safety, or does it encourage fear, control and inequality?`,
      },
      {
        id: 'gender-stereotypes-and-who-they-hurt',
        title: 'Gender stereotypes, and who they hurt',
        content: `A gender stereotype is a general belief about how you're supposed to behave because of your gender: "boys are strong," "girls are emotional," "men should provide," "women should take care of the home." These can sound harmless, but when you're constantly judged against them, they start to limit what you believe you're allowed to be.

They cut both ways. A boy who enjoys caring for younger kids might get told it's "a girl's thing." A girl who leads confidently might get called bossy, while a boy doing the same gets praised. The WHO notes that rigid ideas about masculinity can push boys toward risk-taking, discourage them from asking for help, and contribute to violence in some cases (World Health Organization, 2026), while UNICEF points out that gender norms can also restrict what girls feel they're allowed to want (UNICEF, 2023).

A simple test: would you expect the same behaviour from someone of a different gender in the same situation? If not, that expectation might be more stereotype than substance.`,
      },
      {
        id: 'real-man-good-woman',
        title: "What being a 'real man' and a 'good woman' actually means",
        content: `Boys often grow up hearing that a "real man" is strong, tough, financially successful and emotionally controlled, never fearful, sad or vulnerable. But real strength includes knowing when to ask for help, apologising when you're wrong, respecting someone's boundaries, and managing anger without hurting anyone. Rigid masculinity, the WHO notes, actually discourages help-seeking and can contribute to risky or violent behaviour (World Health Organization, 2026).

Girls often hear the opposite: that a "good woman" is quiet, obedient, caring, and always puts everyone else first. But being a good person was never about obedience. You can disagree respectfully, have your own goals, say no, and decide what behaviour you'll accept in a relationship, none of that makes you less "good."

Being a good man doesn't mean being dominant. Being a good woman doesn't mean being silent. Being a good person means treating yourself and others with dignity.`,
      },
      {
        id: 'relationships-power-and-control',
        title: 'Relationships, power and control',
        content: `Healthy relationships are built on respect, trust, communication, consent and shared decisions. Unhealthy ones often involve one person trying to control the other: checking someone's phone without permission, demanding passwords, isolating them from friends, controlling money, or pressuring them into sexual activity. The WHO defines this kind of controlling behaviour, alongside physical, sexual or psychological harm from a partner, as intimate partner violence, not just "being protective" (World Health Organization, 2026).

Some quick comparisons: "I trust you and respect your decision" is healthy; "if you loved me, you'd do exactly what I say" is controlling. "Can we talk about what happened?" is healthy; "you're not allowed to speak to that person" is controlling. Love isn't ownership, someone can care about you without controlling your choices.`,
      },
      {
        id: 'fitting-in-and-victim-blaming',
        title: 'Fitting in, and why victim-blaming is never the answer',
        content: `Pressure to fit in, from friends, social media, family or your community, can feel stronger when it's tied to gender: a boy feeling he needs sexual experience to belong, a girl being told jealousy just means her boyfriend cares. Belonging matters, but it should never require giving up your safety or your values.

Victim-blaming happens when people focus on what the survivor did instead of the person who chose to cause harm, questions like "why did you stay?" or "what were you wearing?" only add shame and make it harder for someone to ask for help. Nothing about someone's clothing, personality, location or decision to trust another person gives anyone permission to hurt them.

If someone tells you they've experienced abuse: listen without judging, tell them it's not their fault, and help them find a trusted adult, counsellor or support service, rather than confronting the person yourself.`,
      },
      {
        id: 'breaking-the-cycle',
        title: 'Breaking the cycle',
        content: `Breaking the cycle doesn't mean rejecting your whole culture, it means keeping the values that promote dignity and questioning the ones that promote inequality or violence. It starts with noticing the messages you've absorbed about gender, learning healthier ways to communicate and handle disagreements, and speaking up when harmful behaviour gets treated as normal (UN Women, 2026).

You don't have to fix gender-based violence by yourself, adults and institutions have responsibilities here too. But small things matter: questioning a sexist joke instead of laughing along, respecting someone's boundaries, refusing to share private images without consent, and treating people equally.

You were raised by your culture, but you're also shaped by your choices. You get to carry forward what brings people together, while helping build a future where no one experiences violence because of their gender.`,
      },
    ],
  },
];
