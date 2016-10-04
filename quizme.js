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
 * @fileoverview Utility for generating interactive quizzes in blockly workspace.
 * 
 * @author ram8647@gmail.com (Ralph Morelli)
 */

var DEBUG = GLOBAL_DEBUG;   // GLOBAL_DEBUG set in blockly,html

Blockly.Quizme = {};
Blockly.Quizme.quiznames = [];
Blockly.Quizme.quiznames_display = [];
if (DEBUG) console.log(Blockly.Quizme);

Blockly.Quizme.clearWorkspace = function() {
    Blockly.mainWorkspace.clear();
}

Blockly.Quizme.parseQuizzes = function(quizdata) {
  for (var quiz in quizdata) {
     Blockly.Quizme.addQuiz(quiz, quizdata[quiz], Blockly.Quizme);
  }
}

/**
 * Blockly.Quizme.addQuiz() -- adds a Quiz to quizObj
 * @param name -- quiz's name
 * @param jsonStr -- JSON encoding of the quiz
 * @param quizObj -- either Quizme or Quizmaker
 *
 */ 
Blockly.Quizme.addQuiz = function(name, jsonStr, quizObj) {
  if (DEBUG) console.log("RAM: Quizme.add, jsonStr = " + jsonStr.Name);
  quizObj[name] = {};
  quizObj[name].quizName = jsonStr.Name;
  quizObj[name].description = jsonStr.Description;
  quizObj[name].display_name = jsonStr.DisplayName;
  quizObj[name].problem_type = jsonStr.ProblemType;
  quizObj[name].question_html = jsonStr.QuestionHTML;
  quizObj[name].answer_html = jsonStr.AnswerHTML;
  quizObj[name].answer_type = jsonStr.AnswerType;
  quizObj[name].answer_visibility = jsonStr.AnswerVisibility;
  quizObj[name].result_html = jsonStr.ResultHTML;
  quizObj[name].hints = jsonStr.Hints;
  quizObj[name].built_ins = jsonStr.BuiltIns;;
  quizObj[name].components = jsonStr.Components;
  quizObj[name].VariableMappings = jsonStr.VariableMappings;
  quizObj[name].function_name = jsonStr.FunctionName;
  quizObj[name].function_def = jsonStr.FunctionDef;
  quizObj[name].function_inputs = jsonStr.FunctionInputs;
  quizObj[name].xml = jsonStr.Xmltemplate;
  quizObj[name].xmlgenerator = jsonStr.Xmlgenerator;
  quizObj[name].xmlsolution = jsonStr.Xmlsolution;
  quizObj[name].dictionary = jsonStr.XmlDictionary;
  quizObj.quiznames.push(name);
  quizObj.quiznames_display.push(Blockly.Quizme[name].display_name);
}

/**
 *  Finds a top-block that is a math_compare block and evaluates it.
 */
Blockly.Quizme.eval_math_compare_topblock = function() {
  var blocks = Blockly.mainWorkspace.getTopBlocks();
  var block = null;
  for (var i = 0; i < blocks.length; i++) {
    block = blocks[i];
    if (block.type == "math_compare")
      break;        
  }
  return Blockly.Quizme.eval(block);
};

/**
 * Evaluates a block using Blockly.Generator for Javascript
 */
Blockly.Quizme.eval = function(block) {
  if (block == null)
      return undefined;
  var code = Blockly.JavaScript.blockToCode(block);
  var value = eval(code[0]);
  if (DEBUG) console.log("RAM: evaluating " + code[0] + " to " + value);
  return value;
}

/**
 *  Presents a quiz question and reports whether user's answer is correct.
 *  @param all params are strings
 */
Blockly.Quizme.prompt_and_report = function(qprompt, correct, incorrect, solution) {
  var answer = prompt(qprompt, "");
  if (answer != null && answer != "") {
    if (answer.toLowerCase() == solution) {
      alert(correct);
    } else {
      alert(incorrect);
    }
  }  
}

