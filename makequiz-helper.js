/**
 * Quiz Maker app based on Blockly (http://code.google.com/p/blockly/), which is
 * developed by Neil Fraser (fraser@google.com).  

 * Copyright 2013 R. Morelli
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
 * @fileoverview Utility functions for creating quizzes in browser.
 * @author ram8647@gmail.com (Ralph Morelli)
 */


/**
 *  As of 2/19/2013 Quizzes are now defined as JSon objects
 *   in quizzes.json.  This is an example of a func_def type of problem.
 *   where the user is asked to define a function.  The specification 
 *   contains enough information to evaluate the user's function on 
 *   a set of test data, comparing it to FunctionDef.

"quiz_hypotenuse" :{
"Name":"quiz_hypotenuse",
"DisplayName":"Hypotenuse",
"Decription":"Function Definition.",
"QuestionHTML":"Define a function named 'hypotenuse' that calculates the length of the hypotenuse of a right triangle given the lengths of its other two sides.",
"AnswerHTML":"",
"AnswerType":"func_def",
"AnswerVisibility":"visible",
"ResultHTML":"",
"Hints":["Hint #1.","Hint #2.","Hint #3."],
"BuiltIns":["math_add","math_compare","math_divide","math_division","math_number","math_multiply","math_power","math_subtract","math_single","lexical_variable_get","lexical_variable_set","global_declaration","procedures_callnoreturn","procedures_callreturn","procedures_defnoreturn","procedures_defreturn","procedures_mutatorarg","procedures_mutatorcontainer","removeProcedureValues","getProcedureNames"],"
Components":[],
"VariableMappings":{},
"FunctionName":"hypotenuse",
"FunctionDef":"function hypotenuse(a, b) {\n  return Math.sqrt(a * a + b * b);\n}",
"FunctionInputs":["3,4"," 5,12"," 6,7"],
"XmlDictionary":"undefined",
"Xmlgenerator":"undefined",
"Xmltemplate":"<xml></xml>",
"Xmlsolution":"<xml><block type=\"procedures_defreturn\" inline=\"false\" x=\"117\" y=\"49\"><mutation><arg name=\"a\"></arg><arg name=\"b\"></arg></mutation><title name=\"NAME\">hypotenuse</title><value name=\"RETURN\"><block type=\"math_single\" inline=\"false\"><title name=\"OP\">ROOT</title><value name=\"NUM\"><block type=\"math_add\" inline=\"true\"><mutation items=\"2\"></mutation><value name=\"NUM0\"><block type=\"math_multiply\" inline=\"true\"><mutation items=\"2\"></mutation><value name=\"NUM0\"><block type=\"lexical_variable_get\"><title name=\"VAR\">a</title></block></value><value name=\"NUM1\"><block type=\"lexical_variable_get\"><title name=\"VAR\">a</title></block></value></block></value><value name=\"NUM1\"><block type=\"math_multiply\" inline=\"true\"><mutation items=\"2\"></mutation><value name=\"NUM0\"><block type=\"lexical_variable_get\"><title name=\"VAR\">b</title></block></value><value name=\"NUM1\"><block type=\"lexical_variable_get\"><title name=\"VAR\">b</title></block></value></block></value></block></value></block></value></block></xml>"},

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
 * Xmlsolution: place the correct solution in the blocks editor and then 
 *   open the Developer console and type the command:
 *     Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace))
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

// Some constants
var INIT = "INIT";   // Editor states
var PROB = "PROB";
var SOLU = "SOLU";
var PREV = "PREV";
var JGEN = "JGEN";
var STRVAR_DELIMITER_LEFT = '$#';   // Delimiters for variables 
var STRVAR_DELIMITER_RIGHT = '#$';
var NUMVAR_DELIMITER_LEFT = '-9';
var NUMVAR_DELIMITER_RIGHT = '.9';

var MAINDOCUMENT = parent.document;  // Document that holds Blockly iFrame

// QUIZ TYPES
var EVAL_EXPR = 'eval_expr';
var EVAL_EXPR_FILLIN = 'eval_expr_fillin';
var EVAL_STMT = 'eval_stmt';
var FUNC_DEF = 'func_def';
var PROC_DEF = 'proc_def';
var XML_BLOCKS = 'xml_blocks';

// HTML element names
var HINT_HTML = 'hint_html';
var HINT_BTN = 'hint_button';
var TOGGLE_BTN = 'submit_new_toggle';
var EXPR_TYPE = 'expression_type';
var EXPR_ARITH = 'arithmetic';
var EXPR_REL = 'relation';
var EXPR_FILLIN_REL = 'relation_fillin';
var DISPLAY_NAME = 'display_name';
var DESC = 'description';
var QUES_HTML = 'question_html';
var ANSWER_TYPE = 'answer_type';
var HINT1 = 'hint_1';
var HINT2 = 'hint_2';
var HINT3 = 'hint_3';
var BUILT_INS = 'built_ins';
var COMPONENTS = 'components';
var QUIZ_ANSWER = 'quiz_answer';
var QUIZ_NAME = 'quiz_name';
var QUIZ_RESULT = 'quiz_result';
var QUIZ_QUES = 'quiz_question';
var INSTR = 'instructions';

// XmlGenerators
var RELATION_GENERATOR = "function xmlGenerator(xml, low, high, op) {var ops = ['EQ', 'NEQ', 'LT', 'LTE', 'GT', 'GTE'];   if (!op) { op = ops[Math.floor(Math.random() * ops.length)]; } var n1 = Math.floor(Math.random() * 10); var n2 = Math.floor(Math.random() * 10); if (low && high) { n1 = low + Math.floor(Math.random() * (high - low + 1)); n2 = low + Math.floor(Math.random() * (high - low + 1)); } xml = xml.replace('$OP', op); xml = xml.replace('$N1', n1); xml = xml.replace('$N2', n2); return xml; }";

var RELATION_TEMPLATE = "<xml><block type=\"math_compare\"><title name=\"OP\" >$OP</title><value name=\"A\"><block type=\"math_number\"><title name=\"NUM\">$N1</title></block></value><value name=\"B\"><block type=\"math_number\"><title name=\"NUM\">$N2</title></block></value></block></xml>";

var RELATION_FILLIN_TEMPLATE = "<xml><block type=\"math_compare\"><title name=\"OP\">$OP</title><value name=\"A\"><block type=\"math_number\"><title name=\"NUM\">$N1</title></block></value></block><block type=\"math_number\" x=\"85\" y=\"55\"><title name=\"NUM\">$N2</title></block></xml>";

var ARITHMETIC_GENERATOR = "function xmlGenerator(xml,low, high, op){var ops = ['ADD', 'MINUS', 'MULTIPLY', 'DIVIDE', 'POWER'];var name1=''; var name2=''; var type = '';if (!op){op = ops[Math.floor(Math.random() * ops.length)];if (op == 'ADD'){name1='NUM0'; name2='NUM1'; type = 'math_add';}else if (op == 'MINUS'){name1='A';name2='B';type = 'math_subtract';} else if (op == 'MULTIPLY'){name1='NUM0';name2='NUM1';type = 'math_multiply'; } else if (op == 'DIVIDE') {name1='A';name2='B';type = 'math_division';} else {type = 'math_power';name1='A';name2='B';}}var n1 = Math.floor(Math.random() * 10);var n2 = Math.floor(Math.random() * 10);if (low && high) {n1 = low + Math.floor(Math.random() * (high - low + 1));n2 = low + Math.floor(Math.random() * (high - low + 1));}if (op == 'DIVIDE' && n2 == 0) {n2 = 1;}if (op == 'DIVIDE') {var factor = Math.floor(Math.random() * 5);n1 = n2 * factor;}if (op == 'POWER' && n2 > 3) {n2 = 3;}xml = xml.replace('$type', type);xml = xml.replace('$arg1', n1);xml = xml.replace('$arg2', n2);xml=xml.replace('$name1',name1);xml=xml.replace('$name2',name2);return xml; }";

var ARITHMETIC_TEMPLATE = '<xml><block type=\"$type\" inline=\"true\" x=\"85\" y=\"100\"><value name=\"$name1\"><block type=\"math_number\"><title name=\"NUM\">$arg1</title></block></value><value name=\"$name2\"><block type=\"math_number\"><title name=\"NUM\">$arg2</title></block></value></block></xml>';

var HELP_STR = "The normal workflow is as follows<br><br>" + 
           "* Select the type of quiz.<br>" +
           "* Fill in the name of the quiz and a brief description.<br>" +
           "* Compose the quiz question and hints<br>&nbsp &nbsp &nbsp &nbsp &nbsp-- these can be HTML.<br>" +
           "* Select the built-in and component blocks<br>&nbsp &nbsp &nbsp &nbsp &nbsp -- i.e., those needed to solve the problem .<br>" +
           "* Click on 'Setup problem space'<br>&nbsp &nbsp &nbsp &nbsp &nbsp -- with blocks the student should start with.<br>" +
           "* Click on 'Set up solution workspace'<br>&nbsp &nbsp &nbsp &nbsp &nbsp -- construct your solution to the problem.<br>" +
           "* Click on 'Preview the Quiz'<br>&nbsp &nbsp &nbsp &nbsp &nbsp -- to try the quiz yourself.<br>" +
           "* Click on 'Generate JSON'<br>&nbsp &nbsp &nbsp &nbsp &nbsp -- to save the Quiz as a JSON string.<br><br>" +
  "You can go back-and-forth between these various steps until you're happy with the quiz.<br><br>" +
  "The JSON string can be pasted into 'quizzes.json' and loaded into Quizly.";

// Path to images used in UI
var imgpath = "";
var quizmakerpath = "";

/**
 * Interface with makequiz.html.  This function
 *  executes commands that come from the UI.
 * @param command -- the UI command
 * @param param -- a parameter, usually a str
 */ 
