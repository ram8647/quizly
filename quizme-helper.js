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
 * @fileoverview Utility functions for managing quizzes in browser.
 * @author ram8647@gmail.com (Ralph Morelli)
 */


/**
 *  As of 2/19/2013 Quizzes are now defined as JSon objects
 *   in quizzes.json.  Here's a sample:

 "quiz_relations" : {
  "Name" : "quiz_relations", 
  "DisplayName" : "Simple Numerical Relations", 
  "ProblemType" : "math_compare",
  "Description" : "Generate simple numerical relational operations on integers.",
  "QuestionHTML" : "Evaluate the expression shown in the work area.",
  "AnswerHTML" : "",
  "AnswerType" : "boolean",
  "AnswerVisibility" : "visible",
  "ResultHTML" : "",
  "Hints" : ["This is hint #1", "This is hint #2", "This is hint #3"],
  "BuiltIns" : ["math_number", "math_compare", "math_add", "math_subtract", "math_division", "math_multiply", "math_power"],
  "Components" : [],
  "Xmlgenerator" : "function xmlGenerator(xml, low, high, op) {var ops = ['EQ', 'NEQ', 'LT', 'LTE', 'GT', 'GTE'];   if (!op) { op = ops[Math.floor(Math.random() * ops.length)]; } var n1 = Math.floor(Math.random() * 10); var n2 = Math.floor(Math.random() * 10); if (low && high) { n1 = low + Math.floor(Math.random() * (high - low + 1)); n2 = low + Math.floor(Math.random() * (high - low + 1)); } xml = xml.replace('$OP', op); xml = xml.replace('$N1', n1); xml = xml.replace('$N2', n2); return xml; }",
  "Xmltemplate" : "<xml><block type=\"math_compare\" inline=\"true\" x=\"85\" y=\"100\"><title name=\"OP\" >$OP</title><value name=\"A\"><block type=\"math_number\"><title name=\"NUM\">$N1</title></block></value><value name=\"B\"><block type=\"math_number\"><title name=\"NUM\">$N2</title></block></value></block></xml>"
 }

 *  How to implement a new quiz that is evaluated by comparing the Xml of
 *  the user's solution with the Xml of the correct solution.
 * 
 *  Xmltemplate is created by: 
 *     .. using the browser's developer console. Manually place
 *     the correct blocks in the workspace and then, in the console, use:
 *     Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace))
 *     to get the Xml code needed in the function.

 * Xmlgenerator is created by first writing the function in Javascript and
 *   then turning it into a string for the JSON file.
 *
 * Xmlsolution: 
 * To construct the Xml code used here, place the correct solution
 *  in the blocks editor and then open the Developer console and type
 *  the command:
 * 
 * Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace))
 *
 * NOTE: The limitation here is that the solution must exactly match
 *     the user's input.
 * TODO: Make this more robust.
 *
 *  Create an entry for any blocks needed for the quiz in quizme-components.js.
 *     For this task you'll need to follow the instructions in quizme-components,
 *     unless the component is already in the quizme-components dictionary.
 */

'use strict';

// Path to images used in UI
var imgpath = "./quizme/media/";
var maindocument = parent.document;
// if (document.title == "Blockly Frame" && parent.document.title.indexOf("QB") == 0)
//   maindocument = document;

Blockly.hello = function(command, quizname) {
  console.log("RAM: Blockly says " + command);
  if (command == 'submit')
    submitNewToggle();
  else if (command == 'hint') 
    giveHint();
  else if (command == 'showquiz')
    showQuiz(quizname);
  else if (command == 'submitoneshot')
    submitOneShot();
}

/**
 * Used instead of 'object instanceof Array' b/c of cross-frame issues
 * with instanceof
 * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 */
function isArray(object) {
  return object != null && typeof object === "object" &&
    'splice' in object && 'join' in object;
}

/**
 * Initialize Quizme 
 * @param quiztype, either undefined or a string giving one of the defined quiztypes
 * @param quizmepath, path to the quizme source files
 */
