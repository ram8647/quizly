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

 Blockly.Quizme = {};
 Blockly.Quizme.quiznames = [];
 Blockly.Quizme.quiznames_display = [];

 Blockly.Quizme.clearWorkspace = function() {
     Blockly.mainWorkspace.clear();
 }

/**
 * Syncrhonously loads the quizzes.json file.  The callback function 
 *  populates the Blockly.Quizme object.
 * @param url is the url of the JSON file.
 */
Blockly.Quizme.loadQuizzes = function(url) {
  console.log("RAM: loadQuizzes, url = " + url);
  $.ajaxSetup( { "async": false } );   
  $.getJSON(url, function(data) {

    $.each(data, function(key, val) {
      Blockly.Quizme.addQuiz(key, val, Blockly.Quizme);
    });

  });
  $.ajaxSetup( { "async": true } );
}

/**
 * Blockly.Quizme.addQuiz() -- adds a Quiz to quizObj
 * @param name -- quiz's name
 * @param jsonStr -- JSON encoding of the quiz
 * @param quizObj -- either Quizme or Quizmaker
 *
 */ 
Blockly.Quizme.addQuiz = function(name, jsonStr, quizObj) {
  console.log("RAM: Quizme.add, jsonStr = " + jsonStr.Name);
  quizObj[name] = {};
  quizObj[name].quizName = jsonStr.Name;
  quizObj[name].display_name = jsonStr.DisplayName;
  quizObj[name].description = jsonStr.Description;
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

// /**
//  *  Generates the XML for a math comparison problem where the user has to 
//  *  plug in a block to complete a true expression
//  *  @param low low end of range
//  *  @param high high end of range
//  *  @param op a comparison operator, e.g., '=', or blank
//  */
// Blockly.Quizme.math_compare_fillin_xml = function(low, high, op) {
//     var ops = ['EQ', 'NEQ', 'LT', 'LTE', 'GT', 'GTE'];  
//     if (!op) {
//       op = ops[Math.floor(Math.random() * ops.length)];
//     }

//     var n1 = Math.floor(Math.random() * 10);
//     var n2 = Math.floor(Math.random() * 10);
//     if (low && high) {
//         n1 = low + Math.floor(Math.random() * (high - low + 1));
//         n2 = low + Math.floor(Math.random() * (high - low + 1));
//     }

//   // Create the XML code and render to workspace
//     var xml = Blockly.Xml.textToDom(
//        '<xml>' +
//        '<block type="math_compare" inline="true" x="85" y="100">' +
// 	'<title name="OP">' + op + '</title>' +
// 	'<value name="A">' +
// 	 '<block type="math_number">' + 
// 	  '<title name="NUM"> '  + n1 + '</title>' + 
// 	 '</block>' + 
//         '</value>' + 
//        '</block>' +
//        '<block type="math_number" x="125" y="150">' + 
// 	  '<title name="NUM"> '  + n2 + '</title>' + 
//        '</block>' + 
//        '</xml>');
//     return xml;
// };

// /**
//  *  Generates the XML for an arithmetic problem using random integers in the range low to high 
//  *  @param low low end of range
//  *  @param high high end of range
//  *  @param op an arithmetic operator
//  */
// Blockly.Quizme.math_arithmetic_xml = function(low, high, op) {
//   console.log("RAM: Quizme.math_arithmetic_xml");
//     var ops = ['ADD', 'MINUS', 'MULTIPLY', 'DIVIDE', 'POWER'];  
//     var type = "";
//     if (!op) {
//         op = ops[Math.floor(Math.random() * ops.length)];
//         if (op == 'ADD') {
//           type = "math_add";      
// 	} else if (op == 'MINUS') {
//           type = "math_subtract";      
// 	} else if (op == 'MULTIPLY') {
//           type = "math_multiply";      
// 	} else if (op == 'DIVIDE') {
//           type = "math_division";      
// 	} else {
//           type = "math_power";      
// 	}
//     }
//     var n1 = Math.floor(Math.random() * 10);
//     var n2 = Math.floor(Math.random() * 10);
//     if (low && high) {
//         n1 = low + Math.floor(Math.random() * (high - low + 1));
//         n2 = low + Math.floor(Math.random() * (high - low + 1));
//     }
//     if (op == 'DIVIDE' && n2 == 0) {
//         n2 = 1;
//     }
//     if (op == 'DIVIDE') {
//       var factor = Math.floor(Math.random() * 5);
//       n1 = n2 * factor;
//     }
//     if (op == 'POWER' && n2 > 3) {
//         n2 = 3;
//     }

//     var xml = "";
   
//   // Create the XML code and render to workspace
//   if (op == 'ADD' || op == 'MULTIPLY') {
//     xml = Blockly.Xml.textToDom(
//        '<xml>' +
//        '<block type=\"' + type + '\" inline="true" x="85" y="100">' +
// 	'<value name="NUM0">' +
// 	 '<block type="math_number">' + 
// 	  '<title name="NUM"> '  + n1 + '</title>' + 
// 	 '</block>' + 
//         '</value>' + 
//         '<value name="NUM1">' +
// 	 '<block type="math_number">' + 
// 	  '<title name="NUM"> '  + n2 + '</title>' + 
//  	 '</block>' + 
//         '</value>' +
//        '</block>' +
//        '</xml>');
//   } else {
//     xml = Blockly.Xml.textToDom(
//        '<xml>' +
//        '<block type=\"' + type + '\" inline="true" x="85" y="100">' +
// 	'<value name="A">' +
// 	 '<block type="math_number">' + 
// 	  '<title name="NUM"> '  + n1 + '</title>' + 
// 	 '</block>' + 
//         '</value>' + 
//         '<value name="B">' +
// 	 '<block type="math_number">' + 
// 	  '<title name="NUM"> '  + n2 + '</title>' + 
//  	 '</block>' + 
//         '</value>' +
//        '</block>' +
//        '</xml>');
//   }
//   return xml;
// };

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
  var gen = Blockly.Generator.get("JavaScript");
  var code = gen.blockToCode(block);
  var value = eval(code[0]);
  console.log("RAM: evaluating " + code[0] + " to " + value);
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