Blockly.doIt = function(command, param) {
  console.log("RAM: Blockly says " + command);
  if (command == 'init') {
    initQuizMaker(param);
  } 
  else if (command == 'createorupdate') {
    createOrUpdateQuizObject(param);
  }
  else if (command == 'setupproblem') {
    createOrUpdateQuizObject(param);
    setupProblemBlocks();
  }
  else if (command == 'setupsolution') {
    createOrUpdateQuizObject(param);
    setupSolutionBlocks();
  }
  else if (command == 'preview') {
    createOrUpdateQuizObject(param);
    previewTheQuiz();
  }
  else if (command == 'json') {
    createOrUpdateQuizObject(param);
    generateJSON();
  }
  else if (command == 'hint')
    giveTestHint();
  else if (command == 'submit') {
    handleToggleButton(param);
  }
  else if (command == 'type') {
    onAnswerTypeSelected(param);
    createOrUpdateQuizObject(0);
  }
  else if (command == 'expression') {
    onExpressionTypeSelected(param);
  }
  else if (command == 'variables') {
    createQuizDictionary(param);  // param is Question html
    createOrUpdateQuizObject(0);
  } else if (command == 'help') {
    displayHelp();
    //alert(HELP_STR);
  }
}

function displayHelp(){
	console.log("RAM: Display help");
	MAINDOCUMENT.getElementById("help_div").innerHTML = HELP_STR;
}