function initQuizme(quiztype, quizmepath) {
  console.log("RAM: initializing ... quiztype= " + quiztype + " path=" + quizmepath);

  Blockly.Quizme.loadQuizzes(quizmepath + "quizzes.json");
  Blockly.Quizme.components = Blockly.Quizme.inputFromComponentsArray();

  // Set up the quiz selector drop down
  var quizselector = maindocument.getElementById('quiz_selector');
  if (quizselector) {
    var quizzes = Blockly.Quizme.quiznames;
    var quiznames = Blockly.Quizme.quiznames_display;
    var selectHtml = "";
    for (var i = 0; i < quizzes.length; i++) {
      selectHtml += "<option value='" + quizzes[i] + "'>" + quiznames[i] + "</option>";
    }
    quizselector.innerHTML = selectHtml;
  }
     
  Blockly.Quizme.pathname = quizmepath;
  Blockly.Quizme.imgpath = quizmepath + 'quizme/media/';

  // TODO:  These initializations are for Course Builder, which sets either
  // an assessment or activity variable. It would be better to pass this
  // as a parameter, but can't see how.

  // Are we within the CourseBuilder Quizme or MobileCSP Quizme context?
  // This would be defined in a file of the form: ./assets/js/assessments-P1.js
  // Or in MobileCSP in a file of the form activity-X.html.

  // Are we within the CourseBuilder practice Quizme context?
  // This would be defined in a file of the form: ./assets/js/quizme-3.1.js

  if (!quiztype) {
    if (window.document.title == "Blockly Frame") {
      if (window.parent.activity) {
        quiztype = processCbActivity(window.parent.activity);
      } else if (window.parent.parent.activity) {
        quiztype = processCbAcivity(window.parent.parent.activity);
      } else if (window.parent.assessment) {
        quiztype = processCbAssessment(window.parent.assessment);
      } else if (window.parent.parent.assessment) {
        quiztype = processCbAssessment(window.parent.parent.activity);
      }
    }
  }

  // Initialize the structures that handles scoped variables
  Blockly.BlocklyEditor.startquizme();
  
  // Display a quiz question
  showQuiz(quiztype);
}


/**
 *  This is for an assessment activity in Course Builder,
 *  which would be defined in a file such as 
 *  <cbroot>assets/js/assessment.P1.js
 *
 * The enclosing window may or may not have a selector, hint button, etc.
 */
function processCbAssessment(assessment) {
  var quiztype;
  if (assessment) {
    quiztype = assessment['quiztype']; 
    var selector_prompt = window.parent.document.getElementById('selector_prompt');
    if (selector_prompt)
      selector_prompt.hidden = true;
    var selector = window.parent.document.getElementById('quiz_selector');
    if (selector) 
      selector.hidden = true;
    var hint_button = window.parent.document.getElementById('hint_button');
    if (hint_button) {
      if (assessment['hints'] == true) 
	hint_button.hidden = false;
      else 
	hint_button.hidden = true;
    }
  }
  return quiztype;
}

function processCbActivity(activity) {
  var quiztype;
  if (activity) {
    quiztype = activity.quizType; 

    var selector_prompt = window.parent.document.getElementById('selector_prompt');
    if (selector_prompt)
      selector_prompt.hidden = true;
    var selector = window.parent.document.getElementById('quiz_selector');
    if (selector) 
      selector.hidden = true;

    var hint_button = window.parent.document.getElementById('hint_button');
    if (hint_button) {
      if (activity[0].hints == true) 
        hint_button.hidden = false;
      else 
        hint_button.hidden = false;
    }
  }
  return quiztype;
}


/**
 * Displays a quiz question of a given type.  Quizzes are input from 
 * quizzes.json by Blockly.Quizme.add() in quizme.js.  They are stored
 * as Blockly.Quizme objects, indexed by 'quiztype'.
 * 
 * @quiztype the type of quiz question, possibly undefined, in which
 *  case a random quiztype is selected
 * 
 * TODO: This function is too long. Break it up. 
 */
