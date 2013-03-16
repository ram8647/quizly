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
var imgpath = "";
var quizmakerpath = "";
var maindocument = parent.document;

Blockly.doIt = function(command, param) {
  console.log("RAM: Blockly says " + command);
  if (command == 'init') 
    initQuizMaker(param);
  else if (command == 'setupproblem')
    setupProblemBlocks();
  else if (command == 'setupsolution') 
    setupSolutionBlocks();
  else if (command == 'preview')
    previewTheQuiz(false);
  else if (command == 'json')
    generateJSON();
  else if (command == 'hint')
    giveTestHint();
  else if (command == 'submit')
    toggleNewTest();
  else if (command == 'type')
    onAnswerTypeSelected(param);
  else if (command == 'expression')
    onExpressionTypeSelected(param);
  else if (command == 'variables')
    getVariableRanges(param);
}

/**
 * Initialize Quizmaker
 * @param path, path to the quizmaker source files
 */
function initQuizMaker(path) {
  console.log("RAM: initializing ... path=" + path);

  Blockly.Quizmaker = {};
  Blockly.Quizme.components = Blockly.Quizme.inputFromComponentsArray();
  Blockly.Quizme.pathname = path;
  Blockly.Quizme.imgpath = path + 'quizme/media/';

//   quizmakerpath = path;
//   if (path.indexOf("makequiz") == -1) {
//     imgpath = path + "makequiz/media/";
//    } else {
//      imgpath = path + "media/";
//    }
//   Blockly.Quizme.imgpath = imgpath;


  // Initialize the structures that handles scoped variables
  Blockly.BlocklyEditor.startquizme();
  //  Blockly.Quizme.addComponents(['Button', 'Sound']);
  initWorkspace();
}

/**
 * Initializes the problem and solution blocks panes.
 * NOTE: Blockly.WholeLanguage is created in quizme-initblocklyeditor.js
 * 
 */
function initWorkspace() {
  console.log("RAM: initWorkspace ");

  var keepers = ['all'];
  var components = ['Button', 'Sound'];

  Blockly.Language = Blockly.WholeLanguage;
  if (keepers[0] == 'all') {
    Blockly.Language = Blockly.WholeLanguage;
  } else {                      
    var newLanguage = {};
    for (var x = 0; x < keepers.length; x++) {
      newLanguage[keepers[x]] = Blockly.WholeLanguage[keepers[x]];
    }
    Blockly.Language = newLanguage;
    Blockly.Quizmaker.language_type = quiztype;
    console.log("RAM: Blockly.Quizmaker.language_type = " + Blockly.Quizmaker.language_type);

    resetBlocklyLanguage();
  }

  // Add the App Inventor components to the langauge and initialize the Toolbox  
  resetComponentInstances();
  Blockly.Quizme.addComponents(components);
  Blockly.Toolbox.init();

}

/**
 * Evaluate the user's answer and display feedback.  The answerType is
 *  used to separate different types of evaluation algorithms.
 */
function evaluateQuizResult() {
  console.log("RAM: evaluateQuizResult()");

  maindocument.getElementById('submit_new_toggle').innerHTML = "New Question";
  if (Blockly.Quizmaker.answer_type == "xml_blocks") {
    var qname = Blockly.Quizmaker.quizName;
    Blockly.Quizme.evaluateXmlBlocksAnswerType(Blockly.Quizmaker.solutionWorkspace, Blockly.Quizmaker[qname].VariableMappings); 
  }
  else if (Blockly.Quizmaker.answer_type == "eval_blocks") {
    Blockly.Quizme.evaluateEvalBlocksAnswerType(); 

  } else if (Blockly.Quizmaker.answer_type == "func_def") {
    Blockly.Quizme.evaluateEvalFunctionDef(Blockly.Quizmaker);

  // All other types -- this may need to be refined
  } else {
    var solution = "" + Blockly.Quizmaker.solution;
    var answer = maindocument.getElementById('quiz_answer').value.toLowerCase();

    Blockly.Quizme.giveFeedback(solution == answer, 
	"Your answer was <font color=\"green\">" + answer + "</font>. That is correct!",
        "Oops, your answer was <font color=\"red\">" + answer + "</font>. "  +
    	"The correct answer is <font color=\"green\">" + solution + "</font>");
  }
}