/**
 * Initialize Quizmaker
 * @param path, path to the quizmaker source files
 */
function initQuizMaker(path) {
  console.log("RAM: initializing ... path=" + path);

  // App Inventor's Drawer needs to point to Quizly's Toolbox.
  Blockly.Drawer = Blockly.Toolbox;
  Blockly.Toolbox.hide = function() {}   // To cover calls to Drawer.hide()

  Blockly.Quizmaker = {};
  setState(INIT);

  Blockly.Quizmaker.problemWorkspace = undefined;
  Blockly.Quizmaker.solutionWorkspace = undefined;
  Blockly.Quizmaker.solutionBlocks = undefined;
  Blockly.Quizmaker.JsonObj = undefined;

  // We share certain data with Quizme, which presents a quiz
  Blockly.Quizme.components = Blockly.Quizme.inputFromComponentsArray();
  Blockly.Quizme.pathname = path;
  Blockly.Quizme.imgpath = path + 'quizme/media/';

  // Initialize the structures that handles scoped variables
  Blockly.BlocklyEditor.startquizme();
  initQuizmeLanguage();
  Blockly.languageTree = initToolboxLanguageTree(Blockly.Language);
  Blockly.Toolbox.init();
}


/**
 * Displays the quiz in the browser and allows user to test the quiz.
 *
 */
function previewTheQuiz() {
  console.log("RAM: previewTheQuiz()");
  if ( !isAnswerTypeSelected() ) {
    alert("You must first select a quiz type under the 'Quiz info' tab ... ignoring.");
    window.parent.setupInfo();
    return;
  }

  if ( isInState(INIT)  && getAnswerType() != EVAL_EXPR ) {
    alert("The quiz has not been properly set up...ignoring");
    return;
  }

  // Save the workspace, depending on where the preview was entered
  if ( isInState(PROB) ) {
    saveProblemWorkspace();
  } else if ( isInState(SOLU) ) {
    saveSolutionWorkspace();
    if ( getAnswerType() == EVAL_STMT) {
      createProcedureDef();          // Function def is used in EVAL_STMT, including with variables
    }
  }

  var qname = Blockly.Quizmaker.quiz.quizName;
  var builtins = Blockly.Quizmaker.quiz.built_ins;
  var components = Blockly.Quizmaker.quiz.components;

  // Generate the random values for variables for this Quiz instance
  Blockly.Quizmaker.quiz.VariableMappings = generateInstanceMappings(qname, Blockly.Quizmaker);

  // Set up the MAINDOCUMENT for previewing the quiz
  setView(PREV); 

  customizeQuizmeLanguage(undefined, builtins, components); // undefined forces initialization

  // If this is a func_def problem, construct a function definition from the solutionWorkspace.

  if ( getAnswerType() == FUNC_DEF) {
    createFunctionDef();   
  }
  
  if ( getAnswerType() == PROC_DEF) {
  	 createProcedureDef();
  }

  // Set up the workspace
  setupPreviewWorkspace( getAnswerType() );
}

/**
 * Clears the workspace and installs the blocks that make up the problemWorkspace
 */
function setupPreviewWorkspace(answer_type) {
  Blockly.mainWorkspace.clear(); 
  setState(PREV);
  var qname = Blockly.Quizmaker.quizName;
  if (answer_type == EVAL_EXPR) {
    populateWorkspaceWithExpressionBlock(Blockly.Quizmaker.quiz.expr_type);
    Blockly.Quizmaker.solution = evalMainWorkspace();
  } else {
    var probSpace = mapQuizVariables(Blockly.Quizmaker, getProblemWorkspace(), getVariableMappings() );
    if (probSpace)
      setMainWorkspaceFromText(probSpace);
  }
}

/**
 * The onclick function for the 'hint' button
 */
function giveTestHint() {
  var hint = MAINDOCUMENT.getElementById(HINT_HTML);
  processHint(Blockly.Quizmaker);
}

/**
 *  The onclick function for the 'generate' button. Currently
 *  the JSON is displayed as a string in a pop-up alert. It
 *  must be copy and pasted to the quizzes.json file.
 *
 *  This should always regenerate the JSon object from scratch, 
 *  regardless of whether it has already been generated.
 */
function generateJSON() {
  console.log("RAM: generateJSON()");

  if ( !isAnswerTypeSelected() ) {
    alert("You must first select a quiz type under the 'Quiz info' tab ... ignoring.");
    window.parent.setupInfo();
    return;
  }

  var jsonObj = generateQuizJsonObj(Blockly.Quizmaker);
  if (!jsonObj)
    return;
  setState(JGEN);
  Blockly.Quizmaker.JsonObj = jsonObj;
  var str = JSON.stringify(jsonObj);
  //  alert("Copy and paste the following JSON string into the quizzes file:\n\n" + "\"" + jsonObj.Name + "\" :" + str)
  parent.alert("\"" + jsonObj.Name + "\" :" + str)

}

/**
 * Generate the JSON object that is used to present and evaluate the  Quiz.  
 *
 * @param quizHelper, an object storing the quiz data
 */