function showQuiz(quiztype) {
  console.log("RAM: showQuiz " + quiztype);

  Blockly.mainWorkspace.clear();  // Do this first, before setting up built-ins and components.

  // TODO: This list should eventually be input from a data file
  //  var quiztypes = ['quiz_relations', 'quiz_arithmetic', 'quiz_relations_fillin', 'quiz_ifelse', 'quiz_increment_variable'];
  var quiztypes = Blockly.Quizme.quiznames;

  // The maindocument may or may not have a selector
  if (quiztype == undefined) {
    var quizSelector = maindocument.getElementById('quiz_selector');
    if (quizSelector) {
      quiztype = quizSelector.options[quizSelector.selectedIndex].value;
    }
  }
  // If still unefined, choose a random quiz type
  if (quiztype == undefined) {
    var n = Math.floor(Math.random() * quiztypes.length);
    quiztype = quiztypes[n];  
  }

  var keepers = [];
  var components = [];

  // By this point, quiztype is set to one of the valid types. So for
  // each type of quiz, set up the Blockly.Language before setting
  // the quizzes other properties.
  // TODO: Convert 'quiz_arithmetic' and 'quiz_relations_fillin' to 
  //   Json encoded quizzes like the others.
  // TODO: Create additional JSon properties to represent the
  //  number and types of arguments passed to xmlGenerator() below.
  //  Some take no arguments, some take numeric values within certain
  //  ranges.

  // Generate the variable mappings for this quiz (optional)
  var quiz = Blockly.Quizme[quiztype];
  if (quiz) {
    Blockly.Quizme.Dictionary = quiz.dictionary;;
    if (Blockly.Quizme.Dictionary) {
      Blockly.Quizme.VariableMappings = generateInstanceMappings(quiztype, Blockly.Quizme);
    }
  }

  keepers = Blockly.Quizme[quiztype].built_ins;
  components = Blockly.Quizme[quiztype].components;
  initializeBlocksWorkspace(quiztype, keepers, components);

  console.log("RAM: quiztype = " + quiztype);
  var button = maindocument.getElementById('submit_new_toggle');
  if (button) 
    button.innerHTML = "Submit";
  Blockly.Quizme.quizName = quiztype;
  Blockly.Quizme.question_type = Blockly.Quizme[quiztype].problem_type; 
  Blockly.Quizme.questionHTML = Blockly.Quizme[quiztype].question_html;  
  Blockly.Quizme.answerHTML = Blockly.Quizme[quiztype].answer_html;     
  Blockly.Quizme.answerType = Blockly.Quizme[quiztype].answer_type;     
  Blockly.Quizme.answerVisibility = Blockly.Quizme[quiztype].answer_visibility;
  Blockly.Quizme.resultHTML = Blockly.Quizme[quiztype].result_html;     
  Blockly.Quizme.hintCounter = 0;
  Blockly.Quizme.hints = Blockly.Quizme[quiztype].hints;   
  Blockly.Quizme.solution = Blockly.Quizme[quiztype].xmlsolution;

  // NOTE: Can eval be avoided here?
  Blockly.Quizme.xmlGenerator = eval( '(' + Blockly.Quizme[quiztype].xmlgenerator + ')');

  // Dynamically generate a random quiz

  //  console.log("RAM: function = " + Blockly.Quizme.xmlGenerator);

  var xml = Blockly.Quizme[quiztype].xml;
  if (Blockly.Quizme.xmlGenerator instanceof Function) {
    xml = Blockly.Quizme.xmlGenerator(xml, 1, 10);
    console.log("RAM: xml= " + xml);
  }

  Blockly.Quizme.xml = Blockly.Xml.textToDom(xml);    

  renderQuiz(); 

  // For boolean and numeric answer types, the solution has to be
  //  calculated after the blocks are rendered.
  if (Blockly.Quizme.answerType == 'boolean' || Blockly.Quizme.answerType == 'eval_expr') {
    var block = Blockly.mainWorkspace.topBlocks_[0];
    Blockly.Quizme.solution = "" + Blockly.Quizme.eval(block);
  }
}

/**
 * Initializes the Quizme blocks workspace, which contains two
 *  types of elements:  built-in language blocks such as math, logic,
 *  control blocks, and App Inventor components, such as 
 *  Button, Sound, etc.
 *
 * @param quiztype -- the type of quiz being presented. This is
 *  needed to initialize the Blockly.Language, which varies
 *  depending on quiztype
 * @param keepers, an array giving names of the built-in language
 *  elements to keep in the language. If the first list element is 'all',
 *  then all built-in elements are loaded.
 * @param components, an array of App Inventor components that we want
 *  to add to Blockly.Language
 */
