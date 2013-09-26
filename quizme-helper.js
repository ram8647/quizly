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
 *  As of 2/19/2013 Quizzes are defined as JSon objects in quizzes.json.

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

var DEBUG = true;
var SELECTOR_OPTION = 'selector';
var BACKPACK_OPTION = 'backpack';

//  Blocks lists -- should contain only blocks that have JavaScript generators, plus blocks that support mutators.
var MATH_BLOCKS = ["math_add", "math_compare","math_divide","math_division","math_is_a_number", "math_multiply","math_mutator_item", "math_number", 
		   "math_on_list", "math_power", "math_random_float", "math_random_int", "math_round", "math_single", "math_subtract"]; //"math_random_set_seed", 
var LOGIC_BLOCKS = ["logic_boolean", "logic_compare", "logic_false", "logic_negate", "logic_operation", "logic_or"];
var VARIABLES_BLOCKS = ["global_declaration", "lexical_variable_get", "lexical_variable_set", 
               "local_declaration_expression", "local_declaration_statement", "local_mutatorarg", "local_mutatorcontainer"];
var PROCEDURES_BLOCKS = ["procedures_callnoreturn", "procedures_callreturn", "procedures_defnoreturn",
        "procedures_defreturn", "procedures_mutatorarg", "procedures_mutatorcontainer", 
        "removeProcedureValues", "getProcedureNames"];
var CONTROLS_BLOCKS = ["controls_choose", "controls_do_then_return", "controls_if", "controls_if_else", "controls_if_elseif","controls_if_if",  
		       "controls_while", "controls_forEach" ]; //  "controls_forRange"
var LISTS_BLOCKS = ["lists_create_with", "lists_create_with_item", "lists_is_empty", "lists_length"]; //"lists_add_items", "lists_add_items_item", "lists_append_list", "lists_create_with_item", "lists_insert_item", "lists_is_in", "lists_is_list", "lists_pick_random_item", "lists_remove_item", "lists_replace_item", "lists_select_item"
var TEXT_BLOCKS = ["text", "text_join", "text_length","text_isEmpty","text_trim","text_changeCase"]; // "text_join_item", "text_compare", "text_starts_at", "text_contains", "text_split", "text_split_at_spaces", "text_segment", "text_replace_all"
var COLOR_BLOCKS = ["color_black", "color_white", "color_red", "color_pink", "color_orange", "color_yellow", "color_green", "color_cyan", "color_blue", "color_magenta", "color_light_gray", 
                    "color_gray", "color_dark_gray", "color_make_color", "color_split_color", ];
var TOPLEVEL_BLOCKS = ["mutator_container", "InstantInTime", "YailTypeToBlocklyType", "YailTypeToBlocklyTypeMap","setTooltip","wrapSentence"];


// Path to images used in UI
var imgpath = "./quizly/media/";
var maindocument = parent.document;