/**
 *  Creates an expression  block in the workspace. This is for 'eval_expr'
 *  type of problems. 
 *  @param expr_type -- arithmetic, logical, relational
 */
function populateWorkspaceWithExpressionBlock(expr_type) {
  var xml = "";
  if (expr_type == "relation") {
    var fn_str = "function xmlGenerator(xml, low, high, op) {var ops = ['EQ', 'NEQ', 'LT', 'LTE', 'GT', 'GTE'];   if (!op) { op = ops[Math.floor(Math.random() * ops.length)]; } var n1 = Math.floor(Math.random() * 10); var n2 = Math.floor(Math.random() * 10); if (low && high) { n1 = low + Math.floor(Math.random() * (high - low + 1)); n2 = low + Math.floor(Math.random() * (high - low + 1)); } xml = xml.replace('$OP', op); xml = xml.replace('$N1', n1); xml = xml.replace('$N2', n2); return xml; }";

    Blockly.Quizmaker.Xmlgenerator = eval( '(' + fn_str + ')' );
    Blockly.Quizmaker.Xmltemplate = "<xml><block type=\"math_compare\"><title name=\"OP\" >$OP</title><value name=\"A\"><block type=\"math_number\"><title name=\"NUM\">$N1</title></block></value><value name=\"B\"><block type=\"math_number\"><title name=\"NUM\">$N2</title></block></value></block></xml>";
   
    xml = Blockly.Quizmaker.Xmlgenerator(Blockly.Quizmaker.Xmltemplate, -5, 10);
    Blockly.Quizmaker.problemWorspace = xml;

  // TODO: This needs to be replaces with an Json verions, similar to relations.
  } else if (expr_type == "arithmetic") {
    var fn_str = "function xmlGenerator(xml,low, high, op){var ops = ['ADD', 'MINUS', 'MULTIPLY', 'DIVIDE', 'POWER'];var name1=''; var name2=''; var type = '';if (!op){op = ops[Math.floor(Math.random() * ops.length)];if (op == 'ADD'){name1='NUM0'; name2='NUM1'; type = 'math_add';}else if (op == 'MINUS'){name1='A';name2='B';type = 'math_subtract';} else if (op == 'MULTIPLY'){name1='NUM0';name2='NUM1';type = 'math_multiply'; } else if (op == 'DIVIDE') {name1='A';name2='B';type = 'math_division';} else {type = 'math_power';name1='A';name2='B';}}var n1 = Math.floor(Math.random() * 10);var n2 = Math.floor(Math.random() * 10);if (low && high) {n1 = low + Math.floor(Math.random() * (high - low + 1));n2 = low + Math.floor(Math.random() * (high - low + 1));}if (op == 'DIVIDE' && n2 == 0) {n2 = 1;}if (op == 'DIVIDE') {var factor = Math.floor(Math.random() * 5);n1 = n2 * factor;}if (op == 'POWER' && n2 > 3) {n2 = 3;}xml = xml.replace('$type', type);xml = xml.replace('$arg1', n1);xml = xml.replace('$arg2', n2);xml=xml.replace('$name1',name1);xml=xml.replace('$name2',name2);return xml; }";

    Blockly.Quizmaker.Xmlgenerator = eval( '(' + fn_str + ')' );
    Blockly.Quizmaker.Xmltemplate = '<xml><block type=\"$type\" inline=\"true\" x=\"85\" y=\"100\"><value name=\"$name1\"><block type=\"math_number\"><title name=\"NUM\">$arg1</title></block></value><value name=\"$name2\"><block type=\"math_number\"><title name=\"NUM\">$arg2</title></block></value></block></xml>';

    xml = Blockly.Quizmaker.Xmlgenerator(Blockly.Quizmaker.Xmltemplate, -5, 10);
    Blockly.Quizmaker.problemWorspace = xml;
  }

//     var ops = ['ADD', 'MINUS', 'MULTIPLY', 'DIVIDE', 'POWER'];  
//     var types = ['math_add', 'math_subtract', 'math_multiply', 'math_division', 'math_power'];
//     var ndx = Math.floor(Math.random() * ops.length);
//     var op = ops[ndx];
//     var type = types[ndx];
//     var n1 = -5 + Math.floor(Math.random() * (10 - -5 + 1));
//     var n2 = -5 + Math.floor(Math.random() * (10 - -5 + 1));
//     if (op == 'DIVIDE' && n2 == 0) {
//       n2 = 1 + Math.floor(Math.random() * 10);
//     }
//     if (op == 'DIVIDE') {
//       var factor = Math.floor(Math.random() * 5);
//       n1 = n2 * factor;
//     }
//     if (op == 'POWER' && n2 > 3) {
//       n1 = 2 + Math.floor(Math.random() * 5)
//       n2 = 3;
//     }
//     var arg1 = "A";
//     var arg2 = "B";
//     if (op == 'ADD' || op == 'MULTIPLY') {
//       arg1 = "NUM0";
//       arg2 = "NUM1";
//     }
//     xml = '<xml><block type=\"' + type + '\"><value name=\"' + arg1 + '\">' +
// 	 '<block type="math_number">' + '<title name="NUM"> '  + n1 + '</title>' + 
// 	 '</block>' + '</value>' + '<value name=\"' + arg2 + '\">' + 
// 	 '<block type="math_number">' + 
// 	  '<title name="NUM"> '  + n2 + '</title>' + 
//  	 '</block>' + 
//          '</value>' +
//          '</block></xml>';
//   }
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(xml));
}