function initializeBlocksWorkspace(quiztype, keepers, components) {
  console.log("RAM: initializeBlocksWorkspace() quiztype = " + quiztype + " keepers = " + keepers);

  // If the language has already been set for this quiz type, just exit  

  if (Blockly.Quizme.language_type == quiztype) {
    console.log("RAM: language set to " + quiztype + " ... exiting");
    return;
  }

  // We use Blockly.WholeLanguage so that we always filter from the
  // complete language. Keepers is a white list of language elements 
  // used to produce a subset of the whole language.

  Blockly.Language = Blockly.WholeLanguage;
  if (keepers[0] == 'all') {
    Blockly.Language = Blockly.WholeLanguage;
  } else {                      
    var newLanguage = {};
    for (var x = 0; x < keepers.length; x++) {
      newLanguage[keepers[x]] = Blockly.WholeLanguage[keepers[x]];
    }
    Blockly.Language = newLanguage;
    Blockly.Quizme.language_type = quiztype;
    console.log("RAM: Blockly.Quizme.language_type = " + Blockly.Quizme.language_type);

    resetBlocklyLanguage();
  }

  // Add the App Inventor components to the langauge and initialize the Toolbox  
  resetComponentInstances();
  Blockly.Quizme.addComponents(components);
  Blockly.Toolbox.init();
}

/**
 * Utility function to reload Blockly.Language functions.
 * These next three functions are needed for any App Inventor blocks.
 * Redefined here because we've redefined Blockly.Language

 * TODO:  This is a HACK that should be fixed, perhaps by
 *  writing a function to clear Blockly.Language of all
 *  its elements, preserving its functions.
 */
function resetBlocklyLanguage() {

  Blockly.Language.setTooltip = function(block, tooltip) {  
    block.setTooltip("");
  }
  Blockly.Language.YailTypeToBlocklyTypeMap = {
    'number':Number,
    'text':String,
    'boolean':Boolean,
    'list':Array,
    'component':"COMPONENT",
    'InstantInTime':Blockly.Language.InstantInTime,
    'any':null
    //add  more types here
  }

  Blockly.Language.YailTypeToBlocklyType = function(yail) {
    var bType = Blockly.Language.YailTypeToBlocklyTypeMap[yail];
    if (bType != null || yail == 'any') {
      return bType;
    } else {
      throw new Error("Unknown Yail type: " + yail + " -- YailTypeToBlocklyType");
    }
  }
}

/**
 * Utility function to reload Blockly.ComponentInstances functions because
 *  we are reinitializing Blockly.ComponentInstances for each type
 *  of quiz.
 *
 * TODO:  This is a HACK that should be fixed, perhaps by
 *  writing a function to clear Blockly.ComponentInstances of all
 *  its elements, preserving its functions.
 */
function resetComponentInstances() {
  Blockly.ComponentInstances = {};

  Blockly.ComponentInstances.addInstance = function(name, uid) {
    console.log("RAM In Blockly.ComponentInsance.addInstance " + name);
    Blockly.ComponentInstances[name] = {};
    Blockly.ComponentInstances[name].uid = uid;
    Blockly.ComponentInstances[name].blocks = [];
  }

  Blockly.ComponentInstances.haveInstance = function(name, uid) {
  return Blockly.ComponentInstances[name] != undefined
  && Blockly.ComponentInstances[name].uid == uid;
  }

  Blockly.ComponentInstances.addBlockName = function(name, blockName) {
    Blockly.ComponentInstances[name].blocks.push(blockName);
  }

}

/**
 * Displays the quiz in the browser.
 */
