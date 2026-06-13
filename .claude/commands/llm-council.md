Run any question, idea, or decision through a council of 5 AI advisors who independently analyze it, peer-review each other anonymously, and synthesize a final verdict. Based on Karpathy's LLM Council methodology.

MANDATORY TRIGGERS: "council this", "run the council", "war room this", "pressure-test this", "stress-test this", "debate this".
STRONG TRIGGERS (use when combined with a real decision or tradeoff): "should I X or Y", "which option", "what would you do", "is this the right move", "validate this", "get multiple perspectives", "I can't decide", "I'm torn between".

Do NOT trigger on simple yes/no questions, factual lookups, or casual "should I" without a meaningful tradeoff.
DO trigger when the user presents a genuine decision with stakes, multiple options, and context that suggests they want it pressure-tested from multiple angles.

The question to council: $ARGUMENTS

---

## THE COUNCIL PROCESS

### STEP 1: FRAME THE QUESTION (with context enrichment)

Before framing, scan the workspace for context:
- Read CLAUDE.md or claude.md in the project root (business context, preferences, constraints)
- Read any memory/ folder (audience profiles, voice docs, business details, past decisions)
- Read any files the user explicitly referenced
- Look for any other files relevant to the specific question

Use this context to reframe the user's raw question as a clear, neutral prompt. Include: the core decision, key context, what's at stake. Do not add your opinion or steer it.

If the question is too vague, ask ONE clarifying question, then proceed.

---

### STEP 2: CONVENE THE COUNCIL (5 sub-agents in parallel)

Spawn all 5 advisors simultaneously as sub-agents. Each gets their identity, the framed question, and this instruction: respond independently, do not hedge, lean fully into your assigned angle (150–300 words each).

**The Contrarian** — Actively looks for what's wrong, what's missing, what will fail. Assumes the idea has a fatal flaw and tries to find it. The friend who saves you from a bad deal by asking the questions you're avoiding.

**The First Principles Thinker** — Ignores the surface-level question and asks "what are we actually trying to solve here?" Strips away assumptions. Rebuilds the problem from the ground up. Sometimes says "you're asking the wrong question entirely."

**The Expansionist** — Looks for upside everyone else is missing. What could be bigger? What adjacent opportunity is hiding? Does not care about risk. Cares about what happens if this works even better than expected.

**The Outsider** — Has zero context about the user, their field, or their history. Responds purely to what's in front of them. Catches the curse of knowledge: things obvious to the user but confusing to everyone else.

**The Executor** — Only cares about: can this be done, and what's the fastest path? Looks at every idea through the lens of "what do you do Monday morning?" If an idea has no clear first step, says so.

Sub-agent prompt template:
```
You are [Advisor Name] on an LLM Council.
Your thinking style: [advisor description]

The question brought to the council:
[framed question]

Respond from your perspective. Be direct and specific. Don't hedge or try to be balanced. Lean fully into your assigned angle. The other advisors will cover the angles you're not covering. 150–300 words. No preamble.
```

---

### STEP 3: PEER REVIEW (5 sub-agents in parallel)

Collect all 5 advisor responses. Anonymize as Response A–E (randomize the mapping to remove positional bias).

Spawn 5 reviewer sub-agents. Each sees all 5 anonymized responses and answers:
1. Which response is the strongest and why?
2. Which response has the biggest blind spot and what is it?
3. What did ALL five responses miss that the council should consider?

Reviewer prompt template:
```
You are reviewing the outputs of an LLM Council. Five advisors independently answered this question:
[framed question]

Response A: [response]
Response B: [response]
Response C: [response]
Response D: [response]
Response E: [response]

Answer these three questions. Be specific. Reference responses by letter.
1. Which response is the strongest? Why?
2. Which response has the biggest blind spot? What is it missing?
3. What did ALL five responses miss that the council should consider?

Under 200 words. Be direct.
```

---

### STEP 4: CHAIRMAN SYNTHESIS

One agent gets everything: framed question, all 5 de-anonymized advisor responses, all 5 peer reviews.

Output structure (use these exact headers):

**Where the Council Agrees** — Points multiple advisors converged on independently. High-confidence signals.

**Where the Council Clashes** — Genuine disagreements. Present both sides. Explain why reasonable advisors disagree.

**Blind Spots the Council Caught** — Things that only emerged through peer review.

**The Recommendation** — A clear, direct recommendation. Not "it depends." A real answer with reasoning. The chairman CAN disagree with the majority if the dissenter's reasoning is strongest.

**The One Thing to Do First** — A single concrete next step. Not a list. One thing.

Chairman prompt template:
```
You are the Chairman of an LLM Council. Synthesize the work of 5 advisors and their peer reviews into a final verdict.

The question: [framed question]

ADVISOR RESPONSES:
The Contrarian: [response]
The First Principles Thinker: [response]
The Expansionist: [response]
The Outsider: [response]
The Executor: [response]

PEER REVIEWS: [all 5 peer reviews]

Produce the council verdict using the exact structure: Where the Council Agrees / Where the Council Clashes / Blind Spots the Council Caught / The Recommendation / The One Thing to Do First.

Be direct. Don't hedge. Give the user clarity they couldn't get from a single perspective.
```

---

### STEP 5: GENERATE THE COUNCIL REPORT

Save a visual HTML report: `council-report-[timestamp].html`

Single self-contained HTML file with inline CSS. Contents:
- The question at the top
- Chairman's verdict prominently displayed
- Agreement/disagreement visual (grid or spectrum showing advisor positions)
- Collapsible sections for each advisor's full response (collapsed by default)
- Collapsible section for peer review highlights
- Footer with timestamp

Styling: white background, subtle borders, system font stack, soft accent colors per advisor, professional briefing document feel.

Open the HTML file after generating it.

---

### STEP 6: SAVE THE FULL TRANSCRIPT

Save: `council-transcript-[timestamp].md`

Include: original question, framed question, all 5 advisor responses, all 5 peer reviews with anonymization mapping revealed, chairman's full synthesis.

---

## IMPORTANT RULES

- Always spawn all 5 advisors in parallel. Sequential spawning wastes time and contaminates responses.
- Always anonymize for peer review. Reviewers must not know which advisor said what.
- The chairman can disagree with the majority. Best reasoning wins, not most popular position.
- Don't council trivial questions. One right answer = just answer it.
- The visual report is the primary artifact. Make it clean and scannable.