function generateQuizJsonObj(quizHelper) {
  if (!quizHelper.quizName)  {
    alert("No quiz data yet...ignoring.");
    return;
  }
  var obj = new Object();
  var name = quizHelper.quizName;
  obj.Name = name;
  obj.DisplayName = quizHelper[name].display_name;
  obj.ProblemType = quizHelper[name].problem_type;
  obj.Decription = quizHelper[name].description;
  obj.QuestionHTML = quizHelper[name].question_html;
  obj.AnswerHTML = "";
  obj.AnswerType = quizHelper[name].answer_type;

  // There are two types of EVAL_EXPR, one of which requires that the expression be completed
  if (obj.AnswerType == EVAL_EXPR && quizHelper[name].expr_type == EXPR_FILLIN_REL) {  
    obj.AnswerType = EVAL_EXPR_FILLIN;
  }
  obj.AnswerVisibility = quizHelper[name].visibility;
  obj.ResultHTML = "";
  obj.Hints = quizHelper[name].hints;
  obj.BuiltIns = quizHelper[name].built_ins;
  obj.Components = quizHelper[name].components;
  obj.VariableMappings = quizHelper[name].VariableMappings;
  obj.FunctionName = (quizHelper[name].function_name) ? quizHelper[name].function_name : "";
  obj.FunctionDef = (quizHelper[name].function_def) ? "" + quizHelper[name].function_def : "undefined";
  obj.FunctionInputs = (quizHelper[name].function_inputs) ? quizHelper[name].function_inputs : "undefined";
  obj.XmlDictionary = (quizHelper[name].dictionary) ?  quizHelper[name].dictionary : "undefined"; 
  obj.Xmlgenerator = (quizHelper[name].Xmlgenerator) ? "" + quizHelper[name].Xmlgenerator : "undefined";
  obj.Xmltemplate = (quizHelper[name].Xmltemplate) ? quizHelper[name].Xmltemplate : quizHelper.problemWorkspace;
  if (!obj.Xmltemplate) 
    obj.Xmltemplate = "<xml></xml>";  // Case where problem space has been skipped
  obj.Xmlsolution = (quizHelper[name].Xmltemplate) ? "" : quizHelper[name].solutionWorkspace;
  return obj;
}

/**
 * Utility function for adding the names of blocks that should populate the
 *  various drawers, given a list of type (drawer) names.
 * @param typenames, an array of "math", "list", etc.
 *
 * NOTE: MATH_BLOCKS and other blocks lists are defined in quizme-helper.js. 
 */
function addBuiltIns (typenames) {
  console.log("addBuiltIns()");
  var list = [];
  var type = "";
  for (var i = 0; i < typenames.length; i++) {
    type = typenames[i];
    var types ;
    if (type == "math") {
      types = MATH_BLOCKS;
    } else if (type == "logic") {
      types = LOGIC_BLOCKS;
    } else if (type == "variables") {
      types = VARIABLES_BLOCKS;
    } else if (type == "procedures") {
      types = PROCEDURES_BLOCKS;
    } else if (type == "controls") {
      types = CONTROLS_BLOCKS;
    } else if (type == "lists") {
      types = LISTS_BLOCKS;
    } else if (type == "text") {
      types = TEXT_BLOCKS;
    } else if (type == "colors") {
      types = COLOR_BLOCKS;
    }
    for (var k = 0; k < types.length; k++) {
      list.push(types[k]);   
    }
  }
  types = TOPLEVEL_BLOCKS;
  for (var k = 0; k < types.length; k++) {
    list.push(types[k]); 
  }
  return list;
}

//// Button onclick Handlers ///////////

/**
 *  Pull into the workspace the blocks that you want the user to see
 *   when the problem is presented.  
 */
function setupProblemBlocks() {
  console.log("SetupProblemBlocks");

  if ( !isAnswerTypeSelected() ) {
    alert("You must first select a quiz type under the 'Quiz info' tab ... ignoring.");
    window.parent.setupInfo();
    return;
  }

  if ( isInState(SOLU) ) {
    saveSolutionWorkspace(); // If coming from SOLU
  }
  setState(PROB);

  Blockly.mainWorkspace.clear(); 
  if ( getProblemWorkspace() ) {
    setMainWorkspaceFromText( getProblemWorkspace() ); // Restore problem ws
  }

  setView( PROB, getAnswerType() );
}

/**
 *  Setup up the workspace with the solution to the problem.
 */
function setupSolutionBlocks() {
  console.log("setupSolutionBlocks()");

  if ( !isAnswerTypeSelected() ) {
    alert("You must first select a quiz type under the 'Quiz info' tab ... ignoring.");
    window.parent.setupInfo();
    return;
  }

  var quiz_type = getQuizType();
  if ( !quiz_type)
    return;
  if ( quiz_type == EVAL_EXPR) 
     return;

  if ( isInState(PROB) ) 
    saveProblemWorkspace();
  setState(SOLU);

  if ( getSolutionWorkspace() ) {
    Blockly.mainWorkspace.clear(); 
    setMainWorkspaceFromText( getSolutionWorkspace() ); // Restore SOLU
  }

  setView( SOLU );
}

/**
 * Handles the keypress in the problem question_html INPUT.
 *  Creates Blockly.Quizmaker.Dictionary, which takes the
 *  form { str1:[a.b.c], num1:"-5...10", ... }.  The
 *  tag value pairs for string (str) and integer (num)
 *  variables are used to replace the variables in the quiz's
 *  statement and hints.
 * @param, the question_html text input.
 * 
 */