function renderQuiz() {
  console.log("RAM: renderQuiz()");
  Blockly.mainWorkspace.clear(); 
  var quizquestion = maindocument.getElementById('quiz_question');
  //  quizquestion.innerHTML = Blockly.Quizme.questionHTML;  
  //  quizquestion.innerHTML = Blockly.Quizme.questionHTML;  
  if (quizquestion) {
    quizquestion.innerHTML = mapQuizVariables(Blockly.Quizme.questionHTML, Blockly.Quizme.VariableMappings);  
    quizquestion.style.backgroundColor = "#f3f0000";
  }
  var visibility = Blockly.Quizme.answerVisibility;
  var quiz_answer = maindocument.getElementById('quiz_answer');
  if (quiz_answer) {
    quiz_answer.value = Blockly.Quizme.answerHTML;
    quiz_answer.style.visibility = Blockly.Quizme.answerVisibility;
    if (visibility == "visible") {
      quiz_answer.hidden = false;
    } else {
      quiz_answer.hidden = true;
    }
  }
  var quiz_result = maindocument.getElementById('quiz_result');
  if (quiz_result)
    quiz_result.innerHTML = Blockly.Quizme.resultHTML;
  var hint_html = maindocument.getElementById('hint_html');
  if (hint_html)
    hint_html.innerHTML = "";
  var xmlStr = Blockly.Xml.domToText(Blockly.Quizme.xml);
  var mappedStr = mapQuizVariables(xmlStr, Blockly.Quizme.VariableMappings);
  if (mappedStr)
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(mappedStr));
  else 
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Quizme.xml);
}

/**
 * Handles the Submit/New Question toggle button.
 */
function submitNewToggle() {
  console.log("RAM: submitNewToggle");
  var buttonLabel = maindocument.getElementById('submit_new_toggle').innerHTML;
  var result_element = maindocument.getElementById('quiz_result')
  if (buttonLabel == 'Submit') {
    Blockly.Quizme.evaluateUserAnswer();
  } else {
    showQuiz();
  }
}


/**
 * Handles a onclick for the Hint button
 * @param helperObj, either Blockly.Quizmaker or Blockly.Quizme
 */
function processHint(helperObj) {
  console.log("RAM: processHint");
  var hints = helperObj.hints;
  var count = helperObj.hintCounter;
  var hintHTML = "";
  var hint_element = maindocument.getElementById('hint_html');
  if (helperObj.hintCounter < helperObj.hints.length) {
    hintHTML = '<font color="green">' + hints[count]  + '</font>';
    ++helperObj.hintCounter;
  } else {
    hintHTML = '<font color="red">Sorry, no more hints available</font>.';
    helperObj.hintCounter = 0;
  }
  hint_element.innerHTML = hintHTML;
}

function giveHint() {
  console.log("RAM: giveHint()");
  processHint(Blockly.Quizme);
}

/**
 *  Provides feedback to the user. For true answers, the "submit" button is
 *  set to a new question.  For false answer, it depends on 'redo'.  If redo is
 *  false, the submit button is set to a new question.  If true, the user
 *  is allowed to retry the question until they get it right.
 *  @param isCorrect -- if true the user's answer was correct
 *  @param correctStr -- feedback to display if correct
 *  @param mistakeStr -- feedback to display if wrong
 *  @param redo is set to true if you want the user to keep trying
 */
Blockly.Quizme.giveFeedback = function(isCorrect, correctStr, mistakeStr, redo) {
    console.log("RAM: givefeedback() isCorrect = " + isCorrect);
    var imgpath = Blockly.Quizme.imgpath;
    var correctMsg = "<img src="  + "." + imgpath + "smiley.jpg" + " > " + correctStr;
    var errMsg = "<img src="  + "." + imgpath + "frown.jpg" + " > " + mistakeStr;
    var result_html = maindocument.getElementById('quiz_result');
    
    if (!result_html) {
      result_html = Blockly.Quizme.result_element;   // Try here!
    }
    if (isCorrect) {
      if (result_html) {
        result_html.innerHTML = correctMsg;
        result_html.hidden = false;
      } else {
        alert(correctStr);
      }
    } else {
      if (result_html) {
        result_html.innerHTML = errMsg;
        result_html.hidden = false;
      } else {
        alert(mistakeStr);
      }
      var btn = maindocument.getElementById('submit_new_toggle');
      if (redo == true) {
        if (btn) {
          btn.innerHTML = "Submit";
	}
      }
    }
}


/**
 * Evaluate the user's answer and display feedback.  The answerType is
 *  used to separate different types of evaluation algorithms.
 */
