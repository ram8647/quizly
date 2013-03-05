// Copyright 2012 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Shared generic code for activities and assessments
// requires jQuery (>= 1.7.2)

/**
 * Callback function -- called by blockly.html after blockly has finished loading.
 * blockly.html is loaded into the iframe.
 */
function blocklyLoaded(blockly) {
  // Called once Blockly is fully loaded.
  window.Blockly = blockly;
}


function submitOneShot() {
  console.log("SubmitNewToggle");
  Blockly.hello('submitoneshot');
}

function giveHint() {
  console.log("GiveHint");
  Blockly.hello('hint');
}

function giveNewQuestion() {
  console.log("giveNewQuestion");
  Blockly.hello('showquiz');
}

/**
 * Creates an iframe on the Dom and loads it with the blockly editor.
 */
function createBlocklyFrame(domRoot, assessment) {
  iframe = document.createElement('iframe');
  iframe.setAttribute('id', 'quizmeframe');
  iframe.setAttribute('tag', 'quizmeframe');
  iframe.setAttribute('src', '/assets/js/quizme/blockly.html');
  iframe.setAttribute('width', '995');
  iframe.setAttribute('height', '515');
  domRoot.append(iframe);

  if (assessment.hasanswerbox) {
    domRoot.append('<input hidden="false" id="quiz_answer" width="40" type="text"></input>');
  } else {
    domRoot.append('<input hidden="true" id="quiz_answer" width="40" type="text"></input>');
  }

  if (assessment.checkAnswers) {
    domRoot.append('<a class="gcb-button gcb-button-primary" id="checkAnswersBtn">Check your Answers</a><p/>');
    domRoot.append('<p/><textarea style="width: 600px; height: 120px;" readonly="true" id="answerOutput"></textarea>');
    assessment['hasCheckAnswerBtn'] = true;
  }

  if (assessment.hints) {
    domRoot.append('<table><tr><td><div id="hint_html">Here is where the hint goes.</div>' + '&nbsp;&nbsp;' +
                                '<a class="gcb-button gcb-button-primary" id="hintBtn">Hint</a>' + '&nbsp;&nbsp;' + 
                                '<a class="gcb-button gcb-button-primary" id="submitAnswersBtn">Submit</a></td></tr></table>');
    assessment['hasHintsBtn'] = true;
    assessment['hasSubmitBtn'] = true;
    $('#hintBtn').click(function() {giveHint();});
  } else {
    domRoot.append('<br/><a class="gcb-button gcb-button-primary" id="submitAnswersBtn">Submit</a>'); 
    assessment['hasSubmitBtn'] = true;
  }
}

/**
 * Display a Quizme practice quiz activity.  This type of activity
 *  gives the student a focused quiz and lets them practice as
 *  much as they like.  It is not scored.

 * The quiz is loaded into an iframe from blockly.html, which calls initQuiz()
 *  using the information given in the quizme parameter.

 * @param quizme is an array defined in ./assts/js/quizme-N.M.js that
 *  contains useful data about the quiz, including its type
 */
function renderQuizmeActivity(quizme, domRoot) {
  console.log("RAM: renderQuizmeActivity");
  var quizActivity = quizme[0];
  var questionType = quizActivity.questionType;
  var quizType = quizActivity.quizType;

  var iframe = document.createElement('iframe');
  //  iframe.setAttribute('src', '/assets/js/quizme/quizme-progex.html');
  iframe.setAttribute('src', '/assets/js/quizme/blockly.html');
  iframe.setAttribute('width', '795');
  iframe.setAttribute('height', '495');

  domRoot.append('<p id="preamble">' + quizActivity.preamble + '</p>');
  domRoot.append('<p id="quiz_question">' + quizActivity.questionHTML + '</p>');

  if (quizActivity.hasanswerbox) {
    domRoot.append('<input hidden="false" id="quiz_answer" width="40" type="text"></input>');
  } else {
    domRoot.append('<input hidden="true" id="quiz_answer" width="40" type="text"></input>');
  }

  if (quizActivity.checkAnswers) {
    domRoot.append('<a class="gcb-button gcb-button-primary" id="checkAnswersBtn">Check your Answers</a><p/>');
    domRoot.append('<p/><textarea style="width: 600px; height: 120px;" readonly="true" id="answerOutput"></textarea>');
  }

  if (quizActivity.hints) {
    domRoot.append('<table><tr><td><div id="hint_html">Here is where the hint goes.</div>' + '&nbsp;&nbsp;' +
                                '<a class="gcb-button gcb-button-primary" id="hintBtn">Hint</a>' + '&nbsp;&nbsp;' + 
                                '<a class="gcb-button gcb-button-primary" id="newQuestionBtn">New Question</a>' + '&nbsp;&nbsp;' + 
                                '<a class="gcb-button gcb-button-primary" id="submitBtn">Submit</a>' + '&nbsp;&nbsp;' + 
                                '<p hidden="true" id="quiz_result">This is where the feedback goes</p></td></tr></table>');
  } else {
    domRoot.append('<table><tr><td>' +
                                '<a class="gcb-button gcb-button-primary" id="newQuestionBtn">New Question</a>' + '&nbsp;&nbsp;' + 
                                '<a class="gcb-button gcb-button-primary" id="submitBtn">Submit</a>' + '&nbsp;&nbsp;' + 
                                '<p hidden="true" id="quiz_result">This is where the feedback goes</p></td></tr></table>');
  }

  domRoot.append(iframe);
  $('#submitBtn').click(function() {checkQuizmeAnswers(quizActivity, false);});
  $('#hintBtn').click(function() {giveHint();});
  $('#newQuestionBtn').click(function() {giveNewQuestion();});

}