function createQuizDictionary(textObj) {
  var str;
  if (typeof(textObj) == "string") {
    str = textObj;
  } else {
    str = textObj.value;
  }
  console.log("createQuizDictionary str = " + str);
  Blockly.Quizmaker.Dictionary = {};
  var ndx = str.indexOf( STRVAR_DELIMITER_LEFT );
  while (ndx != -1)  {
    var ndx2 = str.indexOf( STRVAR_DELIMITER_RIGHT, ndx+1 );    
    var tag = str.substring(ndx+2, ndx2);
    var value = "";
    if (tag.indexOf("STR") != -1) {
      value = prompt("For the STR variable " + tag + " input a comma-separated list of strings -- no spaces or quotes.");
      Blockly.Quizmaker.Dictionary[tag] = value.split(',');
    }
    ndx = str.indexOf( STRVAR_DELIMITER_LEFT, ndx + 1);
  }

  ndx = str.indexOf( NUMVAR_DELIMITER_LEFT );
  while (ndx != -1)  {
    var ndx2 = str.indexOf( NUMVAR_DELIMITER_RIGHT, ndx+1);    
    var tag = str.substring(ndx+2, ndx2);
    var value = "";
    if (isNaN(parseInt(tag)) != true) {
      value = prompt("For the numeric variable " + tag + " input a range of whole numbers, e.g., 1...5");
      Blockly.Quizmaker.Dictionary[tag] = value;
    }
    ndx = str.indexOf( NUMVAR_DELIMITER_LEFT, ndx + 1);
  }

  console.log("Dictionary " + Blockly.Quizmaker.Dictionary);
}

function testGiveHint() {
  console.log("RAM: testGiveHint()");
  processHint(Blockly.Quizmaker);
}

/**
 * Handles the Submit/New Question toggle button.
 */
function handleToggleButton(param) {
  console.log("RAM: handleToggleButton()");
  MAINDOCUMENT.getElementById(QUIZ_RESULT).style.visibility="visible";

  var buttonLabel = MAINDOCUMENT.getElementById(TOGGLE_BTN).innerHTML;
  if (buttonLabel == 'Submit') {
    MAINDOCUMENT.getElementById(QUIZ_RESULT).style.visibility = "visible";
    evaluateQuizResult();
  } else {
    createOrUpdateQuizObject(param);
    previewTheQuiz(true);  // true means this is a redo
    MAINDOCUMENT.getElementById(QUIZ_RESULT).style.visibility = "hidden";
    MAINDOCUMENT.getElementById(TOGGLE_BTN).innerHTML = 'Submit';
  }
}

/** 
 * Handles the select-answer-type event in the HTML. 
 */
function onAnswerTypeSelected(selectObj) {
  console.log("onAnswerTypeSelected,  index = " + selectObj.selectedIndex);
  var idx = selectObj.selectedIndex;
  var quiz_type = selectObj.options[idx].value;
  var expr_ndx = MAINDOCUMENT.getElementById(EXPR_TYPE).selectedIndex;
  var expr_type = MAINDOCUMENT.getElementById(EXPR_TYPE).options[expr_ndx].value;

  Blockly.Quizmaker.quizType = quiz_type;

  if (quiz_type == EVAL_EXPR) {
    MAINDOCUMENT.getElementById(EXPR_TYPE).style.visibility="visible";
    MAINDOCUMENT.getElementById(QUES_HTML).value = "Evaluate the expression shown in the workspace and type your answer into the textbox.";
  } else if (quiz_type == EVAL_STMT) {
    MAINDOCUMENT.getElementById(EXPR_TYPE).style.visibility="hidden";
  } else if (quiz_type == FUNC_DEF) {
    MAINDOCUMENT.getElementById(EXPR_TYPE).style.visibility="hidden";
    var fn_name = prompt("Function name (must be legal JavaScript function name)?");
    while (!fn_name) {
      fn_name = prompt("A function name is required for this type of problem.");
    }
    Blockly.Quizmaker.function_name = fn_name;
    var inputs = prompt("Input a semicolon-separated list of test cases where each case is a comma-separated list of input arguments -- e.g., 3,4; 4,5; 5,6");
    if (inputs) {
      Blockly.Quizmaker.function_inputs = inputs.split(';');
    } else {
      Blockly.Quizmaker.function_inputs = [];
    }
    var cbox_option = MAINDOCUMENT.getElementsByName(BUILT_INS)[6];
    if (cbox_option.value == "procedures") {
      cbox_option.checked = true;
    }
  } else if (quiz_type == PROC_DEF) {
    MAINDOCUMENT.getElementById(EXPR_TYPE).style.visibility="hidden";
    var p_name = prompt("Procedure signature, including typed parameter list  -- e.g., procName() or procName(num, str, list)?");
    while (!p_name) {
      p_name = prompt("A procedure signature is required for this type of problem.");
    }
    Blockly.Quizmaker.function_name = p_name;
    var cbox_option = MAINDOCUMENT.getElementsByName(BUILT_INS)[6];
    if (cbox_option.value == "procedures") {
      cbox_option.checked = true;
    }
  }
}


function onExpressionTypeSelected(selectObj) {
  console.log("onExpressionTypeSelected,  index = " + selectObj.selectedIndex);
  if (selectObj.selectedOptions[0].value == EXPR_FILLIN_REL) {
    MAINDOCUMENT.getElementById(EXPR_TYPE).style.visibility="visible";
    MAINDOCUMENT.getElementById(QUES_HTML).value = "Complete the expression in any way you wish so that the resulting expression is true.";
    MAINDOCUMENT.getElementById(QUIZ_ANSWER).style.visibility="hidden";
  }
}


/**
 * Creates a new Quiz object on Blockly.Quizmaker or updates the
 *  existing one.
 */