Blockly.Quizme.evaluateUserAnswer = function() {
  console.log("RAM: evaluateUserAnswer()");
  var btn = maindocument.getElementById('submit_new_toggle');
  if (btn) {
    btn.innerHTML = "New Question";
  }
  var result;
  if (Blockly.Quizme.answerType == "xml_blocks") {
    result = Blockly.Quizme.evaluateXmlBlocksAnswerType(Blockly.Quizme.solution); 
  }
  else if (Blockly.Quizme.answerType == "eval_blocks") {
    result = Blockly.Quizme.evaluateEvalBlocksAnswerType(); 
  } 
  else if (Blockly.Quizme.answerType == "func_def") {
    result = Blockly.Quizme.evaluateEvalFunctionDef(Blockly.Quizme); 
  } else {
    var solution = Blockly.Quizme.solution;
    var answer = maindocument.getElementById('quiz_answer').value.toLowerCase();
    result = solution == answer;
    Blockly.Quizme.giveFeedback(result, 
	"Your answer was <font color=\"green\">" + answer + "</font>. That is correct!",
        "Oops, your answer was <font color=\"red\">" + answer + "</font>. "  +
    	"The correct answer is <font color=\"green\">" + solution + "</font>");
  }
  return result;
}

/**
 * Evaluates users answer for answerType = eval_blocks, which means it
 *  actually evalues the blocks in the workspace and compares value with
 *  expected value.
 */
Blockly.Quizme.evaluateEvalBlocksAnswerType = function() {
  console.log("RAM: evaluateEvalBlocksAnswerType()");
  var result = Blockly.Quizme.eval_math_compare_topblock();
  Blockly.Quizme.giveFeedback(result == true, 
     "Good your expression evaluates to <font color=\"green\">" + true + "</font>. Nice!", 
     "Oops, your expression evaluates to <font color=\"red\">" + result + "</font>. "  + 
	       "Try again.",
     true);
  return result;
}

/**
 * Evaluates func_def problem. 
 * @param helperObj, either Blockly.Quizmaker or Blockly.Quizme
 *
 */
Blockly.Quizme.evaluateEvalFunctionDef = function(helperObj) {
  console.log("RAM: evaluateEvalFunctionDef() for quiz " + helperObj.quizName);

  var qname = helperObj.quizName;

  // Set up the standard and the test functions
  var testFn = Blockly.Quizme.setupFunctionDefinition(helperObj.quizName, helperObj);
  var stdFn = window.eval( '(' + helperObj[qname].function_def + ')' );

  // Test the two functions on the inputs
  var inputs = helperObj[qname].function_inputs;
  var testresult = Blockly.Quizme.testFunctionAgainstStandard(stdFn, testFn, inputs);

  Blockly.Quizme.giveFeedback(testresult[0], 
    "Correct! Your function passed all " + inputs.length + " of our test cases.  Good show!",
			      "Oops, " + testresult[1] + ". Try again!", true);
  return testresult[0];
}

/**
 *  Called when the answer_type is "func_def. This creates the function definition
 *    initializes JavaScript and then creates and saves a function definition for the blocks
 *    in the mainWorkspace.  
 * @param qname, the name of the quiz and index into the helperObj
 * @param helperObj, either Quizmaker or Quizme
 */
Blockly.Quizme.setupFunctionDefinition = function(qname, helperObj) {
  if (helperObj.function_name) {
    helperObj[qname].function_name = helperObj.function_name;
  }
  if (helperObj.function_inputs) {
    helperObj[qname].function_inputs = helperObj.function_inputs;
  }
  Blockly.JavaScript.init();
  var blocks = Blockly.mainWorkspace.topBlocks_;
  Blockly.JavaScript.blockToCode(blocks[0]);      // Creates a definition
  
  return window.eval('(' +
        Blockly.JavaScript.definitions_[helperObj[qname].function_name] + ')');
}

/**
 *  Tests the student's function input-by-input against the
 *   quiz's function definition, return true if it passes
 *   all the tests.
 * @param standard -- the correct function definitino
 * @param fn -- the student's definitino
 * @param inputs -- an array of arrays of input arguments.
 */