/**
 * Displays the quiz in the browser and allows user to test the quiz.
 *
 * @param redo is a boolean that prevents the solution from being
 *  overwritten if this is a redo of a problem. If it is undefined,
 *  it is assumed to be false.
 *
 * TODO: This function is too long.
 */
function previewTheQuiz(redo) {
  console.log("RAM: testTheQUiz()");
  
  // Unless this is a redo, save the solutionWorkspace
  // If this is a redo, generate new variable bindings for blocks and question and hints

  if (redo == undefined || redo == false) {
    redo = false;
    Blockly.Quizmaker.solutionWorkspace = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
  } else {
    var qname = Blockly.Quizmaker.quizName;
    Blockly.Quizmaker[qname].VariableMappings = generateInstanceMappings(qname, Blockly.Quizmaker);
    var quizquestion = maindocument.getElementById('quiz_question');
    quizquestion.innerHTML = mapQuizVariables(Blockly.Quizmaker[qname].question_html, Blockly.Quizmaker[qname].VariableMappings);  
    setupWorkspace(Blockly.Quizmaker[Blockly.Quizmaker.quizName].answer_type);
    return;
  }

  // Create an object for the Quiz data
  documentToQuizObject(Blockly.Quizmaker);

  // Maindocument state:  Step 3.  Test
  maindocument.getElementById('test').disabled = true;
  maindocument.getElementById('generate').disabled = false;

  //  var quiztype = Blockly.Quizmaker.quizName;
  var qname = Blockly.Quizmaker.quizName;
  var keepers = Blockly.Quizmaker[qname].built_ins;
  var components = Blockly.Quizmaker[qname].components;

  // Generate the random values for this Quiz instance
  Blockly.Quizmaker[qname].VariableMappings = generateInstanceMappings(qname, Blockly.Quizmaker);

  // Set up the maindocument for previewing the quiz
  maindocument.getElementById('instructions').style.visibility="hidden";
  maindocument.getElementById('quiz_name').style.visibility="visible";
  maindocument.getElementById('quiz_question').style.visibility="visible";
  maindocument.getElementById('hint_html').style.visibility="visible";
  maindocument.getElementById('hint_button').style.visibility="visible";
  maindocument.getElementById('submit_new_toggle').style.visibility="visible";
  maindocument.getElementById('quiz_name').innerHTML = "Quiz Name: " + Blockly.Quizmaker[qname].display_name;

  var quizquestion = maindocument.getElementById('quiz_question');
  quizquestion.innerHTML = mapQuizVariables(Blockly.Quizmaker[qname].question_html, Blockly.Quizmaker[qname].VariableMappings);  
  var quizanswer = maindocument.getElementById('quiz_answer');
  quizanswer.value = "";
  Blockly.Quizmaker[qname].visibility = (Blockly.Quizmaker[qname].answer_type == 'eval_expr') ? "visible" : "hidden";
  quizanswer.style.visibility = Blockly.Quizmaker[qname].visibility;
  quizanswer.hidden = false;

  maindocument.getElementById('hint_html').innerHTML = "";

  // TODO: Change this. It has to be set to call quizme-helper.initializeBlocksWorkspace()
  //  So that all built-ins are included
  var quiztype = "math_arithmetic";
  initializeBlocksWorkspace(quiztype, keepers, components);

  if (Blockly.Quizmaker[qname].answer_type == "func_def") {
    Blockly.Quizmaker[qname].function_def = 
      Blockly.Quizme.setupFunctionDefinition(qname, Blockly.Quizmaker);
  }

  // Set up the workspace
  setupWorkspace(Blockly.Quizmaker[qname].answer_type);
}

