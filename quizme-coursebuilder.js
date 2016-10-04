/**
 * Quiz app based on Blockly (http://code.google.com/p/blockly/), which is
 * developed by Neil Fraser (fraser@google.com).  

 * Copyright 2012 R. Morelli
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Utility functions for managing quizzes within Course Builder course
 * @author ram8647@gmail.com (Ralph Morelli)
 */

'use strict';

var DEBUG = GLOBAL_DEBUG;  // GLOBAL_DEBUG set in blockly.html;

/**
 * Handles the submit button in progex.html, a programming
 *  prablem or practice exercise.
 */
function submitProgEx() {
  if (DEBUG) console.log("RAM: submitProgEx ");
  //  var quizme = window.parent.quizme;
  var quizme = window.parent.activity;
  var button = document.getElementById('submit_new_toggle');
  if (button.innerHTML == 'New Question') {
    showQuiz(quizme[0].quizType);
  } else {
    if (quizme) {
      evaluateUserAnswer();
    } else {
      submitOneShot();
    }
  }
}

/**
 * Handles the Submit/New Question toggle button in the case of a programming
 * exercise where the student gets one shot -- a single question.
 */
function submitOneShot() {
  if (DEBUG) console.log("RAM: submitOneShot ");
  evaluateAndRecordAnswer()
  var quizframe = window.parent.document.getElementById('quizmeframe');
  quizframe.hidden = true;
  //  quizframe.remove();    // Hiding seems to be good enough
  var maindiv = window.parent.document.getElementById('assessmentContents');
  maindiv.innerHTML = 'Thank you for taking the quiz. <br>Click My Profile to see your results.';
}

/**
 * Evaluates the user's answer to a quiz question and integrates the result
 *  into Coursebuilder's assessment system.
 */
function evaluateAndRecordAnswer() {
  if (DEBUG) console.log("RAM: evaluateAndRecordAnswer()");
  var result = false;
  if (Blockly.Quizme.question_type == "math_compare_fillin") {
    result = Blockly.Quizme.eval_math_compare_topblock();
    submitAnswerToCourseBuilder(result);
  } else if (Blockly.Quizme.question_type == "variable_increment") {
    var useranswer = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
    useranswer = removeXY(useranswer);
    solution = removeXY(Blockly.Quizme.solution);
    result = useranswer.indexOf(solution) != -1;
    submitAnswerToCourseBuilder(result);
  } else if (Blockly.Quizme.question_type == "math_compare") {
    var useranswer = document.getElementById('quiz_answer').value.toLowerCase();
    solution = Blockly.Quizme.solution;
    result = solution == useranswer;
    submitAnswerToCourseBuilder(result);
  } else {
    var solution = Blockly.Quizme.solution;
    var answerbox = document.getElementById('quiz_answer');
    var answer = "";
    if (answerbox) 
       answer = answerbox.value;
    //    document.getElementById('newquiz_button').style.visibility="visible";
    var quizResultElement = document.getElementById('quiz_result');
    if (solution == answer) {
      result = true;
      if (quizResultElement)
        quizResultElement.innerHTML = 
	"<img src=\"./img/smiley.jpg\" > " +
	"Your answer was <font color=\"green\">" + answer + "</font>. That is correct!";
    } else {
      result = false;
      if (quizResultElement)
        quizResultElement.innerHTML = 
	"<img src=\"./img/frown.jpg\" > " +
	"Oops, your answer was <font color=\"red\">" + answer + "</font>. "  +
	"The correct answer is <font color=\"green\">" + solution + "</font>";
    }
    submitAnswerToCourseBuilder(result);
  }
}


/**
 *  Submits answer from a Quizme quiz to Coursebuilder.
 */
function submitAnswerToCourseBuilder(result) {
  if (DEBUG) console.log("RAM: submitAnswerToCourseBuilder result= " + result );

  //  Get the assessment object from this window's parent
  var assessment_quizme = window.parent.assessment_quizme;

  // We are currently in iframe and we want it's parent, which has Submit button
  var doc = parent.document;

  // create a new hidden form, submit it via POST, and then delete it

  var myForm = doc.createElement("form");
  myForm.method = "post";

  // defaults to 'answer', which invokes AnswerHandler in ../../controllers/lessons.py

  myForm.action = assessment_quizme.formScript ? assessment_quizme.formScript : "answer";

  var assessmentType = assessment_quizme.assessmentName ? assessment_quizme.assessmentName : "unnamed assessment";

  var myInput = null;
      
  myInput= doc.createElement("input");
  myInput.setAttribute("name", "assessment_type");
  myInput.setAttribute("value", assessmentType);
  myForm.appendChild(myInput);

  myInput=doc.createElement('input');
  myInput.setAttribute("name", "P1");
  myInput.setAttribute("value", result);
  myForm.appendChild(myInput);

  myInput = doc.createElement("input");
  myInput.setAttribute("name", "num_correct");
  if (result == true) {
    myInput.setAttribute("value", 1);
  } else {
    myInput.setAttribute("value", 1);
  }
  myForm.appendChild(myInput);

  myInput = doc.createElement("input");
  myInput.setAttribute("name", "num_questions");
  myInput.setAttribute("value", 1);
  myForm.appendChild(myInput);

  myInput = doc.createElement("input");
  myInput.setAttribute("name", "score");
  if (result == true) {
    myInput.setAttribute("value", 100);
  } else {
    myInput.setAttribute("value", 0);
  }
  myForm.appendChild(myInput);

  doc.body.appendChild(myForm);
  myForm.submit();
  if (DEBUG) console.log("RAM: submitted form , action = " + myForm.action + " method = " + myForm.method );
  doc.body.appendChild(myForm);
}