Blockly.Quizme.testFunctionAgainstStandard = function(standard, fn, inputs) {
  console.log("RAM: Testing fn against standard ...");
  if (!fn) {
    return [false, 'Can\'t find your function. Double check the name (spelling counts).'];
  }

  var k = 0;
  var result = true;
  var errmsg = "";
  while (k < inputs.length && result == true) {
    var input = inputs[k].split(',');
    //    if (input instanceof Array) {
    if (isArray(input)) {
      var stdcall = 'standard' + '(';
      var fncall = 'fn' + '(';
      for (var i = 0; i < input.length; i++) {
        stdcall = stdcall + input[i];
        fncall = fncall + input[i];
        if (i < input.length - 1) {
          stdcall = stdcall + ',';
          fncall = fncall + ',';
	}
      }
      stdcall = stdcall + ')';      
      fncall = fncall + ')';
      stdcall = eval(stdcall);
      fncall = eval(fncall);
    }
    var stdresult = stdcall;  //standard(inputs[k]);
    var fnresult = fncall; // fn(inputs[k]);
    console.log("input=" + inputs[k] + " std=" + stdresult + " fn=" + fnresult);
    result =  stdresult != undefined && (stdresult == fnresult);
    if (result != true) {
      errmsg = 'Your function failed on input<font color="red"> ' + inputs[k] + '</font>. The result should be <font color="red">' 
                 + stdresult + '</font>. Your result was <font color="red">' + fnresult + '</font>';
    }
    k = k + 1;
  }
return [result,errmsg];
}

/**
 * Evaluates user answer for answerType = xml_blocks, which means it
 *  compares the Xml code of the user's answer to the Xml code for the
 *  expected answer, doing an exact string match. 
 *
 * @param solution -- a string giving the expected solution. The solution
 *  can contain variables of the form '$#STR1#$' and '-91.9' or -92.9'.
 * 
 * @param mappings -- the map that assigns specific values to the variables
 *  in str. For example: {1: "85", STR1: "Y"}. In this case '85' would
 *  replace '-91.9' and 'Y' would replace '$#STR1#$'.
 */
Blockly.Quizme.evaluateXmlBlocksAnswerType = function(solution, mappings) {
  console.log("RAM: evaluateXmlBlocksAnswerType");
  var result = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
  result = Blockly.Quizme.removeXY(result);
  result = Blockly.Quizme.removeTag("xml", result);

  if (mappings) {
    solution = mapQuizVariables(solution, mappings);
  } else if (Blockly.Quizme[Blockly.Quizme.quizName].dictionary) {
    solution = mapQuizVariables(solution, Blockly.Quizme.VariableMappings);
  }
    
  solution = Blockly.Quizme.removeXY(solution);
  solution = Blockly.Quizme.removeTag("xml", solution);

  //  console.log("Result = " + result);
  //  console.log("Solution = " + solution);
  
  Blockly.Quizme.giveFeedback(result.indexOf(solution) != -1, 
     "Good your solution is correct", 
		 "Oops, your solution contains a mistake. Try again.", 
		 true);
  return result;
}

/**
 * Removes the x,y coordinate attributes and values from str.
 * @param str is a string contain attribute expressions such as x="85"
 *  and y="100".  These are removed and the resulting string returned.
 */
Blockly.Quizme.removeXY = function(str) {
  var startX = str.indexOf("x=");
  var endX = str.indexOf('"', startX+3);
  while (startX != -1) {
    str = str.substring(0, startX) + str.substring(endX+1);
    startX = str.indexOf("x=");
    endX = str.indexOf('"', startX+3);
  }
  var startY = str.indexOf("y=");
  var endY = str.indexOf('"', startY+3);
  while (startY != -1) {
    str = str.substring(0, startY) + str.substring(endY+1);
    startY = str.indexOf("y=");
    endY = str.indexOf('"', startY+3);
  }
  //  console.log("RAM, removed xy: " + str);
  return str;
}

/**
 * Removes a given tag and corresponding endtag from str
 * @param tag a string representing the tag, e.g., 'xml'
 */