/**
 *  Grab the data from the document and create a Quiz object.
 * @param quizObj -- Blockly.Quizmaker
 */ 
function documentToQuizObject(quizObj) {
  var display_name = maindocument.getElementById('display_name').value;
  var qname = "quiz_" + display_name.toLowerCase().replace(/ /g,'_');
  quizObj.quizName = qname;

  quizObj[qname] = {}
  quizObj[qname].name = qname;
  quizObj[qname].display_name = display_name;
  quizObj[qname].description = maindocument.getElementById('description').value;
  quizObj[qname].question_html = maindocument.getElementById('question_html').value;
  quizObj.answer_type = maindocument.getElementById('answer_type').value;
  quizObj[qname].answer_type = quizObj.answer_type;

  quizObj.hints = [ maindocument.getElementById('hint_1').value, 
                              maindocument.getElementById('hint_2').value, 
                              maindocument.getElementById('hint_3').value];
  quizObj[qname].hints = quizObj.hints;
  quizObj[qname].problemWorkspace = quizObj.problemWorkspace;
  quizObj[qname].solutionWorkspace = quizObj.solutionWorkspace;

  quizObj.hintCounter = 0;
  quizObj[qname].dictionary = quizObj.Dictionary;

  // Set the blocks drawers using the built_ins and components 
  var vals = [], cboxes =  maindocument.getElementsByName('built_ins');
  for(var i=0, elm; elm = cboxes[i]; i++) {
    if (elm.checked) {
      vals.push(elm.value);
    }
  }
  quizObj[qname].built_ins = addBuiltIns(vals);

  vals = [], cboxes =  maindocument.getElementsByName('components');
  for(var i=0, elm; elm = cboxes[i]; i++) {
    if (elm.checked) {
      vals.push(elm.value);
    }
  }
  quizObj[qname].components = vals;

  quizObj[qname].Xmlgenerator = quizObj.Xmlgenerator;
  quizObj[qname].Xmltemplate = quizObj.Xmltemplate;

}

/**
 * Clears the workspace and installs the blocks that make up the problemWorkspace
 */