function createOrUpdateQuizObject(hint_counter) {
  console.log("createOrUpdateQuizObject()");
  
  var display_name = MAINDOCUMENT.getElementById(DISPLAY_NAME).value;
  var qname = "quiz_" + display_name.toLowerCase().replace(/ /g,'_');
  var expr_ndx = MAINDOCUMENT.getElementById(EXPR_TYPE).selectedIndex;
  var expr_type = MAINDOCUMENT.getElementById(EXPR_TYPE).options[expr_ndx].value;

  var quizObj;
  if (Blockly.Quizmaker.quiz) {           
    quizObj = Blockly.Quizmaker.quiz;
    var current_name = quizObj.quizName;  
    if (current_name != qname) {               // User changed quiz name
      delete(Blockly.Quizmaker[current_name]);
    }
  }
  else  {
    quizObj = {}
    Blockly.Quizmaker.quiz = quizObj;
  }

  quizObj.quizName = qname;
  quizObj.name = qname;
  quizObj.display_name = display_name;

  // Update data from document -- These may have been changed by user
  quizObj.description = MAINDOCUMENT.getElementById(DESC).value;
  quizObj.question_html = MAINDOCUMENT.getElementById(QUES_HTML).value;
  quizObj.answer_type = MAINDOCUMENT.getElementById(ANSWER_TYPE).value;
  quizObj.expr_type = expr_type;
  var expr_ndx = MAINDOCUMENT.getElementById(EXPR_TYPE).selectedIndex;
  quizObj.expr_type = MAINDOCUMENT.getElementById(EXPR_TYPE).options[expr_ndx].value;
  quizObj.hints = []; 
  for(var i = 1; i<=hint_counter; i++){
		var id = 'hint_'+i;
		console.log(id);
		console.log(maindocument.getElementById(id).value);
		quizObj.hints.push(maindocument.getElementById(id).value);
	
	}
  Blockly.Quizmaker.hints =  quizObj.hints;  
  Blockly.Quizmaker.hintCounter = quizObj.hintCounter = 0;

  // The blocks and components that will be displayed to user
  var vals = [], cboxes =  MAINDOCUMENT.getElementsByName(BUILT_INS);
  for(var i=0, elm; elm = cboxes[i]; i++) {
    if (elm.checked) {
      vals.push(elm.value);
    }
  }
  quizObj.built_ins = addBuiltIns(vals);

  vals = [], cboxes =  MAINDOCUMENT.getElementsByName(COMPONENTS);
  for(var i=0, elm; elm = cboxes[i]; i++) {
    if (elm.checked) {
      vals.push(elm.value);
    }
  }
  quizObj.components = vals;

  // It's ok if some of these are undefined
  quizObj.dictionary = Blockly.Quizmaker.Dictionary;
  quizObj.problemWorkspace = Blockly.Quizmaker.problemWorkspace;
  quizObj.solutionWorkspace = Blockly.Quizmaker.solutionWorkspace;
  quizObj.function_name = Blockly.Quizmaker.function_name;
  quizObj.function_inputs = Blockly.Quizmaker.function_inputs;
  quizObj.Xmlgenerator = Blockly.Quizmaker.Xmlgenerator;
  quizObj.Xmltemplate = Blockly.Quizmaker.Xmltemplate;

  // Quizme uses these
  Blockly.Quizmaker[qname] = quizObj;
  Blockly.Quizmaker.quizName = qname;
}

/**
 * Evaluate the user's answer and display feedback.  The answerType is
 *  used to separate different types of evaluation algorithms.
 */
function evaluateQuizResult() {
  console.log("RAM: evaluateQuizResult()");

  MAINDOCUMENT.getElementById(TOGGLE_BTN).innerHTML = "New Question";
  var answer_type = getAnswerType();
  var expr_ndx = MAINDOCUMENT.getElementById(EXPR_TYPE).selectedIndex;
  var expr_type = MAINDOCUMENT.getElementById(EXPR_TYPE).options[expr_ndx].value;

  if (answer_type == EVAL_STMT) {
    var qname = Blockly.Quizmaker.quizName;
    Blockly.Quizme.evaluateStatement(Blockly.Quizmaker);
  }
  else if (answer_type == EVAL_EXPR_FILLIN) {
    Blockly.Quizme.evaluateEvalBlocksAnswerType(); 

  } else if (answer_type == FUNC_DEF) {
    Blockly.Quizme.evaluateEvalFunctionDef(Blockly.Quizmaker);

  // All other types -- this may need to be refined
  }
  else if (answer_type == PROC_DEF) {
    Blockly.Quizme.evaluateEvalProcedureDef(Blockly.Quizmaker);
  }
  else if (answer_type == EVAL_EXPR && expr_type == EXPR_FILLIN_REL) {
    var answer = evalMainWorkspace();

    Blockly.Quizme.giveFeedback(answer,
	"That is correct!",
        "Oops, your answer was <font color=\"red\">" + answer + "</font>");
  }
  else if (answer_type == XML_BLOCKS) {
    var result = Blockly.Quizme.evaluateXmlBlocksAnswerType(Blockly.Quizmaker, Blockly.Quizmaker.solutionWorkspace,
             Blockly.Quizmaker.VariableMappings);
  }
  else { // answer_type = EVAL_EXPR && expr_type == EXPR_REL
    var solution = "" + Blockly.Quizmaker.solution;
    var answer = MAINDOCUMENT.getElementById(QUIZ_ANSWER).value.toLowerCase();

    Blockly.Quizme.giveFeedback(solution == answer, 
	"Your answer was <font color=\"green\">" + answer + "</font>. That is correct!",
        "Oops, your answer was <font color=\"red\">" + answer + "</font>. "  +
    	"The correct answer is <font color=\"green\">" + solution + "</font>");
  }
}