Blockly.Quizme.removeTag = function(tag, str) {
  console.log("RAM: removeTag " + tag);
  var startTag = str.indexOf("<" + tag);
  var endTag = str.indexOf(">", startTag + 1 + tag.length);
  str = str.substring(0, startTag) + str.substring(endTag + 1);
  console.log (startTag + "," + endTag);

  var startEndTag = str.indexOf("</" + tag);
  var endEndTag = str.indexOf(">", startEndTag + 2 + tag.length);
  str = str.substring(0, startEndTag) + str.substring(endEndTag+1);
  //  console.log("RAM, removed xy: " + tag);
  console.log (startEndTag + "," + endEndTag);
  return str;
}

/**
 * Uses Blockly.Quizme.Dictionary to generate specific variable
 *  mappings for a quiz instance. The Dictionary contains
 *  ranges of values from which mappings are selected randomly.
 *
 * Randomly select values for each variable for this quiz
 *  instance and return the mappings.  This must be done
 *  each time a quiz instance is generated.
 * 
 * @param helperObj - either Quizmaker or Quizme
 * @param name -- the quiz's name
 * @var dict -- the dictionary created by Quizmaker with
 *  random lists of values for each variable.  For example:
 *   { 1: "-5...100", STR1: ["X", "Y", "Z"] }
 * 
 * In this case a random number between -5 and 100 would be assigned 
 *  for the variable -91.9 (-9 and .9) are the delimiters. And one
 *  of X, Y, or Z would be assigned for "$#STR1#$" where "$#" and "#$"
 *  are delimiters.
 * 
 */
function generateInstanceMappings(name, helperObj) {
  console.log("generateInstanceMappings()");
  var map = {};
  var dict = helperObj[name].dictionary;
  if (dict == "undefined") {
    //    throw "The dictionary seems to be missing for Quiz " + helperObj.quizName;
    return map;
  }
    
  var mapping = "";
  for (var key in dict) {
    var value = dict[key];
    //    if (value instanceof Array) {
    if (isArray(value)) {
      mapping = value[Math.floor(Math.random() * value.length)];   
    } else if (value.indexOf("...")) {      // Range of numbers
      var start = value.indexOf("...");
      var low = parseInt(value.substring(0,start));
      var high = parseInt(value.substring(start+3));
      mapping = "" + (low + Math.floor(Math.random() * (high - low + 1)));
    } else {
      mapping = value;
    }
    map[key] = mapping;
  }
  return map;
} 

/**
 * Uses the Blobkly.Quizme.Dictionary to lookup place holders in
 * in the question and hints and replace them with random values.
 *
 * @param str, a string containing variables that to replace
 * @param dict, the mappings of variable names to generated values
 *  for this quiz. For example:  {1: "85", STR1: "Y"}, where 1
 *  is a numerica variable embedded in "-91.9 and STR1 is a 
 *  string variable.
 * @return str, is returned with its variables mapped to values
 * 
 * Example: 
 *  str= 'Define global $#STR1#$ with initial -91.9. Press <ENTER> to set.'
 *  dict = {1: "85", STR1: "Y"}
 *  str = 'Define global Y with initial 85. Press <ENTER> to set.'
 * 
 */
function mapQuizVariables(str, dict) {
  console.log("mapQuizVariables() " + str);
  if (!dict) {
    dict = Blockly.Quizme[Blockly.Quizme.quizName].VariableMappings;
  }
  if (!dict) {
    return str;
    //    throw "Can't find variable mappings for this quiz";
  }
  
  var ndx = str.indexOf('$#');
  while (ndx != -1)  {
    var ndx2 = str.indexOf('#$', ndx+1);    
    var tag = str.substring(ndx+2, ndx2);
    var value = dict[tag];
    str = str.replace('$#' + tag + '#$', value);
    ndx = str.indexOf('$#', ndx + 1);
  }
  ndx = str.indexOf('-9');
  while (ndx != -1)  {
    var ndx2 = str.indexOf('.9', ndx+1);    
    var tag = str.substring(ndx+2, ndx2);
    var value = dict[tag];
    str = str.replace('-9' + tag + '.9', value);
    ndx = str.indexOf('-9', ndx + 1);
  }
  return str;
}