function setupWorkspace(answer_type) {
  Blockly.mainWorkspace.clear(); 
  var qname = Blockly.Quizmaker.quizName;
  if (answer_type == "xml_blocks") {
    var probSpace = mapQuizVariables(Blockly.Quizmaker.problemWorkspace, Blockly.Quizmaker[qname].VariableMappings);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(probSpace));
  } else if (answer_type == "func_def") {
     var probSpace = mapQuizVariables(Blockly.Quizmaker.problemWorkspace, Blockly.Quizmaker[qname].VariableMappings);
     Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(probSpace));
  } else if (answer_type == "eval_expr") {
    var xml = Blockly.Quizmaker.Xmlgenerator(Blockly.Quizmaker.Xmltemplate, -5, 10);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(xml))
    Blockly.Quizmaker.solution = Blockly.Quizme.eval(Blockly.mainWorkspace.topBlocks_[0]);
  } 
}

/**
 * The onclick function for the 'hint' button
 */
function giveTestHint() {
  var hint = maindocument.getElementById('hint_html');
  processHint(Blockly.Quizmaker);
}

/**
 *  The onclick function for the 'generate' button.
 */
function generateJSON() {
  var jsonObj = generateQuizJsonObj(Blockly.Quizmaker);
  Blockly.Quizmaker.JsonObj = jsonObj;
  var str = JSON.stringify(jsonObj);
  alert("Copy and paste the following JSON string into the quizzes file:\n\n" + "\"" + jsonObj.Name + "\" :" + str)
}

/**
 * Generate the JSON object that is used to present and evaluate the  Quiz.  
 *
 * @param quizData, an object storing the quiz data
 */
function generateQuizJsonObj(quizData) {
  console.log("RAM: generateJSON()");

  maindocument.getElementById('generate').disabled = true;

  var obj = new Object();
  var name = quizData.quizName;
  obj.Name = name;
  obj.DisplayName = quizData[name].display_name;
  obj.ProblemType = quizData[name].problem_type;
  obj.Decription = quizData[name].description;
  obj.QuestionHTML = quizData[name].question_html;
  obj.AnswerHTML = "";
  obj.AnswerType = quizData[name].answer_type;
  obj.AnswerVisibility = quizData[name].visibility;
  obj.ResultHTML = "";
  obj.Hints = quizData[name].hints;
  obj.BuiltIns = quizData[name].built_ins;
  obj.Components = quizData[name].components;
  obj.VariableMappings = quizData[name].VariableMappings;
  obj.FunctionName = (quizData[name].function_name) ? quizData[name].function_name : "";;
  obj.FunctionDef = (quizData[name].function_def) ? "" + quizData[name].function_def : "undefined";
  obj.FunctionInputs = (quizData[name].function_inputs) ? quizData[name].function_inputs : "undefined";
  obj.XmlDictionary = (quizData[name].dictionary) ?  quizData[name].dictionary : "undefined"; 
  obj.Xmlgenerator = (quizData[name].Xmlgenerator) ? "" + quizData[name].Xmlgenerator : "undefined";
  obj.Xmltemplate = (quizData[name].Xmltemplate) ? quizData[name].Xmltemplate : quizData.problemWorkspace;
  obj.Xmlsolution = (quizData[name].Xmltemplate) ? "" : quizData[name].solutionWorkspace;
  return obj;
}

/**
 * Utility function for adding the names of blocks that should populate the
 *  various drawers, given a list of type (drawer) names.
 * @param typenames, an array of "math", "list", etc.
 * 
 */
