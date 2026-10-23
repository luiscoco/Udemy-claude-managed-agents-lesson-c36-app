import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 36,
  title: "Outcomes and Rubric Graders",
  description: "Imagine an agent produces a habitat survey report and confidently says it is complete. That sentence does not establish that the report is correct, follows the instructions, or even matches the requested artifact.",
  concepts: ["Schema validation is not task correctness", "Grade actual artifact bytes", "Native verdict and host score differ"],
  scope: "Grades actual local UTF-8 artifact bytes against an independent fixture digest. It does not invoke a native outcome grader. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Accept matching artifact evidence", "input": {"artifact": "Status: reviewed", "claimedScore": 1}, "expected": "passed", "checks": {"artifactMatches": true}}, {"id": "1", "label": "Reject a confident but wrong artifact", "input": {"artifact": "Status: draft", "claimedScore": 1}, "expected": "rejected", "checks": {"artifactMatches": false}}],
  async run(input) {

const artifact=text(input,"artifact"),score=number(input,"claimedScore"),expectedHash=hash("Status: reviewed");
if(score<0||score>1)throw new Error("Score must lie between zero and one");
const artifactMatches=hash(artifact)===expectedHash;
return report(artifactMatches?"passed":"rejected","Host grading checks the artifact rather than trusting a claimed score",{artifactMatches,claimedScore:score,actualHash:hash(artifact),expectedHash,hostScore:artifactMatches?1:0,nativeOutcome:"not invoked"},["Read the actual artifact bytes","Validate score shape","Compare with the independent fixture","Keep host grading distinct from a native verdict"]);

  }
};
