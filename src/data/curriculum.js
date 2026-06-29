const unitBlueprints = [
  {
    unit: 1,
    title: 'Capital Markets',
    description: 'Issuers, investors, markets, economics, and how securities flow.',
    color: '#ee6d4f',
    topics: [
      ['markets-purpose', 'Purpose of Capital Markets', 'Issuers raise capital while investors seek returns', 'capital formation', 'Capital markets transfer money from investors to issuers so businesses and governments can fund growth.'],
      ['primary-secondary', 'Primary vs. Secondary Markets', 'New issues versus investor-to-investor trading', 'primary market', 'In the primary market, securities are sold by the issuer and proceeds go to that issuer.'],
      ['issuers-investors', 'Issuers and Investors', 'Who needs capital and who supplies it', 'issuer', 'An issuer is the entity that sells securities to raise funds.'],
      ['broker-dealers', 'Broker-Dealers', 'Agency, principal, markups, and commissions', 'broker-dealer', 'Broker-dealers may act as agents for commissions or principals for markups and markdowns.'],
      ['market-makers', 'Market Makers', 'Bid, ask, spread, and liquidity', 'spread', 'The spread is the difference between the bid price and ask price.'],
      ['exchanges-otc', 'Exchanges and OTC Markets', 'Auction markets, dealer markets, and listings', 'exchange', 'Exchanges are centralized auction markets; OTC trading often happens through dealer networks.'],
      ['economic-factors', 'Economic Factors', 'Inflation, interest rates, and business cycles', 'inflation', 'Inflation reduces purchasing power and can influence interest rates and security prices.'],
      ['fed-policy', 'Federal Reserve Policy', 'Monetary policy and market impact', 'monetary policy', 'The Federal Reserve uses monetary policy tools to influence credit conditions and money supply.'],
      ['rates-yields', 'Rates and Yields', 'How rates affect bonds and investors', 'interest rates', 'Bond prices generally move inversely to interest rates.'],
      ['indexes-averages', 'Indexes and Averages', 'Benchmarks and market measurement', 'index', 'An index measures the performance of a selected group of securities.'],
      ['market-risk', 'Market Risk', 'Systematic risk and broad price movement', 'systematic risk', 'Systematic risk affects the overall market and cannot be diversified away completely.'],
      ['capital-markets-review', 'Capital Markets Review', 'Spiral review across the unit', 'liquidity', 'Liquidity means the ability to buy or sell an investment quickly at a fair price.'],
    ],
  },
  {
    unit: 2,
    title: 'Products and Risks',
    description: 'Equities, bonds, funds, options basics, taxation, and product risk.',
    color: '#7656d8',
    topics: [
      ['common-stock', 'Common Stock', 'Ownership, voting rights, and dividends', 'common stock', 'Common stock represents ownership and usually includes voting rights.'],
      ['preferred-stock', 'Preferred Stock', 'Income priority and hybrid features', 'preferred stock', 'Preferred stock generally has dividend priority over common stock but usually limited voting rights.'],
      ['corporate-bonds', 'Corporate Bonds', 'Debt, coupons, maturity, and issuer risk', 'bond', 'A bond is debt; the issuer borrows money and promises interest plus principal repayment.'],
      ['muni-bonds', 'Municipal Bonds', 'Government issuers and tax treatment', 'municipal bond', 'Municipal bonds are issued by states or local governments and may offer tax advantages.'],
      ['treasuries', 'U.S. Government Securities', 'Bills, notes, bonds, and safety', 'Treasury', 'Treasury securities are backed by the full faith and credit of the U.S. government.'],
      ['bond-risks', 'Bond Risks', 'Interest rate, credit, call, and reinvestment risk', 'call risk', 'Call risk is the risk that a bond is redeemed before maturity, often when rates fall.'],
      ['mutual-funds', 'Mutual Funds', 'NAV, diversification, and expenses', 'NAV', 'Mutual fund shares are priced at net asset value, typically calculated after market close.'],
      ['etfs', 'ETFs', 'Exchange trading and fund structure', 'ETF', 'ETFs trade on exchanges intraday and usually track a basket or index.'],
      ['options-basics', 'Options Basics', 'Calls, puts, premiums, and rights', 'call option', 'A call option gives the buyer the right to buy the underlying security.'],
      ['variable-products', 'Variable Products', 'Insurance-linked investment products', 'variable annuity', 'Variable annuities have investment risk because returns depend on separate account performance.'],
      ['tax-risk', 'Taxation and Product Risk', 'Capital gains, income, and suitability basics', 'capital gain', 'A capital gain occurs when an investment is sold for more than its cost basis.'],
      ['products-review', 'Products Review', 'Spiral review across product types', 'diversification', 'Diversification spreads exposure across investments but does not eliminate market risk.'],
    ],
  },
  {
    unit: 3,
    title: 'Accounts and Trading',
    description: 'Account types, orders, settlement, statements, and customer handling.',
    color: '#229a7a',
    topics: [
      ['account-types', 'Account Types', 'Individual, joint, custodial, and entity accounts', 'custodial account', 'A custodial account is opened by an adult for the benefit of a minor.'],
      ['new-accounts', 'Opening New Accounts', 'Required information and approvals', 'new account form', 'Firms must collect key customer information when opening an account.'],
      ['customer-profile', 'Customer Profile', 'Objectives, risk tolerance, and time horizon', 'risk tolerance', 'Risk tolerance describes how much uncertainty or loss a customer can accept.'],
      ['suitability-basics', 'Suitability Basics', 'Matching products to customer needs', 'suitability', 'Recommendations should align with the customer profile and investment objective.'],
      ['order-types', 'Order Types', 'Market, limit, stop, and stop-limit orders', 'limit order', 'A limit order sets the maximum buy price or minimum sell price.'],
      ['trade-capacity', 'Trade Capacity', 'Agent, principal, and riskless principal', 'principal trade', 'In a principal trade, the firm trades from its own inventory.'],
      ['settlement', 'Clearance and Settlement', 'Trade date, settlement date, and delivery', 'settlement', 'Settlement is when securities and cash are exchanged after a trade.'],
      ['confirmations', 'Confirmations', 'Trade details and customer disclosure', 'confirmation', 'A confirmation provides key trade details to the customer after execution.'],
      ['statements', 'Account Statements', 'Holdings, activity, and customer review', 'account statement', 'Account statements summarize positions, balances, and activity.'],
      ['margin-basics', 'Margin Basics', 'Borrowing, equity, and risk', 'margin', 'Margin allows customers to borrow from the broker-dealer using securities as collateral.'],
      ['communications', 'Customer Communications', 'Correspondence and public communications', 'retail communication', 'Retail communications are distributed or made available to more than 25 retail investors.'],
      ['accounts-review', 'Accounts and Trading Review', 'Spiral review across customer workflow', 'trade date', 'Trade date is the day the transaction is executed.'],
    ],
  },
  {
    unit: 4,
    title: 'Regulations and Conduct',
    description: 'Regulators, prohibited practices, registration, AML, and ethics.',
    color: '#d89b22',
    topics: [
      ['regulators', 'Regulators and SROs', 'SEC, FINRA, MSRB, and exchanges', 'FINRA', 'FINRA is a self-regulatory organization for broker-dealers.'],
      ['registration', 'Registration Basics', 'Associated persons and qualification exams', 'registration', 'Certain securities roles require registration and qualification exams.'],
      ['customer-protection', 'Customer Protection', 'Custody, segregation, and customer assets', 'customer protection', 'Customer protection rules are designed to safeguard customer assets.'],
      ['aml', 'Anti-Money Laundering', 'Suspicious activity and customer identification', 'AML', 'AML programs help detect and prevent money laundering and suspicious activity.'],
      ['insider-trading', 'Insider Trading', 'Material nonpublic information', 'material nonpublic information', 'Trading on material nonpublic information is prohibited.'],
      ['prohibited-practices', 'Prohibited Practices', 'Manipulation, fraud, and misleading conduct', 'market manipulation', 'Market manipulation involves artificial activity designed to mislead investors.'],
      ['communications-rules', 'Communications Rules', 'Fair, balanced, and not misleading', 'fair and balanced', 'Communications with the public must be fair, balanced, and not misleading.'],
      ['privacy', 'Privacy and Data Protection', 'Customer information and confidentiality', 'privacy notice', 'Customers receive privacy notices describing information sharing practices.'],
      ['complaints', 'Customer Complaints', 'Escalation, records, and supervision', 'complaint', 'Written customer complaints are important records and must be handled under firm procedures.'],
      ['continuing-education', 'Continuing Education', 'Maintaining knowledge and registration', 'continuing education', 'Registered persons must satisfy continuing education requirements.'],
      ['ethics', 'Ethics and Professional Conduct', 'Putting customers and markets first', 'ethical conduct', 'Ethical conduct protects customers, firms, and market integrity.'],
      ['regulations-review', 'Regulations Review', 'Spiral review across rules and conduct', 'supervision', 'Supervision means firm oversight designed to ensure compliance with securities rules.'],
    ],
  },
]

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function buildTopicQuestions(topic, unitTitle, unitIndex, topicIndex) {
  const [id, title, detail, keyTerm, explanation] = topic
  const unitConcepts = unitBlueprints.find((unit) => unit.title === unitTitle)?.topics || []
  const neighborTopics = unitConcepts.filter((item) => item[0] !== id)
  const matchingPairs = [
    { left: keyTerm, right: explanation },
    { left: title, right: detail },
    { left: unitTitle, right: `The SIE content area that includes ${title.toLowerCase()}` },
    { left: 'Exam approach', right: `Identify how ${keyTerm.toLowerCase()} affects the customer, product, market, or rule being tested` },
  ]
  const relatedDistractors = neighborTopics.slice(topicIndex % Math.max(neighborTopics.length, 1)).concat(neighborTopics).slice(0, 3)
  const conceptDistractors = relatedDistractors.map((item) => item[4])
  while (conceptDistractors.length < 3) {
    conceptDistractors.push([
      'It guarantees that an investor cannot lose money.',
      'It applies only to bank deposit products, not securities.',
      'It removes the need to consider customer objectives or risk.',
    ][conceptDistractors.length])
  }
  const base = [
    {
      type: 'choice',
      prompt: `Which statement best describes ${keyTerm} in the context of ${title}?`,
      options: [explanation, ...conceptDistractors],
      answer: 0,
      explanation,
      incorrectExplanations: [
        'This choice points to a different SIE concept, so it does not answer this lesson objective.',
        'This choice is too absolute. Securities questions rarely reward guarantees unless the product truly has one.',
        'This choice ignores the actual role of the concept in the securities markets.',
      ],
    },
    {
      type: 'choice',
      prompt: `Why does ${title.toLowerCase()} matter for an SIE candidate?`,
      options: [
        `It helps identify how ${detail.toLowerCase()} appears in exam questions.`,
        'It is only tested after someone becomes a principal.',
        'It guarantees the best investment choice for every customer.',
        'It is unrelated to customer, product, market, or regulatory questions.',
      ],
      answer: 0,
      explanation: `The SIE tests whether you understand the practical meaning of ${title.toLowerCase()}, especially ${detail.toLowerCase()}.`,
      incorrectExplanations: [
        'The SIE tests foundational concepts, not only principal-level rules.',
        'No single concept guarantees the best investment for every customer.',
        `${title} is part of the ${unitTitle} content area, so it is relevant to the exam.`,
      ],
    },
    {
      type: 'true_false',
      prompt: `${title}: ${explanation}`,
      answer: true,
      explanation: `True. This is the core idea to remember for ${keyTerm.toLowerCase()}.`,
    },
    {
      type: 'choice',
      prompt: `A question stem mentions "${keyTerm}." What should you do first?`,
      options: [
        `Connect it to ${detail.toLowerCase()} before evaluating the answer choices.`,
        'Pick the answer choice that promises the highest return.',
        'Assume the question is asking about a bank deposit.',
        'Ignore the customer or market facts in the stem.',
      ],
      answer: 0,
      explanation: `Start by identifying the concept being tested. For ${keyTerm.toLowerCase()}, the anchor idea is ${detail.toLowerCase()}.`,
      incorrectExplanations: [
        'The SIE is not asking you to chase the highest return without context.',
        'SIE securities questions are usually not about bank deposit products unless stated.',
        'Customer and market facts often determine the correct answer.',
      ],
    },
    {
      type: 'matching',
      prompt: `Match each ${title} concept to its best description.`,
      pairs: matchingPairs,
      explanation: `These pairings connect the lesson term, its practical meaning, and how it fits within ${unitTitle}.`,
    },
    {
      type: 'choice',
      prompt: `Which answer is the most likely exam trap when studying ${title.toLowerCase()}?`,
      options: [
        'Choosing an absolute answer that says risk is eliminated or returns are guaranteed.',
        'Reading the full question stem before choosing.',
        'Eliminating answer choices that describe unrelated concepts.',
        'Using the lesson objective to identify what the question is testing.',
      ],
      answer: 0,
      explanation: `For ${title.toLowerCase()}, be careful with absolute wording. Most SIE topics involve tradeoffs, rules, or risk.`,
      incorrectExplanations: [
        'Reading the whole stem is a good habit, not a trap.',
        'Eliminating unrelated concepts is a useful test strategy.',
        'Identifying the tested concept is exactly what strong candidates do.',
      ],
    },
  ]

  return base.map((question, questionIndex) => ({
    ...question,
    key: `${id}-q${questionIndex + 1}`,
    topicId: id,
    topicTitle: title,
    unitTitle,
    difficulty: questionIndex < 4 ? 'Foundational' : questionIndex < 8 ? 'Applied' : 'Review',
    spiral: unitIndex + topicIndex + questionIndex,
  }))
}