function addBuiltIns (typenames) {
  var list = [];
  var type = "";
  for (var i = 0; i < typenames.length; i++) {
    type = typenames[i];
    var types;
    if (type == "math") {
      types = ["math_add", "math_compare","math_divide","math_division","math_is_a_number", "math_multiply","math_mutator_item", "mutator_container", "math_number", 
                "math_on_list", "math_power",
	       "math_random_float", "math_random_int", "math_random_set_seed", "math_round", "math_single", "math_subtract"];
    } else if (type == "logic") {
      types = ["logic_boolean", "logic_compare", "logic_false", "logic_negate", "logic_operation", "logic_or"];
    } else if (type == "variables") {
      types = ["global_declaration", "lexical_variable_get", "lexical_variable_set", 
               "local_declaration_expression", "local_declaration_statement", "local_mutatorarg", "local_mutatorcontainer"];
    } else if (type == "procedures") {
      types = ["procedures_callnoreturn", "procedures_callreturn", "procedures_defnoreturn",
        "procedures_defreturn", "procedures_mutatorarg", "procedures_mutatorcontainer", 
        "removeProcedureValues", "getProcedureNames"];
    } else if (type == "controls") {
      types = ["controls_if", "controls_if_else", "controls_if_elseif", 
       "controls_if_if", "controls_while", "controls_forEach", "controls_forRange"];
    } else if (type == "lists") {
      types = ["lists_add_items", "lists_add_items_item", "lists_append_list", 
	 "lists_insert_item", "lists_is_empty", "lists_is_in", "lists_is_list",
	 "lists_length", "lists_pick_random_item", "lists_remove_item", "lists_replace_item",
	 "lists_select_item"];
    } else if (type == "text") {
	types = ["text_compare", "text_contains", "text_isEmpty", "text_join",
		 "text_join_item", "text_length", "text_replace_all", "text_segment", "text_split",
		 "text_split_at_spaces", "text_trim", "wrapSentence"];
    }
    for (var k = 0; k < types.length; k++) {
      list.push(types[k]);   
    }
  }
  return list;
}

//// Button onclick Handlers ///////////

/**
 *  Pull into the workspace the blocks that you want the user to see
 *   when the problem is presented.  
 */
function setupProblemBlocks() {
  maindocument.getElementById('quiz_name').style.visibility="hidden";
  maindocument.getElementById('quiz_question').style.visibility="hidden";
  maindocument.getElementById('hint_html').style.visibility="hidden";
  maindocument.getElementById('quiz_name').style.visibility="hidden";
  maindocument.getElementById('quiz_answer').style.visibility="hidden";
  maindocument.getElementById('hint_button').style.visibility="hidden";
  maindocument.getElementById('submit_new_toggle').style.visibility="hidden";
  maindocument.getElementById('quiz_result').style.visibility="hidden";
  maindocument.getElementById('problemspace').disabled = true;
  maindocument.getElementById('solutionspace').disabled = false;

  var instructions = maindocument.getElementById('instructions');
  instructions.style.visibility="visible";
  var ans_ndx = maindocument.getElementById('answer_type').selectedIndex;
  var ans_type = maindocument.getElementById('answer_type').options[ans_ndx].value;
  console.log("Answer type = " + ans_type);
  if (ans_type == 'xml_blocks' || ans_type == 'func_def') {
    instructions.innerHTML = '<font color="purple">Put together 0 or more blocks as you would like them to appear to the student.' + 
                           '<br>Then click the \'Setup Solution\' button.</font>';
  } else if (ans_type == 'eval_expr') {
    var expr_ndx = maindocument.getElementById('expression_type').selectedIndex;
    var expr_type = maindocument.getElementById('expression_type').options[expr_ndx].value;
    instructions.innerHTML = '<font color="purple">The student will be presented with a random ' + expr_type + ' expression as seen here. ' + 
			     '<br>You\'re ready to test this quiz. Click the \'Test the Quiz\' button.</font>';

    maindocument.getElementById('solutionspace').disabled = true;
    maindocument.getElementById('test').disabled = false;
    maindocument.getElementById('generate').disabled = true;
    populateWorkspaceWithExpressionBlock(expr_type);
  }
}

