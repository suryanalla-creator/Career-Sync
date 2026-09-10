import { Router } from 'express';

export const aiRouter = Router();

// Check AI Engine Status
aiRouter.get('/status', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  res.json({
    status: 'ready',
    hasApiKey: Boolean(geminiKey || openaiKey),
    provider: geminiKey ? 'Gemini 2.0 / 1.5 Flash' : openaiKey ? 'OpenAI GPT-4o' : 'CareerSync Smart Context Engine'
  });
});

// AI Chat Completion
aiRouter.post('/chat', async (req, res) => {
  try {
    const { messages, userMessage, history, context, customApiKey } = req.body;
    const query = userMessage || (messages && messages[messages.length - 1]?.content) || '';

    if (!query) {
      return res.status(400).json({ error: 'Message query is required' });
    }

    const geminiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const openaiKey = (!customApiKey && process.env.OPENAI_API_KEY) || undefined;

    const studentName = context?.studentName || 'Ananya Rao';
    const roleTitle = context?.roleTitle || 'Full-Stack Software Engineer';
    const department = context?.department || 'Computer Science & Engineering';
    const college = context?.college || 'Apex Institute of Technology';
    const readinessScore = context?.readinessScore || 88;
    const skills = Array.isArray(context?.skills) ? context.skills.join(', ') : 'Python, React, TypeScript, SQL, Git, Docker, System Design';
    const systemInstructionText = `You are CareerSync AI Placement Copilot — the expert technical mentor and campus placement assistant for B.Tech Computer Science & Engineering (CSE) students on the CareerSync platform.

### STUDENT IDENTITY & CONTEXT:
- Student: ${studentName}
- Degree & Branch: B.Tech Computer Science & Engineering (CSE)
- Institution: ${college}
- Target Career Role: ${roleTitle}
- Industry Readiness Benchmark: ${readinessScore}% (Tier-1 Ready)
- Core Tech Stack: ${skills}

### CORE CAPABILITIES & HOW TO ANSWER CSE QUESTIONS:
1. **Direct, High-Quality Technical & Code Answers**:
   - Whenever the student asks about ANY programming concept, coding problem, algorithm, data structure (DSA), language syntax (Python, JavaScript/TypeScript, Java, C++, SQL), core CS subject (OS, DBMS, Computer Networks, System Design), or assessment question:
     - Provide **production-quality, clean, well-commented code snippets**.
     - Explain the underlying mechanism clearly (e.g. Memory management, Event Loop, Indexes, Pointers, Recursion, Time & Space Complexity $O(N)$).
     - Give edge cases, optimization tips, and common interviewer follow-up questions.

2. **Campus Placement & Interview Grounding**:
   - Explain how the concept/code is tested in Tier-1 campus hiring drives (e.g. **TechNova Solutions**, **Microsoft**, **Deloitte**, **Google**).
   - Relate to Online Assessment (OA) coding rounds (LeetCode patterns: Two Pointers, DP, Graphs, Binary Trees, Sliding Window) and Technical Interview rounds.

3. **CareerSync Platform Features & Action Links**:
   - Connect the topic to CareerSync tools:
     * **Skill Profile & Assessment** (\`skill-profile\`): Taking adaptive proctored tests in Coding, CS Core, and System Design.
     * **Job Opportunities & Internships** (\`jobs-internships\`): Matching job openings at TechNova, Microsoft, Deloitte.
     * **Digital Portfolio** (\`portfolio\`): Adding Git repos, capstone project proofs, and verified skill badges.
     * **Online Courses** (\`online-courses\`): Enrolling in AWS, Meta, Oracle certified tracks.
     * **Career Roadmap** (\`career-path\`): Semester-wise progression roadmap.
     * **Dashboard** (\`dashboard\`): Overall placement readiness tracking.

4. **Action Tag**:
   - End every response with an interactive action tag on its own line:
     \`[[ACTION:tab_id:Button Label]]\`
     Allowed \`tab_id\` values:
     \`skill-profile\`, \`jobs-internships\`, \`online-courses\`, \`portfolio\`, \`career-path\`, \`dashboard\`, \`applications\`, \`events\`, \`mentorship\`, \`settings\`.

5. **Off-Topic Boundary**:
   - Only decline queries that are completely unrelated to engineering, programming, CSE academics, tech careers, or CareerSync (e.g., cooking recipes, celebrity gossip, sports commentary). Always answer all CSE, code, algorithms, and career questions enthusiastically and deeply!`;

    // 1. If Gemini API Key is available
    if (geminiKey) {
      try {
        const candidateModels = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.7-flash', 'gemini-2.5-flash'];
        let replyText = '';
        let usedModel = 'gemini-3.6-flash';

        // Prepare multi-turn contents
        const contentsPayload: any[] = [];

        // Add history if present
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            contentsPayload.push({
              role: item.role === 'ai' || item.role === 'model' ? 'model' : 'user',
              parts: [{ text: item.text }]
            });
          }
        }

        // Add current user prompt
        contentsPayload.push({
          role: 'user',
          parts: [{ text: query }]
        });

        for (const model of candidateModels) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: systemInstructionText }]
                  },
                  contents: contentsPayload,
                  generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                  }
                })
              }
            );

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (replyText) {
                usedModel = model;
                break;
              }
            }
          } catch {
            // try next candidate model
          }
        }

        if (replyText) {
          // Parse any [[ACTION:tab:label]] tags
          let actionTab: string | undefined;
          let actionLabel: string | undefined;
          const actionMatch = replyText.match(/\[\[ACTION:([a-z-]+):([^\]]+)\]\]/i);

          if (actionMatch) {
            actionTab = actionMatch[1];
            actionLabel = actionMatch[2];
            replyText = replyText.replace(/\[\[ACTION:[^\]]+\]\]/g, '').trim();
          }

          return res.json({
            reply: replyText,
            provider: 'Google Gemini (Trained Placement Copilot)',
            model: usedModel,
            actionTab,
            actionLabel
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, falling back to trained context engine:', geminiErr.message);
      }
    }

    // 2. If OpenAI API Key is available
    if (openaiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstructionText },
              { role: 'user', content: query }
            ],
            temperature: 0.7,
            max_tokens: 800
          })
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const replyText = data?.choices?.[0]?.message?.content;
          if (replyText) {
            return res.json({
              reply: replyText,
              provider: 'OpenAI (Trained Copilot)',
              model: 'gpt-4o-mini'
            });
          }
        }
      } catch (openAiErr: any) {
        console.warn('OpenAI API call failed, falling back to smart context engine:', openAiErr.message);
      }
    }

    // 3. Smart Fallback Knowledge & Context Engine
    let reply = '';
    let actionTab: string | undefined;
    let actionLabel: string | undefined;

    const lower = query.toLowerCase();

    if (lower.includes('skill') || lower.includes('require') || lower.includes('learn') || lower.includes('stack')) {
      reply = `### Key Skill Blueprint for **${roleTitle}**:\n\n1. **Core Technical Stack**: Master ${skills.split(', ').slice(0, 3).join(', ')} with production-grade coding standards.\n2. **Database & Systems**: Deep dive into SQL indexing, query execution plans, and Redis caching.\n3. **Cloud & DevOps**: Build Dockerized microservices and deploy CI/CD pipelines to AWS or GCP.\n\n*Recommendation*: Take an assessment in your **Skill Profile** to benchmark your proficiency against Tier-1 recruiters.`;
      actionTab = 'skill-profile';
      actionLabel = 'View Skill Profile & Take Assessment';
    } else if (lower.includes('interview') || lower.includes('crack') || lower.includes('round') || lower.includes('prep') || lower.includes('question')) {
      reply = `### 3-Stage Campus Placement Interview Strategy:\n\n1. **Round 1 — Online Assessment (OA)**: Solve 2 DSA Medium questions (focus on Dynamic Programming, Binary Trees, and HashMaps) in under 60 minutes.\n2. **Round 2 — Technical Architecture**: Explain your capstone project using architectural diagrams, API contracts, and database schema tradeoffs.\n3. **Round 3 — Managerial & Behavioral**: Use the **STAR method** (*Situation, Task, Action, Result*) to demonstrate teamwork and problem ownership.`;
      actionTab = 'career-path';
      actionLabel = 'Open Career Roadmap';
    } else if (lower.includes('resume') || lower.includes('ats') || lower.includes('cv')) {
      reply = `### ATS Resume Optimization Checklist:\n\n• **Quantify Impacts**: Replace "worked on backend" with *"Optimized REST API latency by 35% using Redis caching and PostgreSQL index partitioning"*\n• **Keyword Match**: Include keywords matching **${roleTitle}** (*${skills}*)\n• **Verification**: Highlight verified credential IDs and on-chain badges from your Digital Portfolio for instant credibility.`;
      actionTab = 'portfolio';
      actionLabel = 'Check Digital Portfolio Credentials';
    } else if (lower.includes('cert') || lower.includes('course') || lower.includes('credential')) {
      reply = `### High-Yield Certifications for **${roleTitle}**:\n\n• **AWS Certified Cloud Practitioner** (+18% shortlisting rate)\n• **Meta Certified Professional Backend / Frontend Developer**\n• **Oracle Certified Associate SQL / Java**\n\nEnroll directly through the **Online Courses** portal to earn verified certificates verified on your institutional ledger.`;
      actionTab = 'online-courses';
      actionLabel = 'Explore Verified Online Courses';
    } else if (lower.includes('gap') || lower.includes('score') || lower.includes('readiness')) {
      reply = `Your current Industry Readiness is **${readinessScore}%** (Tier-1 Ready).\n\nTo bridge the remaining **${100 - readinessScore}% gap**:\n1. Complete 1 more full-stack cloud project with unit test coverage.\n2. Validate your data structures competency in the Skill Profile assessment.\n3. Secure 1 verified corporate internship credential.`;
      actionTab = 'skill-profile';
      actionLabel = 'Bridge Gaps in Skill Profile';
    } else if (lower.includes('company') || lower.includes('technova') || lower.includes('microsoft') || lower.includes('google') || lower.includes('deloitte')) {
      reply = `### Corporate Hiring Insights:\n\n• **TechNova Solutions**: Actively hiring ${department} 2026 graduates with strong React and Python foundation.\n• **Microsoft**: Hiring for Software Engineer FTE with emphasis on Algorithms, System Design, and Cloud.\n• **Deloitte**: Recruiting Data Analysts and Technology Consultants with SQL and problem-solving focus.`;
      actionTab = 'jobs-internships';
      actionLabel = 'View Matched Job Opportunities';
    } else {
      reply = `Hello **${studentName}**! As your CareerSync Placement Copilot for **${roleTitle}** (${department}):\n\nI can help you with:\n• **Technical & Coding Prep**: Algorithm strategies, system design blueprints, and mock test tips\n• **ATS Resume & Portfolio**: Tailoring your credentials and highlighting verified project proof\n• **Company Drives**: Direct matching with openings from TechNova, Microsoft, and partner institutions\n\nFeel free to ask any question or request a personalized study plan!`;
      actionTab = 'jobs-internships';
      actionLabel = 'Explore Placement Opportunities';
    }

    return res.json({
      reply,
      provider: 'CareerSync AI Engine',
      model: 'smart-copilot-v2',
      actionTab,
      actionLabel
    });
  } catch (err: any) {
    console.error('AI chat endpoint error:', err);
    return res.status(500).json({ error: err.message || 'AI processing failed' });
  }
});