/**
 * Display a Quizme practice quiz activity.  This type of activity
 *  gives the student a focused quiz and lets them practice as
 *  much as they like.  It is not scored.

 * The quiz is loaded into an iframe from quizme-progex.html, which calls initQuiz()
 *  using the information given in the quizme parameter.

 * @param quizme is an array defined in ./assts/js/quizme-N.M.js that
 *  contains useful data about the quiz, including its type
 */
function renderCustomActivity(contentsLst, domRoot) {
  console.log("RAM: renderCustomActivity");
  var customActivity = contentsLst[0];
  var url = customActivity.url;
  
  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', url);
  iframe.setAttribute('width', '795');
  iframe.setAttribute('height', '495');
  domRoot.append(iframe);
}

function checkQuizmeAnswers(assessment, submitAnswers) {
  console.log("RAM: checkQuizmeAnswers");
  for (var i = 0; i < assessment.questionsList.length; i++) {
    checkQuestion(i, assessment.questionsList[i]);
  }

}

function checkQuestion(questionNum, q) {
  console.log("RAM: checkQuestion # " + questionNum);  
  var isCorrect = false;
  var scoreArray = [];
  var lessonsToRead = [];

  if (q.choices) {
    isCorrect = checkQuestionRadioSimple(document.assessment['q' + questionNum]);
  }
  else if (q.correctAnswerString) {
    var answerVal = $('#q' + questionNum).val();
    answerVal = answerVal.replace(/^\s+/,''); // trim leading spaces
    answerVal = answerVal.replace(/\s+$/,''); // trim trailing spaces

    isCorrect = (answerVal.toLowerCase() == q.correctAnswerString.toLowerCase());
  }
  else if (q.correctAnswerRegex) {
    var answerVal = $('#q' + questionNum).val();
    answerVal = answerVal.replace(/^\s+/,''); // trim leading spaces
    answerVal = answerVal.replace(/\s+$/,''); // trim trailing spaces

    // check specific words: killer whale
    isCorrect = q.correctAnswerRegex.test(answerVal);
  }
  else if (q.correctAnswerNumeric) {
    // allow for some small floating-point leeway
    var answerNum = parseFloat($('#q' + questionNum).val());
    var EPSILON = 0.001;

    if ((q.correctAnswerNumeric - EPSILON <= answerNum) &&
       (answerNum <= q.correctAnswerNumeric + EPSILON)) {
       isCorrect = true;
    }
  } 
  else if (q.correctAnswerQuizme) {
    isCorrect = evaluateAnswerAndDisplayFeedback();
  }
  else if (q.correctAnswerQuizmePractice) {
    isCorrect = evaluateAnswerAndDisplayFeedback();
    var submitBtn = document.getElementById('submitAnswersBtn');
    if (submitBtn) {
      submitBtn.innerHTML = 'New Question';
      //     return;
    }
  }

  scoreArray.push(isCorrect);

  if (!isCorrect && q.lesson) {
    lessonsToRead.push(q.lesson);
  }
}

/**
 * Evaluates the user's answer to a quiz question and displays
 *  feedback using the result_element and imgpath placed here
 *  on Blockly.Quizme.
 */
function evaluateAnswerAndDisplayFeedback() {
  console.log("RAM: evaluateAndRecordAnswer()");
  var result_element = document.getElementById('quiz_result');
  Blockly.Quizme.result_element = result_element;
  Blockly.Quizme.imgpath = './assets/js/quizme/media/';   // Quiz Builder 
  var result = Blockly.Quizme.evaluateUserAnswer(result_element);
  return result;
}
