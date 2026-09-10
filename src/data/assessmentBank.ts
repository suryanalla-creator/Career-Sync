import { AssessmentQuestion, AssessmentQuestionType } from '../types';

export interface EvaluatedQuestionResult {
  question: AssessmentQuestion;
  userAnswer: any;
  isCorrect: boolean;
  scoreRatio: number; // 0 to 1
  pointsEarned: number;
  maxPoints: number;
  userDisplay: string;
  correctDisplay: string;
}

export interface AssessmentEvaluationResult {
  overallScore: number;
  technicalScore: number;
  softScore: number;
  problemSolvingScore: number;
  dataAiScore: number;
  readinessTier: string;
  readinessLabel: string;
  categoryScores: Record<string, number>;
  totalPointsEarned: number;
  totalMaxPoints: number;
  results: EvaluatedQuestionResult[];
}

export const QUESTION_BANK: AssessmentQuestion[] = [
  // ==========================================
  // PROGRAMMING & ARCHITECTURE (Single, Multi, Code, Fill)
  // ==========================================
  {
    id: 'prog-1',
    type: 'single-select',
    section: 'Programming',
    difficulty: 'Medium',
    points: 10,
    title: 'Event Loop Execution Order',
    question: 'In modern JavaScript runtimes (Node.js & V8), how does the event loop prioritize microtasks vs macrotasks?',
    options: [
      'All pending microtasks (e.g., Promise callbacks, queueMicrotask) execute immediately after the current task and before the next macrotask (e.g., setTimeout).',
      'Macrotasks and microtasks are queued together in a single FIFO queue without priority.',
      'Macrotasks take precedence over microtasks to prevent starvation of I/O operations.',
      'Microtasks only execute once every 60Hz animation frame.'
    ],
    correctOption: 0,
    explanation: 'The JavaScript event loop runs one macrotask, then drains the ENTIRE microtask queue before rendering or moving to the next macrotask in the queue.'
  },
  {
    id: 'prog-2',
    type: 'multi-select',
    section: 'Programming',
    difficulty: 'Hard',
    points: 12,
    title: 'HTTP Method Idempotence',
    question: 'According to RFC 9110 HTTP Semantics, which of the following HTTP request methods are strictly defined as IDEMPOTENT? (Select ALL that apply)',
    options: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH'
    ],
    correctOptions: [0, 2, 3], // GET, PUT, DELETE are idempotent; POST and PATCH are not guaranteed idempotent
    explanation: 'Idempotent methods produce identical side-effects on the server regardless of how many times they are executed. GET, PUT, and DELETE are idempotent. POST and PATCH are not.'
  },
  {
    id: 'prog-3',
    type: 'multi-select',
    section: 'Programming',
    difficulty: 'Medium',
    points: 10,
    title: 'ACID Database Guarantees',
    question: 'Which of the following represent core properties guaranteed by relational database ACID transactions? (Select ALL that apply)',
    options: [
      'Atomicity: Transactions are all-or-nothing units of work.',
      'Consistency: Transactions move the database from one valid state to another, respecting all constraints.',
      'Availability: Every non-failing node must return a non-error response for every request.',
      'Isolation: Concurrent transactions execute without cross-transaction interference.',
      'Durability: Committed transactions persist permanently even across power failures.'
    ],
    correctOptions: [0, 1, 3, 4], // ACID: Atomicity, Consistency, Isolation, Durability (Availability is from CAP)
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. "Availability" is part of the CAP theorem, not ACID.'
  },
  {
    id: 'prog-4',
    type: 'code-analysis',
    section: 'Programming',
    difficulty: 'Medium',
    points: 12,
    title: 'JavaScript Asynchronous Loop Behavior',
    language: 'javascript',
    codeSnippet: `async function compute() {
  const values = [1, 2, 3];
  let sum = 0;
  values.forEach(async (n) => {
    sum += await Promise.resolve(n * 2);
  });
  return sum;
}
compute().then(console.log);`,
    question: 'What is logged to the console when `compute()` executes?',
    options: [
      '0 (because Array.prototype.forEach does not await async callbacks)',
      '12 (1*2 + 2*2 + 3*2)',
      'NaN',
      'Promise { <pending> }'
    ],
    correctOption: 0,
    explanation: '`Array.prototype.forEach` ignores returned promises from async callback functions. It does not await them, so `compute()` returns `sum` (which is still 0) before any of the promises resolve.'
  },
  {
    id: 'prog-5',
    type: 'code-analysis',
    section: 'Programming',
    difficulty: 'Hard',
    points: 12,
    title: 'Python Mutable Default Arguments',
    language: 'python',
    codeSnippet: `def append_item(val, bucket=[]):
    bucket.append(val)
    return bucket

print(append_item(10))
print(append_item(20, []))
print(append_item(30))`,
    question: 'What is the final output printed by the third call `append_item(30)`?',
    options: [
      '[10, 30]',
      '[30]',
      '[10, 20, 30]',
      'TypeError'
    ],
    correctOption: 0,
    explanation: 'In Python, default arguments are evaluated ONCE at function definition time. The default list `bucket` is reused across all invocations that omit the second argument, producing `[10, 30]`.'
  },
  {
    id: 'prog-6',
    type: 'fill-blank',
    section: 'Programming',
    difficulty: 'Medium',
    points: 10,
    title: 'HTTP Status Code for Client Authentication Failure',
    question: 'Which 3-digit HTTP status code denotes "Unauthorized" (the client must authenticate itself to get the requested response)?',
    placeholder: 'e.g. 200',
    acceptedAnswers: ['401', 'HTTP 401', '401 UNAUTHORIZED'],
    explanation: 'HTTP 401 Unauthorized indicates that the request lacks valid authentication credentials. (Note that 403 indicates Forbidden when authenticated but lacking permissions).'
  },
  {
    id: 'prog-7',
    type: 'fill-blank',
    section: 'Programming',
    difficulty: 'Hard',
    points: 12,
    title: 'Average Time Complexity of QuickSort',
    question: 'Enter the standard average-case time complexity of QuickSort in Big-O notation:',
    placeholder: 'e.g. O(N^2) or O(N log N)',
    acceptedAnswers: ['O(N LOG N)', 'O(NLOGN)', 'O(N*LOGN)', 'O(N*LOG(N))', 'O(N LOG(N))', 'N LOG N', 'NLOGN'],
    explanation: 'QuickSort has an average and best-case time complexity of O(N log N) when using randomized or median-of-three pivots.'
  },

  // ==========================================
  // DATA & AI / SYSTEM DESIGN (Single, Multi, Code, Fill)
  // ==========================================
  {
    id: 'ai-1',
    type: 'single-select',
    section: 'Data & AI',
    difficulty: 'Medium',
    points: 10,
    title: 'Transformer Attention Complexity',
    question: 'In standard Transformer architectures (Vaswani et al.), what is the computational complexity of the scaled dot-product self-attention mechanism with respect to sequence length N?',
    options: [
      'O(N²) quadratic complexity due to pairwise token similarity matrices',
      'O(N log N) quasi-linear complexity',
      'O(N) strictly linear complexity',
      'O(N³) cubic matrix multiplication complexity'
    ],
    correctOption: 0,
    explanation: 'Self-attention calculates Q * K^T, which produces an N x N matrix comparing every token against every other token, requiring O(N²) time and memory.'
  },
  {
    id: 'ai-2',
    type: 'multi-select',
    section: 'Data & AI',
    difficulty: 'Medium',
    points: 10,
    title: 'Preventing Deep Learning Overfitting',
    question: 'Which of the following techniques are effective and standard methods to mitigate overfitting in deep neural networks? (Select ALL that apply)',
    options: [
      'Dropout layer regularization during training',
      'Early stopping based on validation loss divergence',
      'Data augmentation (e.g., flips, rotations, jitter)',
      'Increasing learning rate by 100x during convergence',
      'L2 Weight Decay regularization'
    ],
    correctOptions: [0, 1, 2, 4],
    explanation: 'Dropout, early stopping, data augmentation, and L2 weight decay reduce generalization error and prevent models from memorizing training noise. Dramatically spiking learning rate causes divergence.'
  },
  {
    id: 'ai-3',
    type: 'code-analysis',
    section: 'Data & AI',
    difficulty: 'Hard',
    points: 12,
    title: 'NumPy Tensor Broadcasting',
    language: 'python',
    codeSnippet: `import numpy as np

a = np.ones((3, 1, 4))
b = np.ones((2, 4))
c = a + b
print(c.shape)`,
    question: 'What is the resulting shape of array `c` after broadcasting in NumPy?',
    options: [
      '(3, 2, 4)',
      '(3, 1, 4)',
      'ValueError: shapes cannot be broadcast together',
      '(2, 3, 4)'
    ],
    correctOption: 0,
    explanation: 'In NumPy broadcasting, trailing dimensions are aligned. `b` has shape (2, 4) &rarr; prepended to (1, 2, 4). Aligning with (3, 1, 4), dimensions 1 and 3 broadcast to 3 and 2, yielding shape (3, 2, 4).'
  },
  {
    id: 'ai-4',
    type: 'fill-blank',
    section: 'Data & AI',
    difficulty: 'Medium',
    points: 10,
    title: 'Model Adaptation Technique',
    question: 'What is the term for taking a pre-trained foundation model and training it further on a smaller, domain-specific dataset with a low learning rate?',
    placeholder: 'e.g. quantization, distillation...',
    acceptedAnswers: ['FINE-TUNING', 'FINETUNING', 'FINE TUNING', 'TRANSFER LEARNING'],
    explanation: 'Fine-tuning (or supervised transfer learning) adapts generalized weights of large foundation models to high-accuracy domain tasks.'
  },

  // ==========================================
  // PROBLEM SOLVING & ALGORITHMS (Single, Code, Multi)
  // ==========================================
  {
    id: 'ps-1',
    type: 'single-select',
    section: 'Problem Solving',
    difficulty: 'Hard',
    points: 12,
    title: 'Dynamic Programming Characteristics',
    question: 'Which two fundamental mathematical properties are mandatory for a problem to be solved using Dynamic Programming?',
    options: [
      'Optimal Substructure and Overlapping Subproblems',
      'Greedy Choice Property and Independence of Variables',
      'Divide-and-Conquer Homogeneity and Monotonicity',
      'Strict Convexity and Differentiability'
    ],
    correctOption: 0,
    explanation: 'Dynamic Programming requires (1) Optimal Substructure (an optimal solution contains optimal sub-solutions) and (2) Overlapping Subproblems (subproblems recur repeatedly and can be memoized).'
  },
  {
    id: 'ps-2',
    type: 'code-analysis',
    section: 'Problem Solving',
    difficulty: 'Medium',
    points: 10,
    title: 'Binary Search Edge Condition',
    language: 'javascript',
    codeSnippet: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    question: 'If `arr = [2, 4, 6, 8, 10, 12]` and `target = 7`, what does `binarySearch` return, and how many loop iterations execute?',
    options: [
      'Returns -1 after 3 iterations',
      'Returns -1 after 6 iterations',
      'Returns 3 after 2 iterations',
      'Infinite loop'
    ],
    correctOption: 0,
    explanation: 'Array has 6 elements. Iteration 1: mid = index 2 (val 6 < 7) &rarr; low = 3. Iteration 2: mid = index 4 (val 10 > 7) &rarr; high = 3. Iteration 3: mid = index 3 (val 8 > 7) &rarr; high = 2. Now low (3) > high (2), loop terminates and returns -1 after exactly 3 comparisons.'
  },
  {
    id: 'ps-3',
    type: 'multi-select',
    section: 'Problem Solving',
    difficulty: 'Hard',
    points: 12,
    title: 'Graph Shortest Path Algorithms',
    question: 'Which of the following algorithms can compute single-source shortest paths on graphs with NON-NEGATIVE edge weights? (Select ALL that apply)',
    options: [
      "Dijkstra's Algorithm",
      'Bellman-Ford Algorithm',
      "Prim's Algorithm",
      'Breadth-First Search (BFS) on unweighted graphs',
      "Kruskal's Algorithm"
    ],
    correctOptions: [0, 1, 3], // Prim and Kruskal are Minimum Spanning Tree algorithms, not shortest path!
    explanation: "Dijkstra, Bellman-Ford, and BFS find shortest paths. Prim's and Kruskal's find Minimum Spanning Trees (MSTs), which connect all vertices with minimal total weight but do NOT guarantee shortest paths between specific pairs."
  },
  {
    id: 'ps-4',
    type: 'fill-blank',
    section: 'Problem Solving',
    difficulty: 'Easy',
    points: 10,
    title: 'Hash Table Lookup Complexity',
    question: 'What is the average Big-O time complexity for searching an item in a balanced Hash Map / Dictionary?',
    placeholder: 'e.g. O(1), O(N)...',
    acceptedAnswers: ['O(1)', '1', 'CONSTANT', 'CONSTANT TIME'],
    explanation: 'Average-case lookup, insertion, and deletion in a hash table is O(1) constant time with uniform hashing.'
  },

  // ==========================================
  // COMMUNICATION & TEAM DYNAMICS (Scenario-Judgment)
  // ==========================================
  {
    id: 'comm-1',
    type: 'scenario-judgment',
    section: 'Communication',
    difficulty: 'Medium',
    points: 10,
    title: 'Engineering vs Product Deadline Dilemma',
    scenarioContext: 'You are the lead full-stack engineer on a fintech product launch. With 48 hours until public release, you uncover an authentication race condition that could sporadically leak session tokens under high concurrent load. The Product Manager insists that skipping the fix is necessary to honor a public press embargo.',
    question: 'What is the most professionally sound and effective course of action?',
    options: [
      'Document the vulnerability with reproducible telemetry, calculate concrete business and regulatory risk, present the data to the PM with a rapid mitigated staging rollout plan, and escalate to the Security Lead if unresolved.',
      'Secretly apply an unreviewed patch directly to the production cluster without notifying the PM or running regression tests.',
      'Yield entirely to the PM because product release timelines always supersede technical engineering concerns.',
      'Publicly vent on the team Slack channel warning that management ignores basic security standards.'
    ],
    correctOption: 0,
    explanation: 'Professional engineering communication is grounded in data, calculated business impact, and proactive solutions rather than emotional confrontation or silent compliance.'
  },
  {
    id: 'comm-2',
    type: 'scenario-judgment',
    section: 'Communication',
    difficulty: 'Easy',
    points: 10,
    title: 'Constructive Pull Request Code Review',
    scenarioContext: 'A junior teammate submits a 1,200-line Pull Request containing multiple architectural anti-patterns, missing test suites, and poorly named variables.',
    question: 'How should you communicate your review to balance code quality with team mentorship?',
    options: [
      'Schedule a 15-minute pairing session to walkthrough the PR, highlight what they did well, explain the "why" behind the key refactoring suggestions, and recommend breaking it into smaller incremental PRs.',
      'Reject the PR with a one-line comment: "Unacceptable quality. Please rewrite according to our company guidelines."',
      'Approve the PR silently to avoid hurting their feelings, and secretly refactor their code in a subsequent commit yourself.',
      'Leave 40 nitpick comments highlighting every stylistic error without providing code examples or architectural rationale.'
    ],
    correctOption: 0,
    explanation: 'Effective code reviews are collaborative teaching moments. Pairing on the first review builds psychological safety, accelerates learning, and protects codebase health.'
  },

  // ==========================================
  // LEADERSHIP & ETHICS (Scenario-Judgment & Multi)
  // ==========================================
  {
    id: 'lead-1',
    type: 'scenario-judgment',
    section: 'Leadership',
    difficulty: 'Hard',
    points: 12,
    title: 'Live Production Incident Conflict',
    scenarioContext: 'During a P0 production outage impacting 100,000 active users, two senior engineers vehemently disagree in the incident bridge: Engineer A demands rolling back the latest deployment immediately, while Engineer B insists on live-patching a hotfix in 10 minutes.',
    question: 'As the incident commander or team lead, how do you decisively resolve this deadlock?',
    options: [
      'Enforce the primary incident protocol: prioritize restoring service stability first by rolling back to the known-good state, then investigate the root cause and test the hotfix safely in staging.',
      'Wait in silence until both engineers reach a unanimous philosophical agreement.',
      'Allow Engineer B to hotfix directly in production without a verified fallback plan to see if it works.',
      'Shut down all servers for 24 hours until management convenes an inquiry committee.'
    ],
    correctOption: 0,
    explanation: 'In high-severity outages, the primary objective is Time to Mitigation (TTM). Rolling back to the last known-good release reliably restores customer availability while hotfixing on live production introduces compounded risk.'
  },
  {
    id: 'lead-2',
    type: 'scenario-judgment',
    section: 'Leadership',
    difficulty: 'Medium',
    points: 10,
    title: 'Unequal Cross-Functional Sprint Workload',
    scenarioContext: 'Midway through a two-week sprint, you observe that one engineer is overwhelmed with critical path blockers while two other engineers have completed their tasks early and are idle.',
    question: 'What is the most effective leadership intervention in this agile setting?',
    options: [
      'In the next standup, transparently visualize the team sprint board, facilitate a collaborative swarming re-allocation where idle engineers pair with the blocked teammate, and adjust scope if necessary.',
      'Privately reprimand the overwhelmed engineer for falling behind schedule.',
      'Tell the idle engineers to leave early since their personal tickets are finished.',
      'Ignore the bottleneck because individual commitments should never be altered mid-sprint.'
    ],
    correctOption: 0,
    explanation: 'High-performing engineering teams operate on collective ownership ("swarming" around sprint goals) rather than siloed individual ticket throughput.'
  }
];

