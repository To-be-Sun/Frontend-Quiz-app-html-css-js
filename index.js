document.querySelector('.toggle input').addEventListener('change', () => {
  const body = document.querySelector("body");
  const buttons = document.querySelectorAll("button");
  const h2 = document.querySelectorAll("h2");
  h2.forEach(e => { e.classList.toggle("dark"); });
  body.classList.toggle('dark');
  buttons.forEach(btn => { btn.classList.toggle('dark'); });
});

document.addEventListener("DOMContentLoaded", () => {
  let quizData = [];
  let currentQuestionIndex = 0;
  let selectedOption = null;
  let score = 0;

  // JSONデータを取得
  fetch("starter-code/data.json")  // 🔹 修正: 正しいパスに変更
      .then(response => response.json())
      .then(data => {
          quizData = data.quizzes;
          setupCategoryButtons(quizData);
      })
      .catch(error => console.error("Error loading JSON:", error));

  function setupCategoryButtons(quizzes) {
      const buttons = document.querySelectorAll(".categories button");
      buttons.forEach(button => {
          button.addEventListener("click", () => {
              const category = button.querySelector("span").textContent;
              const selectedQuiz = quizzes.find(q => q.title === category);
              if (selectedQuiz) {
                  startQuiz(selectedQuiz);
              } else {
                  console.error(`Quiz not found for category: ${category}`);
              }
          });
      });
  }

  function startQuiz(quiz) {
      console.log("クイズ開始:", quiz.title);

      const container = document.querySelector(".container");
      container.innerHTML = `
          <div class="quiz-container">
              <h2>${quiz.title} Quiz</h2>
              <div class="progress-bar"><div id="progress"></div></div>
              <p id="question"></p>
              <div id="options"></div>
              <button id="submit" disabled>Submit Answer</button>
              <button id="next" style="display:none;">Next Question</button>
          </div>
      `;

      currentQuestionIndex = 0;
      score = 0;
      showQuestion(quiz, currentQuestionIndex);

      document.getElementById("submit").addEventListener("click", () => {
          checkAnswer(quiz);
      });

      document.getElementById("next").addEventListener("click", () => {
          currentQuestionIndex++;
          if (currentQuestionIndex < quiz.questions.length) {
              showQuestion(quiz, currentQuestionIndex);
          } else {
              showResult();
          }
      });
  }

  function escapeHTML(text) {
      return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function showQuestion(quiz, index) {
      const questionElem = document.getElementById("question");
      const optionsElem = document.getElementById("options");
      const submitButton = document.getElementById("submit");
      const nextButton = document.getElementById("next");
      const progress = document.getElementById("progress");

      // ✅ クイズの状態をリセット
      selectedOption = null;
      submitButton.style.display = "block";
      submitButton.disabled = true;
      nextButton.style.display = "none";

      const questionData = quiz.questions[index];

      // 🔹 質問と選択肢を更新
      questionElem.textContent = `Question ${index + 1} of ${quiz.questions.length}: ${questionData.question}`;
      optionsElem.innerHTML = "";

      questionData.options.forEach((option, i) => {
          const optionElem = document.createElement("div");
          optionElem.classList.add("option");
          optionElem.innerHTML = `
              <span class="option-label">${String.fromCharCode(65 + i)}</span>
              <span>${escapeHTML(option)}</span> 
          `;

          optionElem.addEventListener("click", () => {
              document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
              optionElem.classList.add("selected");
              selectedOption = option;  // 🔹 修正: すぐに選択肢をセット
              submitButton.disabled = false;
          });

          optionsElem.appendChild(optionElem);
      });

      // 🔹 プログレスバーの更新
      const progressPercentage = ((index + 1) / quiz.questions.length) * 100;
      progress.style.width = `${progressPercentage}%`;
  }

  function checkAnswer(quiz) {
      const questionData = quiz.questions[currentQuestionIndex];
      const options = document.querySelectorAll(".option");
      const submitButton = document.getElementById("submit");
      const nextButton = document.getElementById("next");

      options.forEach(option => {
          const optionText = option.querySelector("span:nth-child(2)").textContent;
          if (optionText === questionData.answer) {
              option.classList.add("correct");
          }
          if (optionText === selectedOption) {
              if (optionText === questionData.answer) {
                  option.classList.add("correct");
                  score++;
              } else {
                  option.classList.add("incorrect");
              }
          }
      });

      submitButton.style.display = "none";
      nextButton.style.display = "block";
  }

  function showResult() {
      const container = document.querySelector(".quiz-container");
      container.innerHTML = `
          <h2>Quiz Completed!</h2>
          <p>Your Score: ${score} / ${currentQuestionIndex + 1}</p>
          <button onclick="location.reload()">Try Again</button>
      `;
  }
});
