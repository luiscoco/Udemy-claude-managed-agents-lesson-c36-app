# C36 · Outcomes and Rubric Graders

Grades actual local UTF-8 artifact bytes against an independent fixture digest. It does not invoke a native outcome grader. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Schema validation is not task correctness
- Grade actual artifact bytes
- Native verdict and host score differ

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3036`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3036
```

## How the app was build

### 1. Validate the claimed score independently

The claimed value must lie between zero and one. Valid score shape does not establish that the artifact meets the rubric.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const artifact = text(input, "artifact"),
  score = number(input, "claimedScore"),
  expectedHash = hash("Status: reviewed");

if (score < 0 || score > 1) throw new Error("Score must lie between zero and one");
```

### 2. Grade the actual artifact bytes

The host hashes the supplied artifact and compares it with the independent fixture. hostScore follows that match, even if the model claimed a different score; no native outcome grader is invoked.

Source: [src/lesson.ts](src/lesson.ts#L15) · selected statements

```typescript
const artifactMatches = hash(artifact) === expectedHash;

return report(
  artifactMatches ? "passed" : "rejected",
  "Host grading checks the artifact rather than trusting a claimed score",
  {
    artifactMatches,
    claimedScore: score,
    actualHash: hash(artifact),
    expectedHash,
    hostScore: artifactMatches ? 1 : 0,
    nativeOutcome: "not invoked",
  },
  [
    "Read the actual artifact bytes",
    "Validate score shape",
    "Compare with the independent fixture",
    "Keep host grading distinct from a native verdict",
  ],
);
```

### Check your understanding

Run **Accept matching artifact evidence** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "artifact": "Status: reviewed",
    "claimedScore": 1
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "artifactMatches": true
  }
}
```

Then try **Reject a confident but wrong artifact**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
