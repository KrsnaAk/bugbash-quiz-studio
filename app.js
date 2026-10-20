const app = document.querySelector("#app");
const questions = [
  {
    q: "Which HTML element connects a label to a field?",
    a: ["div", "label", "span"],
    correct: 1,
  },
  {
    q: "Which storage survives a refresh?",
    a: ["localStorage", "a variable", "a click handler"],
    correct: 0,
  },
  {
    q: "Which makes an action accessible?",
    a: ["A clickable div", "A labelled button", "A bright colour"],
    correct: 1,
  },
];
let index = 0,
  answers = [],
  submitted = false;
function render() {
  const q = questions[index];
  if (submitted) {
    const score = answers.reduce(
      (n, a, i) => n + (a === questions[i].correct),
      0,
    );
    app.innerHTML = `<span class="label">Quiz complete</span><h2>${score}/${questions.length} correct</h2><div class="list">${questions.map((x, i) => `<article class="item"><div><strong>${x.q}</strong><span class="muted small">You chose: ${x.a[answers[i]] || "No answer"}</span></div><span class="pill">${answers[i] === x.correct ? "Correct" : "Review"}</span></article>`).join("")}</div><button id="again">Start again</button>`;
    document.querySelector("#again").onclick = () => {
      index = 0;
      answers = [];
      submitted = false;
      render();
    };
    return;
  }
  app.innerHTML = `<span class="label">Question ${index + 1} of ${questions.length}</span><h2>${q.q}</h2><div class="stack">${q.a.map((a, i) => `<button class="secondary" data-answer="${i}">${a}</button>`).join("")}</div><div class="row space"><span class="muted small">${Math.round((index / questions.length) * 100)}% complete</span><button id="next" ${answers[index] === undefined ? "disabled" : ""}>${index === questions.length - 1 ? "Finish" : "Next"}</button></div>`;
  document.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = () => {
        answers[index] = Number(b.dataset.answer);
        render();
      }),
  );
  document.querySelector("#next").onclick = () => {
    if (index === questions.length - 1) submitted = true;
    else index++;
    render();
  };
}
render();


// Added organizer feature: answer progress indicator.
function renderAnswerProgress() {
  const host = document.querySelector("#app"); if (!host || document.querySelector("#answer-progress")) return;
  const progress = document.createElement("p"); progress.id = "answer-progress"; progress.className = "muted small";
  progress.textContent = answers.filter((answer) => answer !== undefined).length + "/" + questions.length + " answered"; host.prepend(progress);
}
renderAnswerProgress();


// Quiz expansion: review notes and completion summary.
(() => {
  const baseRender = render; let notesVisible = false;
  const enhance = () => {
    if (document.querySelector("#review-tools")) return;
    const panel = document.createElement("section"); panel.id = "review-tools"; panel.className = "item";
    panel.innerHTML = '<strong>Review tools</strong><button id="toggle-notes" type="button">Show explanations</button><p id="review-summary" class="muted small"></p>';
    document.querySelector("#app")?.append(panel);
    panel.querySelector("#toggle-notes").onclick = () => { notesVisible = !notesVisible; panel.querySelector("#review-summary").textContent = notesVisible ? questions.map((question) => question.q + " — review the selected answer").join(" | ") : "Explanations hidden"; };
    panel.querySelector("#review-summary").textContent = answers.filter((answer) => answer !== undefined).length + " answer(s) recorded";
  };
  render = () => { baseRender(); enhance(); };
  enhance();
})();