function getQuizName() {
  return Blockly.Quizmaker.quiz.quizName;
}

function isAnswerTypeSelected() {
  var ans_ndx = MAINDOCUMENT.getElementById(ANSWER_TYPE).selectedIndex;
  return ans_ndx != 0;
}

function getQuizType() {
  return Blockly.Quizmaker.quizType;
}

function setState(state) {
  Blockly.Quizmaker.state = state;
}

function getState() {
  return Blockly.Quizmaker.state;
}

function isInState(state) {
  return Blockly.Quizmaker.state == state;
}

function saveSolutionWorkspace() {
  var blks = Blockly.mainWorkspace.getTopBlocks();
  if (blks.length != 0) {
    Blockly.Quizmaker.solutionWorkspace = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
    Blockly.Quizmaker.solutionBlocks = Blockly.mainWorkspace.getTopBlocks();
  }
}

function getSolutionWorkspace() {
  return Blockly.Quizmaker.solutionWorkspace;
}

function saveProblemWorkspace() {
  var blks = Blockly.mainWorkspace.getTopBlocks();
  if (blks.length != 0) {
    Blockly.Quizmaker.problemWorkspace = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
  }
}

function setProblemWorkspace(xml) {
  Blockly.Quizmaker.problemWorkspace = xml;
}

function getProblemWorkspace() {
  return Blockly.Quizmaker.problemWorkspace;
}

function setMainWorkspaceFromText(txt) {
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom( txt ));
}

function getVariableMappings() {
  return Blockly.Quizmaker.quiz.VariableMappings;
}

function getAnswerType() {
  var ans_ndx = MAINDOCUMENT.getElementById(ANSWER_TYPE).selectedIndex;
  var ans_type = MAINDOCUMENT.getElementById(ANSWER_TYPE).options[ans_ndx].value;
  var expr_ndx = MAINDOCUMENT.getElementById(EXPR_TYPE).selectedIndex;
  var expr_type = MAINDOCUMENT.getElementById(EXPR_TYPE).options[expr_ndx].value;
  Blockly.Quizmaker.quiz.answer_type = ans_type;
  Blockly.Quizmaker.quiz.expr_type = expr_type;
  console.log("Answer type = " + ans_type);
  return  ans_type;
}

/**
 *  Calls Quizme.setupFunctionDefinition, passing it the blocks
 *   saved in the solutionWorkspace.  The function definition 
 *   is placed on Blockly.JavaScript.definitions_.
 */
function createFunctionDef() {
  console.log("createFunctionDef()");

  var txt = getSolutionWorkspace();
  var qname = getQuizName();
  if (txt) {
    var ws = new Blockly.Workspace(true);  // Create def from solution Xml
    ws.createDom();
    var dom = Blockly.Xml.textToDom(txt);
    Blockly.Xml.domToWorkspace(ws, dom);
    var blocks = ws.getTopBlocks();
    Blockly.Quizmaker.function_def = Blockly.Quizmaker.quiz.function_def =  
      Blockly.Quizme.setupFunctionDefinition(qname, Blockly.Quizmaker, blocks);
  } else {
    // Function will be created from mainWorkspace
    Blockly.Quizmaker.function_def = Blockly.Quizmaker.quiz.function_def =  
      Blockly.Quizme.setupFunctionDefinition(qname, Blockly.Quizmaker);
  }
}

/**
 *  Calls Quizme.setupProcedureDefinition, passing it the blocks
 *   saved in the solutionWorkspace.  The function definition 
 *   is placed on Blockly.JavaScript.definitions_.
 */
function createProcedureDef() {
  console.log("createProcedureDef()");

  var txt = getSolutionWorkspace();
  var qname = getQuizName();
  if (txt) {
    var ws = new Blockly.Workspace(true);  // Create def from solution Xml
    ws.createDom();
    var dom = Blockly.Xml.textToDom(txt);
    Blockly.Xml.domToWorkspace(ws, dom);
    var blocks = ws.getTopBlocks();
    Blockly.Quizmaker.function_def = Blockly.Quizmaker.quiz.function_def =  
      Blockly.Quizme.setupFunctionDefinition(qname, Blockly.Quizmaker, blocks);
  } else {
    // Function will be created from mainWorkspace
    Blockly.Quizmaker.function_def = Blockly.Quizmaker.quiz.function_def =  
      Blockly.Quizme.setupFunctionDefinition(qname, Blockly.Quizmaker);
  }
}

function evalMainWorkspace() {
  return Blockly.Quizme.eval(Blockly.mainWorkspace.getTopBlocks()[0]);
}

/**
 *  View manager.  Sets up the UI for the various states of the app.
 */
function setView(state, ans_type) {
  console.log("setView(), state = " + state + " ans_type=" + ans_type);
  if (state == PROB) {
    setProblemSpaceView(ans_type);
  } else if (state == PREV) {
    setPreviewView();
  } else if (state == SOLU) {
    setSolutionSpaceView();
  }
}