function setupSolutionBlocks() {
  var instructions = maindocument.getElementById('instructions');
  instructions.style.visibility="visible";
  instructions.innerHTML = '<font color="purple">Put together the blocks for a solution to the problem. You can use your variables in the blocks.' + 
                           '<br>Then click the \'Test the Quiz\' button.</font>';
  maindocument.getElementById('quiz_name').style.visibility="hidden";
  maindocument.getElementById('quiz_question').style.visibility="hidden";
  maindocument.getElementById('hint_html').style.visibility="hidden";
  maindocument.getElementById('quiz_name').style.visibility="hidden";
  maindocument.getElementById('quiz_answer').style.visibility="hidden";
  maindocument.getElementById('hint_button').style.visibility="hidden";
  maindocument.getElementById('submit_new_toggle').style.visibility="hidden";
  maindocument.getElementById('quiz_result').style.visibility="hidden";
  maindocument.getElementById('solutionspace').disabled = true;
  maindocument.getElementById('test').disabled = false;

  Blockly.Quizmaker.problemWorkspace = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
  
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
function getVariableRanges(textObj) {
  console.log("getVariableRanges() " + str);
  var str = textObj.value;
  console.log("getVariableRanges str = " + str);
  Blockly.Quizmaker.Dictionary = {};
  var ndx = str.indexOf('$#');
  while (ndx != -1)  {
    var ndx2 = str.indexOf('#$', ndx+1);    
    var tag = str.substring(ndx+2, ndx2);
    var value = "";
    if (tag.indexOf("STR") != -1) {
      value = prompt("For the STR variable " + tag + " input a comma-separated list of strings.");
      Blockly.Quizmaker.Dictionary[tag] = value.split(',');
    }
    ndx = str.indexOf('$#', ndx + 1);
  }

  ndx = str.indexOf('-9');
  while (ndx != -1)  {
    var ndx2 = str.indexOf('.9', ndx+1);    
    var tag = str.substring(ndx+2, ndx2);
    var value = "";
    if (isNaN(parseInt(tag)) != true) {
      value = prompt("For the numeric variable " + tag + " input a range of whole numbers, e.g., 1...5");
      Blockly.Quizmaker.Dictionary[tag] = value;
    }
    ndx = str.indexOf('-9', ndx + 1);
  }

  console.log("Dictionary " + Blockly.Quizmaker.Dictionary);
}

/**
 * 
 */
function testGiveHint() {
  console.log("RAM: testGiveHint()");
  processHint(Blockly.Quizmaker);
}

/**
 * Handles the Submit/New Question toggle button.
 */
function toggleNewTest() {
  console.log("RAM: toggleNewTest");
  maindocument.getElementById('quiz_result').style.visibility="visible";

  var buttonLabel = maindocument.getElementById('submit_new_toggle').innerHTML;
  if (buttonLabel == 'Submit') {
    maindocument.getElementById('quiz_result').style.visibility = "visible";
    evaluateQuizResult();
  } else {
    previewTheQuiz(true);  // true means this is a redo
    maindocument.getElementById('quiz_result').style.visibility = "hidden";
    maindocument.getElementById('submit_new_toggle').innerHTML = 'Submit';
  }
}

/** 
 * Handles the select-answer-type event in the HTML. 
 */
function onAnswerTypeSelected(selectObj) {
  console.log("onAnswerTypeSelected,  index = " + selectObj.selectedIndex);
  var idx = selectObj.selectedIndex;
  var val = selectObj.options[idx].value;
  if (val == 'eval_expr') {
    maindocument.getElementById('expression_type').style.visibility="visible";
  } else if (val == 'xml_blocks') {
    maindocument.getElementById('expression_type').style.visibility="hidden";
  } else if (val == 'func_def') {
    maindocument.getElementById('expression_type').style.visibility="hidden";
    Blockly.Quizmaker.function_name = prompt("Function name (must be legal JavaScript function name)?");
    var inputs = prompt("Input a semicolon-separated list of test cases where each case is a commas-separated list of input arguments -- e.g., 3,4; 4,5; 5,6");
    Blockly.Quizmaker.function_inputs = inputs.split(';');
    var cbox_option = maindocument.getElementsByName('built_ins')[6];
    if (cbox_option.value == "procedures") {
      cbox_option.checked = true;
    }
  }
}


function onExpressionTypeSelected(selectObj) {
  console.log("onExpressionTypeSelected,  index = " + selectObj.selectedIndex);
}