Blockly.hello = function(command, quizname) {
  if (DEBUG) console.log("RAM: Blockly says " + command);
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
 * Initialize Quizme.
 *
 * @param quizname, either undefined or a string giving one of the defined quiznames
 * @param quizmepath, path to the quizme source files
 * @param arglist, the list of GET args passed, e.g., 'quizname=name&selector=hidden&backpack=hidden
 */
function initQuizme(quizname, quizmepath, arglist) {
  if (DEBUG) console.log("RAM: initializing ... quizname= " + quizname + " path=" + quizmepath + " arglist = " + arglist);

  // App Inventor's Drawer needs to point to Quizly's Toolbox.
  Blockly.Drawer = Blockly.Toolbox;
  Blockly.Toolbox.hide = function() {}   // To cover calls to Drawer.hide()

  // Load the quizzes and components from data files.
  Blockly.Quizme.loadQuizzes(quizmepath + "quizzes.json");
  Blockly.Quizme.components = Blockly.Quizme.inputFromComponentsArray();

  // Parse the argument list --> creates Blockly.Quizme.options
  parseArgList(arglist);

  // Do we want to hide the backpack?
  if (Blockly.Quizme.options['backpack'] == 'hidden') {
    var bp = Blockly.mainWorkspace.backpack;
    if (bp)
      bp.dispose();
  }

  // Set up the quiz selector drop down, if there is one
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
     
  // Set up path names.
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

  if (!quizname) {
    if (window.document.title == "Blockly Frame") {
      if (window.parent.activity) {
        quizname = processCbActivity(window.parent.activity);
      } else if (window.parent.parent.activity) {
        quizname = processCbAcivity(window.parent.parent.activity);
      } else if (window.parent.assessment) {
        quizname = processCbAssessment(window.parent.assessment);
      } else if (window.parent.parent.assessment) {
        quizname = processCbAssessment(window.parent.parent.activity);
      }
    }
  }

  // Initialize the structures that handles scoped variables
  Blockly.BlocklyEditor.startquizme();
  
  // Display a quiz question
  showQuiz(quizname);
}

/**
 * Parses options passed in as GET arguments, saving them on
 *  Blockly.Quizme.options.
 *
 * @param arglist, a string of the form arg1=val1&arg2=val2...
 */
function parseArgList(arglist) {
  Blockly.Quizme.options = {};
  if (arglist) {
    var params = arglist.split('&');
    for (var i = 0; i < params.length; i++) {
      var keyval = params[i].split('=');
      Blockly.Quizme.options[keyval[0]] = keyval[1];
    }
  }
}

/**
 * Displays a quiz question of a given type.  Quizzes are input from 
 * quizzes.json by Blockly.Quizme.add() in quizme.js.  They are stored
 * as Blockly.Quizme objects, indexed by 'quizname'.
 * 
 * @quizname the type of quiz question, possibly undefined, in which
 *  case a random quizname is selected
 * 
 * TODO: This function is too long. Break it up. 
 */
function showQuiz(quizname) {
  if (DEBUG) console.log("RAM: showQuiz " + quizname);

  Blockly.mainWorkspace.clear();  // Do this first, before setting up built-ins and components.

  var quiznames = Blockly.Quizme.quiznames;

  // The maindocument may or may not have a selector.
  if (quizname == undefined) {
    var quizSelector = maindocument.getElementById('quiz_selector');
    if (quizSelector && Blockly.Quizme.options[SELECTOR_OPTION] != 'hidden') {
      quizSelector.style.visibility = 'visible';
      maindocument.getElementById('selector_prompt').style.visibility='visible';
      quizname = quizSelector.options[quizSelector.selectedIndex].value;
    }
  } else {   // quizname is set
    var quizSelector = maindocument.getElementById('quiz_selector');
    if (quizSelector && Blockly.Quizme.options[SELECTOR_OPTION] != 'hidden') {
      quizSelector.style.visibility = 'visible';
      maindocument.getElementById('selector_prompt').style.visibility='visible';
      quizSelector.value = quizname;
    }
  }
  // Do we want to hide the selector?
  if (Blockly.Quizme.options[SELECTOR_OPTION] == 'hidden')  {
     var selector = maindocument.getElementById('quiz_selector');
     if (selector) {
       var element = maindocument.getElementById('selector');
       element.parentNode.removeChild(element);
       element = maindocument.getElementById('selector_prompt');
       element.parentNode.removeChild(element);
       element =  maindocument.getElementById('heading');
       element.parentNode.removeChild(element);
     }
  }
  // If quizname still undefined, choose a random quiz type
  if (quizname == undefined) {
    var n = Math.floor(Math.random() * quiznames.length);
    quizname = quiznames[n];
  }

  var keepers = [];
  var components = [];

  // By this point, quizname is set to one of the valid name. So for
  // each quiz, set up the Blockly.Language before setting
  // the quiz's other properties.

  // Generate the variable mappings for this quiz (optional)
  var quiz = Blockly.Quizme[quizname];
  if (quiz) {
    Blockly.Quizme.Dictionary = quiz.dictionary;;
    if (Blockly.Quizme.Dictionary) {
      Blockly.Quizme.VariableMappings = generateInstanceMappings(quizname, Blockly.Quizme);
    }
  }

  keepers = Blockly.Quizme[quizname].built_ins;
  components = Blockly.Quizme[quizname].components;
  customizeQuizmeLanguage(quizname, keepers, components);

  if (DEBUG) console.log("RAM: quizname = " + quizname);
  var button = maindocument.getElementById('submit_new_toggle');
  if (button) 
    button.innerHTML = "Submit";
  Blockly.Quizme.quizName = quizname;
  Blockly.Quizme.question_type = Blockly.Quizme[quizname].problem_type;
  Blockly.Quizme.questionHTML = Blockly.Quizme[quizname].question_html;
  Blockly.Quizme.answerHTML = Blockly.Quizme[quizname].answer_html;
  Blockly.Quizme.answerType = Blockly.Quizme[quizname].answer_type;
  Blockly.Quizme.answerVisibility = Blockly.Quizme[quizname].answer_visibility;
  Blockly.Quizme.resultHTML = Blockly.Quizme[quizname].result_html;
  Blockly.Quizme.hintCounter = 0;
  Blockly.Quizme.hints = Blockly.Quizme[quizname].hints;
  Blockly.Quizme.solution = Blockly.Quizme[quizname].xmlsolution;

  // NOTE: Can eval be avoided here?
  Blockly.Quizme.xmlGenerator = eval( '(' + Blockly.Quizme[quizname].xmlgenerator + ')');

  // Dynamically generate a random quiz

  var xml = Blockly.Quizme[quizname].xml;
  if (Blockly.Quizme.xmlGenerator instanceof Function) {
    xml = Blockly.Quizme.xmlGenerator(xml, 1, 10);
    if (DEBUG) console.log("RAM: xml= " + xml);
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
 * Initializes Blockly.Language with only those blocks for which there
 *  are JavaScript generators and blocks that support mutators.
 *
 * When this function completes Blockly.Language should contain all 
 *  built-in blocks plus whatever AI Components are set here.
 *
 * NOTE: Blockly.WholeLanguage is created in quizme-initblocklyeditor.js
 */
function initQuizmeLanguage() {
  if (DEBUG) console.log("RAM: initQuizmeLanguage ");
 
  var whitelist = [];
  whitelist = whitelist.concat(MATH_BLOCKS).concat(LOGIC_BLOCKS).concat(VARIABLES_BLOCKS).concat(PROCEDURES_BLOCKS);
  whitelist = whitelist.concat(CONTROLS_BLOCKS).concat(LISTS_BLOCKS).concat(TEXT_BLOCKS).concat(COLOR_BLOCKS).concat(TOPLEVEL_BLOCKS);

  // Initialize Blockly.Language by copying whitelisted blocks from WholeLanguage
  Blockly.Language = {}
  for (var propname in Blockly.WholeLanguage) {
    if (whitelist.indexOf(propname) != -1)
      Blockly.Language[propname] = Blockly.WholeLanguage[propname];
  }

  resetComponentInstances();  // In quizme-helper.js
  var components = ['Button', 'Sound', 'Label', 'Canvas'];
  Blockly.Quizme.addComponents(components);
 
  // Remove generics
  for (var k = 0; k < components.length; k++) {
    var component_name = components[k];
    delete(Blockly.Language[component_name + "_setproperty"]);
    delete(Blockly.Language[component_name + "_getproperty"]);
  } 
}

/**
 *  Initializes the toolbox's language tree (menu) to the current language.
 *  Note that the toolbox tree is initially set statically during injection.  
 *  We create a dynamic tree for each quiz. 
 *  
 *  @param language -- usually called with  Blockly.Language.
 *  @return a Dom object representing the tree of categories and blocks 
 *   that appear in the toolbox and its flyout.
 */
function initToolboxLanguageTree(language) {
  resetBlocklyLanguage();  // Hack to add some special Language properties

  // Start with an empty tree.
  Blockly.languageTree = Blockly.Xml.textToDom("<xml id='toolbox' style='display:none'></xml>");

  // Initialize the category list
  var cats = [];

  //  Iterate through the blocks in the language to construct the toolbox languageTree
  //  for (var propname in Blockly.WholeLanguage) {
  for (var propname in language) {
    if (DEBUG) console.log("Adding to Blockly.languageTree " + propname);

    // Use a tempWorkspace so that procedure def blocks are not set to visible.
    var tempWorkspace = new Blockly.Workspace();
    var blk = new Blockly.Block(tempWorkspace, propname);

    // If this block has a category, append the category name to category list.
    var catname = blk['category'];
    if (catname) {
      if (catname == 'Component') {
        cats[''] = '';
        cats['COMPONENTS'] = '';
        catname = blk.typeName;    // For components use the typename for category.
      }
      var category = cats[catname];
      if (!category) {
        category = "";
        cats[catname] = category;
      }
      category = category.concat("<block type='" + propname + "'></block>");
      cats[catname] = category;
    }
  }
  // Now build and return the categorized tree.
  var treeString = "<xml id='toolbox' style='display:none'>";
  for (var cat in cats) {
    treeString = treeString.concat("<category name='" + cat + "'>" + cats[cat] + "</category>");
  }
  treeString = treeString.concat("</xml>");
  return Blockly.Xml.textToDom(treeString);
}

/**
 * Customizes the Quizme language for just those blocks needed for a 
 *  particular quiz. At the end of this function, the Quizly toolbox
 *  should contain only those categories and blocks specified in the
 *  quiz's Json entry.
 *
 * @param quizname -- the type of quiz being presented. This is
 *  needed to initialize the Blockly.Language, which varies
 *  depending on quizname.
 * @param keepers, an array giving names of the built-in language
 *  elements to keep in the language. If the first list element is 'all',
 *  then all built-in elements are loaded.
 * @param components, an array of App Inventor components that we want
 *  to add to Blockly.Language
 */
function customizeQuizmeLanguage(quizname, keepers, components) {
  if (DEBUG) console.log("RAM: customizeQuizmeLanguage() quizname = " + quizname + " keepers = " + keepers);

  // If the language has already been set for this quiz type, just exit  
  // NOTE: Leave quizname=undefined to reset the language

  if (quizname && Blockly.Quizme.language_type == quizname) {
    if (DEBUG) console.log("RAM: language set to " + quizname + " ... exiting");
    return;
  }

  // Initialize the language with all blocks.
  initQuizmeLanguage();
  var newLanguage = {}
  for (var propname in Blockly.Language) {
    if (keepers.indexOf(propname) != -1) {
      newLanguage[propname] = Blockly.Language[propname];
    }
    if (Blockly.Language[propname].category == 'Component' &&
        Blockly.Language[propname].blockType != 'genericmethod') {
      var typeName = Blockly.Language[propname].typeName;
      if (components.indexOf(typeName) != -1) {
        newLanguage[propname] = Blockly.Language[propname];
      }
    }
  }
  Blockly.Language = newLanguage;

  // Construct the languageTree used to populate the toolbox.
  Blockly.languageTree = initToolboxLanguageTree(Blockly.Language);

  Blockly.Quizme.language_type = quizname;
  if (DEBUG) console.log("RAM: Blockly.Quizme.language_type = " + Blockly.Quizme.language_type);

  resetBlocklyLanguage();  // Hack to add certain neede properties back onto Blockly.Language.

  // Add the App Inventor components to the langauge and initialize the Toolbox  
  resetComponentInstances();
  Blockly.Quizme.addComponents(components);
    
  // Delete the current toolbox tree (svg element) from the webpage.
  var html = Blockly.Toolbox.HtmlDiv;
  var children = html.childNodes;
  if (children[1])
    children[1].parentNode.removeChild(children[1]);

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
    if (DEBUG) console.log("RAM ComponentInstances.addInstance " + name);
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
  if (DEBUG) console.log("RAM: renderQuiz()");
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
  if (DEBUG) console.log("RAM: submitNewToggle");
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
  if (DEBUG) console.log("RAM: processHint");
  var hints = helperObj.hints;
  var count = helperObj.hintCounter;
  var hintHTML = "";
  var hint_element = maindocument.getElementById('hint_html');
  if (helperObj.hintCounter < helperObj.hints.length) {
    hintHTML = '<font color="magenta">Hint: ' + hints[count]  + '</font>';
    ++helperObj.hintCounter;
  } else {
    hintHTML = '<font color="red">Sorry, no more hints available</font>.';
    helperObj.hintCounter = 0;
  }
  hint_element.innerHTML = hintHTML;
}

function giveHint() {
  if (DEBUG) console.log("RAM: giveHint()");
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
    if (DEBUG) console.log("RAM: givefeedback() isCorrect = " + isCorrect);
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
  if (DEBUG) console.log("RAM: evaluateUserAnswer()");
  var btn = maindocument.getElementById('submit_new_toggle');
  //  if (btn) {
  if (btn && Blockly.Quizme.options[SELECTOR_OPTION] != 'hidden') {
    btn.innerHTML = "New Question";
  }
  var result;
  if (Blockly.Quizme.answerType == "xml_blocks") {
    result = Blockly.Quizme.evaluateXmlBlocksAnswerType(Blockly.Quizme.solution, 
       Blockly.Quizme.VariableMappings); 
  }
  else if (Blockly.Quizme.answerType == "eval_blocks") {
    result = Blockly.Quizme.evaluateEvalBlocksAnswerType(); 
  }
  else if (Blockly.Quizme.answerType == "func_def") {
    result = Blockly.Quizme.evaluateEvalFunctionDef(Blockly.Quizme); 
  }
  else if (Blockly.Quizme.answerType == "proc_def") {
    result = Blockly.Quizme.evaluateEvalProcedureDef(Blockly.Quizme);
  }
  else {  // Drop through case eval_expr
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
  if (DEBUG) console.log("RAM: evaluateEvalBlocksAnswerType()");
  var result = Blockly.Quizme.eval_math_compare_topblock();
  Blockly.Quizme.giveFeedback(result == true, 
     "Good! Your expression evaluates to <font color=\"green\">" + true + "</font>. Nice!",
     "Oops! Your expression evaluates to <font color=\"red\">" + result + "</font>. "  +
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
  if (DEBUG) console.log("RAM: evaluateEvalFunctionDef() for quiz " + helperObj.quizName);

  var qname = helperObj.quizName;

  // Set up the standard and the test functions
  var testFn = window.eval(Blockly.Quizme.setupFunctionDefinition(helperObj.quizName, helperObj));
  //  var testFn = Blockly.Quizme.setupFunctionDefinition(helperObj.quizName, helperObj);
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
 * @param blocks, possibly undefined, the blocks that should be used to construct the function
 */
  Blockly.Quizme.setupFunctionDefinition = function(qname, helperObj, blocks) {
  if (helperObj.function_name) {
    helperObj[qname].function_name = helperObj.function_name;
  }
  if (helperObj.function_inputs) {
    helperObj[qname].function_inputs = helperObj.function_inputs;
  }
  Blockly.JavaScript.init();
  if (!blocks) 
    blocks  = Blockly.mainWorkspace.topBlocks_;
  
  // Bhargavi: Generates code for all blocks, not just a single function definition
  for(var i = 0; i<blocks.length; i++)	{
    Blockly.JavaScript.blockToCode(blocks[i]);  
    }    
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  //  code += helperObj[qname].function_name; 
  return code; 
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
  if (DEBUG) console.log("RAM: Testing fn against standard ...");
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
    if (DEBUG) console.log("input=" + inputs[k] + " std=" + stdresult + " fn=" + fnresult);
      if (stdresult && ( isArray(stdresult))) {
      result =  stdresult != undefined && arrcmp(stdresult, fnresult);
    } else {
      result =  stdresult != undefined && (stdresult == fnresult);
    }
    if (result != true) {
      errmsg = 'Your function failed on input<font color="red"> ' + inputs[k] + '</font>. The result should be <font color="red">' 
                 + stdresult + '</font>. Your result was <font color="red">' + fnresult + '</font>';
    }
    k = k + 1;
  }
return [result,errmsg];
}

/**
 * Evaluates proc_def problem.
 * @param helperObj, either Blockly.Quizmaker or Blockly.Quizme
 *
 */
Blockly.Quizme.evaluateEvalProcedureDef = function(helperObj) {
  console.log("RAM: evaluateEvalProcedureDef() for quiz " + helperObj.quizName);

  var qname = helperObj.quizName;

  // Set up the standard and the test functions
  var testFn = Blockly.Quizme.setupProcedureDefinition(helperObj.quizName, helperObj);
  var stdFn = helperObj[qname].function_def;
  var result = true;

  // Run 5 random tests
  for (var i = 0; i<5; i++) {
    result = Blockly.Quizme.testProcedureAgainstStandard(stdFn, testFn, helperObj);
    if(!result[0])
      break;
  };
  Blockly.Quizme.giveFeedback(result[0],
    "Correct! Your function passed 5 randomly generated test cases.  Good show!",
			      "Oops. " + result[1] + ". Try again!", true);
}

/**
 *  Compares two objects containing variable bindings.
 * @param g1, an object of variable bindings
 * @param g1, an object of variable bindings
 */

Blockly.Quizme.compare = function(g1,g2)  {
  var compare = true;
  var errmsg = "";
  for (var name in g1) {
    compare = name in g2;
   if (compare) 
     compare = g1[name]==g2[name];
   if(!compare)
     errmsg = "Fails on test case for variable " + name + ". Correct value should be  " + g1[name] + ". Your value is " + g2[name];
     break;
  };
  return [compare, errmsg];
}


/**
 *  Called when the answer_type is "proc_def. This creates the procedure definition
 *    initializes JavaScript and then creates and saves a procedure definition for the blocks
 *    in the mainWorkspace.
 * @param qname, the name of the quiz and index into the helperObj
 * @param helperObj, either Quizmaker or Quizme
 * @param blocks, possibly undefined, the blocks that should be used to construct the procedure
 */
  Blockly.Quizme.setupProcedureDefinition = function(qname, helperObj, blocks) {
  if (helperObj.function_name) {
    helperObj[qname].function_name = helperObj.function_name;
  }
  if (helperObj.procedure_inputs) {
    helperObj[qname].procedure_inputs = helperObj.procedure_inputs;
  }
  Blockly.JavaScript.init();
  if (!blocks)
    blocks  = Blockly.mainWorkspace.topBlocks_;

  // Bhargavi: Generate code for all blocks, not just single function definition
  for(var i = 0; i<blocks.length; i++)	{
    Blockly.JavaScript.blockToCode(blocks[i]);  
    }    
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  //alert(code);
  return code; 
}

/**
 *  Tests the student's procedure input-by-input against the
 *   quiz's procedure definition, return true if it passes
 *   all the tests.
 * @param stdFn -- the correct function definitino
 * @param testFn -- the student's definitino
 * @param helperObj -- object containing quizzes data
 */
Blockly.Quizme.testProcedureAgainstStandard = function(stdFn, testFn, helperObj) {
  console.log("RAM: Testing procedure against standard for quiz " + helperObj.quizName);

  // Extract procedure name and parameter types from the signature
  var qname = helperObj.quizName;
  var procSignature = helperObj[qname].function_name;
  procSignature = procSignature.trim();
  var procName = procSignature.substring(0,procSignature.indexOf("("));  // Extract the procedure name
  var paramTypeList = procSignature.substring(procSignature.indexOf("(")+1, procSignature.indexOf(")"));
  paramTypeList = paramTypeList.trim();

  // Create an array of parameter types -- i.e., num, or str, or list
  var paramtypes = [];
  if (paramTypeList.length != 0)
     paramtypes = paramTypeList.split(',');

  if (testFn.indexOf(procName) == -1) {
    return [false, 'Can\'t find your procedure. Double check the name (spelling counts).'];
  }

  //  Create an array of parameter variable names
  var params = [];
  var p1 = stdFn.indexOf("var ");
  var p2 = stdFn.indexOf(" ", p1+1);
  var p3 = stdFn.indexOf(";", p1);
  var param;
  while (p1 != -1) {
    param = stdFn.substring(p1+4, p3);  // Grab the parameter
    if (param.indexOf("global") == -1)  // Make sure it's not a global
      params.push(param);               // Add it to the list
    p1 = stdFn.indexOf("var ", p1+1);
    p2 = stdFn.indexOf(" ", p1+1);
    p3 = stdFn.indexOf(";", p1);
  }

  // Create an array of global variable declarations
  //  which take the form: var global_X;
  var globals = [];
  var i1 = stdFn.indexOf("var global");
  var i2 = stdFn.indexOf(" ", i1+4);
  var i3 = stdFn.indexOf(";", i1);
  if (i3 < i2) 
    i2 = i3;

  // Looping for each global variable
  var temp;
  while (i1 != -1) {
    temp = stdFn.substring(i1+4,i2);     // Grab the variable name (minus 'var')
    if (globals.indexOf(temp) == -1)  
      globals.push(temp);                // Push the name of the global variable
    i1 = stdFn.indexOf("var global", i1+1);  // And get the next one
    i2 = stdFn.indexOf(" ", i1+4);
    i3 = stdFn.indexOf(";", i1);
    if (i3 < i2) 
      i2 = i3;
  };
  
  // Add a test function to the code for both testFn and stdFn
  testFn += "function test() {";
  stdFn += "function test() {";
   
  // In the test function body, generate a random assignment statement for each global variable
  for (i1 = 0; i1 <globals.length; i1++) {
    i2 = Math.floor(Math.random()*10) +1;             // random number from 1 to 10
    testFn += "\n" + globals[i1] + " = " + i2 +";\n";
    stdFn += "\n" + globals[i1] + " = " + i2 +";\n";
  };

  // Add a procedure call to the test function body
  stdFn += procName + "(";
  testFn += procName + "(";
  
  // Add parameter values to the procedure call -- currently we only support numbers
  // The array paramtypes stores the types of the parameter -- num, str, list
  for (var i = 0; i < params.length; i++) {
    var v;
    if (paramtypes[i] == 'num') {
      v = Math.floor(Math.random()*10) +1;             // random number from 1 to 10      
    } else if (paramtypes[i] == 'str') {
      v = "'" + "str" + Math.floor(Math.random()*10) + "'";     // string of the form strN
    } else if (paramtypes[i] == 'list') {
      v = [];
    }
    var comma = (i < params.length-1) ? "," : "";
    stdFn += v + comma; 
    testFn += v + comma;    
  }
  stdFn += ");\n var ret = {";
  testFn += ");\n var ret = {";

  //  stdFn += helperObj[qname].function_name + "();\n var ret = {";
  //  testFn += helperObj[qname].function_name + "();\n var ret = {";
  
  // Generate a ret object consisting of variable bindings for each global variable for 
  //   both the testFn and stdfn
  for(i1 = 0; i1 < globals.length-1; i1++) {
    stdFn += "g"+i1+": " +globals[i1]+ ",";
    testFn += "g"+i1+": " +globals[i1]+ ",";
  };
  stdFn += "g"+i1+": " +globals[i1];
  testFn += "g"+i1+": " +globals[i1];
  
  stdFn+="};\n return ret;} test()";
  testFn+="};\n return ret;} test()";

  // Now evaluate the code. This will respectively call testFn and the stdFn and generate
  //  two sets of variable bindings
  var z = window.eval(testFn);
  var y = window.eval(stdFn);

  // Compare the two sets of variable bindings.
  return Blockly.Quizme.compare(y,z);
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
  if (DEBUG) console.log("RAM: evaluateXmlBlocksAnswerType");
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

  Blockly.Quizme.giveFeedback(result.indexOf(solution) != -1, 
     "Good!  Your solution is correct.",
		 "Oops! Your solution contains a mistake. Try again.",
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
  return str;
}

/**
 * Removes a given tag and corresponding endtag from str
 * @param tag a string representing the tag, e.g., 'xml'
 */
Blockly.Quizme.removeTag = function(tag, str) {
  if (DEBUG) console.log("RAM: removeTag " + tag);
  var startTag = str.indexOf("<" + tag);
  var endTag = str.indexOf(">", startTag + 1 + tag.length);
  str = str.substring(0, startTag) + str.substring(endTag + 1);
  if (DEBUG) console.log (startTag + "," + endTag);

  var startEndTag = str.indexOf("</" + tag);
  var endEndTag = str.indexOf(">", startEndTag + 2 + tag.length);
  str = str.substring(0, startEndTag) + str.substring(endEndTag+1);
  if (DEBUG) console.log (startEndTag + "," + endEndTag);
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
  if (DEBUG) console.log("generateInstanceMappings()");
  var map = {};
  var dict = helperObj[name].dictionary;
  //  if (dict == "undefined") {
  if (!dict) {
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
  if (DEBUG) console.log("mapQuizVariables() " + str);
  if (!str) 
    return str;
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

/**
*  Array equality that should work on nested arrays.
*/
function arrcmp(arr_1, arr_2) {
  var equal = arr_1.length == arr_2.length; 
  if (equal) {
    for (var k = 0; k < arr_1.length; k++) {
      var a1 = arr_1[k];
      var a2 = arr_2[k];
      if ( isArray(a1)) {
        equal = arrcmp(a1,a2); // recursive call
        if (!equal) 
          return false;           
      } else {
        if (a1 != a2)
          return false;
      }
    }
  }
  return equal;
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