function setProblemSpaceView(ans_type) {
  MAINDOCUMENT.getElementById(QUIZ_NAME).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_QUES).style.visibility="hidden";
  MAINDOCUMENT.getElementById(HINT_HTML).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_NAME).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_ANSWER).style.visibility="hidden";
  MAINDOCUMENT.getElementById(HINT_BTN).style.visibility="hidden";
  MAINDOCUMENT.getElementById(TOGGLE_BTN).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_RESULT).style.visibility="hidden";
   
  var instructions = MAINDOCUMENT.getElementById(INSTR);
  //instructions.style.visibility="visible";

  var quiz_question = Blockly.Quizmaker[Blockly.Quizmaker.quizName].question_html;
  if (ans_type == EVAL_STMT || ans_type == FUNC_DEF || ans_type == PROC_DEF) {
    instructions.innerHTML = '<font color="purple">Put together 0 or more blocks as you would like them to appear to the student.' + 
      '<br>Then click the \'Setup Solution\' button.</font>' + 
      '<br><br><font color="green">Quiz Question: ' + quiz_question + '</font>';

  // For eval_expr problems, we go right to Test the quiz.
  } else if (ans_type == EVAL_EXPR) {
    var expr_ndx = MAINDOCUMENT.getElementById(EXPR_TYPE).selectedIndex;
    var expr_type = MAINDOCUMENT.getElementById(EXPR_TYPE).options[expr_ndx].value;
    instructions.innerHTML = '<font color="purple">The student will be presented with a random ' + expr_type + ' expression as seen here. ' + 
       '<br>You\'re ready to preview this quiz.</font>' + 
       '<br><br><font color="green">Quiz Question: ' + quiz_question + '</font>';

    populateWorkspaceWithExpressionBlock(expr_type);
  }
}

function setPreviewView() {
  //MAINDOCUMENT.getElementById('instructions').style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_NAME).style.visibility="visible";
  MAINDOCUMENT.getElementById(QUIZ_QUES).style.visibility="visible";
  MAINDOCUMENT.getElementById(HINT_HTML).style.visibility="visible";
  MAINDOCUMENT.getElementById(HINT_BTN).style.visibility="visible";
  MAINDOCUMENT.getElementById(TOGGLE_BTN).style.visibility="visible";
  MAINDOCUMENT.getElementById(TOGGLE_BTN).innerHTML ="Submit";
  MAINDOCUMENT.getElementById(QUIZ_NAME).innerHTML = "Quiz Name: " + Blockly.Quizmaker.quiz.display_name;
  var quizquestion = MAINDOCUMENT.getElementById(QUIZ_QUES);
  quizquestion.innerHTML = mapQuizVariables(Blockly.Quizmaker, 
              Blockly.Quizmaker.quiz.question_html, 
              Blockly.Quizmaker.quiz.VariableMappings);  
  var quizanswer = MAINDOCUMENT.getElementById(QUIZ_ANSWER);
  quizanswer.value = "";
  Blockly.Quizmaker.quiz.visibility = (Blockly.Quizmaker.quiz.answer_type == EVAL_EXPR && Blockly.Quizmaker.quiz.expr_type != EXPR_FILLIN_REL) ? "visible" : "hidden";
  quizanswer.style.visibility = Blockly.Quizmaker.quiz.visibility;
  quizanswer.hidden = false;
  MAINDOCUMENT.getElementById(HINT_HTML).innerHTML = "";
  MAINDOCUMENT.getElementById(QUIZ_RESULT).style.visibility='hidden';
}

function setSolutionSpaceView() {
  var instructions = MAINDOCUMENT.getElementById('instructions');
  //instructions.style.visibility="visible";
  var quiz_question = Blockly.Quizmaker[Blockly.Quizmaker.quizName].question_html;
  instructions.innerHTML = '<font color="purple">Put together the blocks for a solution to the problem. You can use your variables in the blocks.' + 
    '<br>Then click the \'Preview the Quiz\' button.</font>' +
    '<br><br><font color="green">Quiz Question: ' + quiz_question + '</font>';

  MAINDOCUMENT.getElementById(QUIZ_NAME).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_QUES).style.visibility="hidden";
  MAINDOCUMENT.getElementById(HINT_HTML).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_NAME).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_ANSWER).style.visibility="hidden";
  MAINDOCUMENT.getElementById(HINT_BTN).style.visibility="hidden";
  MAINDOCUMENT.getElementById(TOGGLE_BTN).style.visibility="hidden";
  MAINDOCUMENT.getElementById(QUIZ_RESULT).style.visibility="hidden";
}

/**
 *  Creates an expression  block in the workspace. This is for EVAL_EXPR
 *  type of problems. 
 *  @param expr_type -- arithmetic, relational
 */
function populateWorkspaceWithExpressionBlock(expr_type) {
  console.log("poplulateWorkspaceWithEpressionBlock()");
  var xml = "";
  if (expr_type == EXPR_REL) {
    xml = generateFunction(RELATION_GENERATOR, RELATION_TEMPLATE);
  } else if (expr_type == EXPR_FILLIN_REL) {
    xml = generateFunction(RELATION_GENERATOR, RELATION_FILLIN_TEMPLATE);
  } else if (expr_type == EXPR_ARITH) {
    xml = generateFunction(ARITHMETIC_GENERATOR, ARITHMETIC_TEMPLATE);
  }
  setProblemWorkspace(xml);
  setMainWorkspaceFromText(xml);
}

/**
 *  Applies function definition to an Xml template.
 *  The function replaces arguments in the Xml template and generates
 *  random values.
 */
function generateFunction(fn_str, template) {
  Blockly.Quizmaker.Xmlgenerator = eval( '(' + fn_str + ')' );
  Blockly.Quizmaker.Xmltemplate = template;
  return Blockly.Quizmaker.Xmlgenerator(Blockly.Quizmaker.Xmltemplate, -5, 10);
}