// Simple deterministic string hash for pseudo-random generation per user
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Pseudo-random number generator (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a customized, randomized assessment for a specific individual.
 * Guarantees a diverse mix of:
 * - Programming
 * - Data & AI
 * - Problem Solving
 * - Communication
 * - Leadership
 * Along with mixed question types (single-select, multi-select, code-analysis, fill-blank, scenario-judgment).
 */
export function generatePersonalizedAssessment(
  studentIdentifier: string,
  questionCount: number = 7
): AssessmentQuestion[] {
  const seed = hashString(studentIdentifier || 'careersync-student-' + Date.now());
  const rand = mulberry32(seed);

  // Group questions by section
  const sections: Array<AssessmentQuestion['section']> = [
    'Programming',
    'Data & AI',
    'Problem Solving',
    'Communication',
    'Leadership'
  ];

  const bySection: Record<string, AssessmentQuestion[]> = {};
  sections.forEach(s => {
    bySection[s] = QUESTION_BANK.filter(q => q.section === s);
  });

  const selected: AssessmentQuestion[] = [];

  // Pick at least 1 guaranteed question from each major domain
  sections.forEach(sec => {
    const pool = bySection[sec];
    if (pool && pool.length > 0) {
      const chosenIdx = Math.floor(rand() * pool.length);
      selected.push(pool[chosenIdx]);
    }
  });

  // Fill remainder from remaining pool
  const remainingPool = QUESTION_BANK.filter(q => !selected.some(s => s.id === q.id));
  // Shuffle remaining
  const shuffledRemaining = [...remainingPool].sort(() => rand() - 0.5);

  while (selected.length < questionCount && shuffledRemaining.length > 0) {
    selected.push(shuffledRemaining.pop()!);
  }

  // Shuffle final selected list for this individual
  const finalQuestions = selected.sort(() => rand() - 0.5);

  // Deep clone to prevent mutating original bank
  return finalQuestions.map((q, idx) => {
    const clone: AssessmentQuestion = JSON.parse(JSON.stringify(q));
    clone.id = `${q.id}-${idx + 1}`;
    return clone;
  });
}

/**
 * Evaluates the student's submission accurately and rigorously.
 */
export function evaluateAssessment(
  questions: AssessmentQuestion[],
  answers: Record<string | number, any>
): AssessmentEvaluationResult {
  let totalPointsEarned = 0;
  let totalMaxPoints = 0;

  let techPointsEarned = 0;
  let techMaxPoints = 0;

  let softPointsEarned = 0;
  let softMaxPoints = 0;

  const sectionScores: Record<string, { earned: number; max: number }> = {
    'Programming': { earned: 0, max: 0 },
    'Data & AI': { earned: 0, max: 0 },
    'Problem Solving': { earned: 0, max: 0 },
    'Communication': { earned: 0, max: 0 },
    'Leadership': { earned: 0, max: 0 }
  };

  const results: EvaluatedQuestionResult[] = questions.map((q, idx) => {
    const userAnswer = answers[idx] !== undefined ? answers[idx] : answers[q.id];
    const maxPoints = q.points || 10;
    let scoreRatio = 0;
    let userDisplay = 'Not Answered';
    let correctDisplay = '';

    const type = q.type || 'single-select';

    if (type === 'single-select' || type === 'scenario-judgment' || type === 'code-analysis') {
      const correctIdx = q.correctOption ?? 0;
      correctDisplay = q.options ? `${String.fromCharCode(65 + correctIdx)}. ${q.options[correctIdx]}` : '';

      if (typeof userAnswer === 'number' && userAnswer >= 0 && q.options && q.options[userAnswer]) {
        userDisplay = `${String.fromCharCode(65 + userAnswer)}. ${q.options[userAnswer]}`;
        if (userAnswer === correctIdx) {
          scoreRatio = 1.0;
        }
      }
    } else if (type === 'multi-select') {
      const correctIndices = (q.correctOptions || []).sort((a, b) => a - b);
      correctDisplay = correctIndices
        .map(i => `${String.fromCharCode(65 + i)}`)
        .join(', ');

      if (Array.isArray(userAnswer)) {
        const userSet = new Set<number>(userAnswer);
        const correctSet = new Set<number>(correctIndices);

        userDisplay = userAnswer.length > 0
          ? userAnswer.sort((a, b) => a - b).map(i => `${String.fromCharCode(65 + i)}`).join(', ')
          : 'None selected';

        // Count true positives and false positives
        let correctCount = 0;
        let incorrectCount = 0;

        userSet.forEach(idx => {
          if (correctSet.has(idx)) correctCount++;
          else incorrectCount++;
        });

        if (correctCount === correctIndices.length && incorrectCount === 0) {
          scoreRatio = 1.0;
        } else {
          // Partial credit formula: max(0, (correct - incorrect) / totalCorrect)
          const net = Math.max(0, correctCount - incorrectCount);
          scoreRatio = Number((net / correctIndices.length).toFixed(2));
        }
      }
    } else if (type === 'fill-blank') {
      correctDisplay = (q.acceptedAnswers && q.acceptedAnswers[0]) || 'O(N)';
      if (typeof userAnswer === 'string' && userAnswer.trim()) {
        userDisplay = userAnswer.trim();
        const cleanUser = userDisplay.toUpperCase().replace(/\s+/g, '');
        const isMatched = (q.acceptedAnswers || []).some(ans => {
          const cleanAns = ans.toUpperCase().replace(/\s+/g, '');
          return cleanUser === cleanAns;
        });
        if (isMatched) {
          scoreRatio = 1.0;
        }
      }
    }

    const pointsEarned = Number((scoreRatio * maxPoints).toFixed(1));
    totalPointsEarned += pointsEarned;
    totalMaxPoints += maxPoints;

    // Categorize into Technical vs Soft Skills
    const isTech = q.section === 'Programming' || q.section === 'Data & AI' || q.section === 'Problem Solving';
    if (isTech) {
      techPointsEarned += pointsEarned;
      techMaxPoints += maxPoints;
    } else {
      softPointsEarned += pointsEarned;
      softMaxPoints += maxPoints;
    }

    if (sectionScores[q.section]) {
      sectionScores[q.section].earned += pointsEarned;
      sectionScores[q.section].max += maxPoints;
    }

    return {
      question: q,
      userAnswer,
      isCorrect: scoreRatio >= 0.85,
      scoreRatio,
      pointsEarned,
      maxPoints,
      userDisplay,
      correctDisplay
    };
  });

  // Calculate final percentages with exact mathematical precision
  const overallScore = totalMaxPoints > 0 ? Math.round((totalPointsEarned / totalMaxPoints) * 100) : 0;
  const technicalScore = techMaxPoints > 0 ? Math.round((techPointsEarned / techMaxPoints) * 100) : overallScore;
  const softScore = softMaxPoints > 0 ? Math.round((softPointsEarned / softMaxPoints) * 100) : overallScore;

  const categoryScores: Record<string, number> = {};
  Object.keys(sectionScores).forEach(sec => {
    const item = sectionScores[sec];
    if (item.max > 0) {
      categoryScores[sec] = Math.round((item.earned / item.max) * 100);
    } else {
      const isTech = sec === 'Programming' || sec === 'Data & AI' || sec === 'Problem Solving';
      categoryScores[sec] = isTech ? technicalScore : softScore;
    }
  });

  // Accurate Readiness Tier Calibration
  let readinessTier = 'Foundational';
  let readinessLabel = 'Developing Core Competencies';
  if (overallScore >= 85) {
    readinessTier = 'Tier 1 Elite';
    readinessLabel = 'Campus Hiring Priority (Top 5% Talent)';
  } else if (overallScore >= 70) {
    readinessTier = 'Industry Ready';
    readinessLabel = 'Strong Practitioner (Interview Ready)';
  } else if (overallScore >= 50) {
    readinessTier = 'Competent';
    readinessLabel = 'Good Foundation (Refinement Recommended)';
  }

  return {
    overallScore,
    technicalScore,
    softScore,
    problemSolvingScore: categoryScores['Problem Solving'] ?? technicalScore,
    dataAiScore: categoryScores['Data & AI'] ?? technicalScore,
    readinessTier,
    readinessLabel,
    categoryScores,
    totalPointsEarned,
    totalMaxPoints,
    results
  };
}