function buildCheckIn(unit, start, end, final = false) {
  const coveredTopics = unit.topics.slice(start, end)
  const sourceQuestions = coveredTopics.flatMap((topic, topicIndex) =>
    buildTopicQuestions(topic, unit.title, unit.unit, start + topicIndex),
  )
  const questionCount = final ? 20 : 10
  return {
    id: `${slug(unit.title)}-${final ? 'final-check-in' : `check-in-${Math.ceil(end / 3)}`}`,
    title: final ? `${unit.title} Final Check-In` : `${unit.title} Check-In ${Math.ceil(end / 3)}`,
    detail: final ? '20-question readiness check across the full unit' : 'Score 80%+ to unlock the next lesson set',
    xp: final ? 80 : 35,
    isCheckIn: true,
    passingScore: 80,
    questions: Array.from({ length: questionCount }, (_, index) => ({
      ...sourceQuestions[index % sourceQuestions.length],
      key: `${slug(unit.title)}-${final ? 'final' : `check-${Math.ceil(end / 3)}`}-q${index + 1}`,
    })),
  }
}

function buildCurriculum() {
  return unitBlueprints.map((unit) => {
    const lessons = []
    unit.topics.forEach((topic, topicIndex) => {
      const [id, title, detail] = topic
      lessons.push({
        id,
        title,
        detail,
        xp: 25 + (topicIndex % 3) * 5,
        isCheckIn: false,
        questions: buildTopicQuestions(topic, unit.title, unit.unit, topicIndex),
      })
      if ((topicIndex + 1) % 3 === 0 && topicIndex + 1 < unit.topics.length) {
        lessons.push(buildCheckIn(unit, topicIndex - 2, topicIndex + 1))
      }
    })
    lessons.push(buildCheckIn(unit, 0, unit.topics.length, true))
    return { ...unit, lessons }
  })
}

export const curriculum = buildCurriculum()
export const allLessons = curriculum.flatMap((unit) => unit.lessons)
