/**
 * Quizly Apps: Tune Blocks derived from:
 * Blockly Apps: Maze  Blocks
 *
 * Copyright 2012 Google Inc.
 * Copyright 2013 Trinity College
 * http://quizly.googlecode.com/
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
 * @fileoverview Blocks for Quizly's Tune application, which is based on 
 *  Blockly's Maze application.
 * @author fraser@google.com (Neil Fraser)
 * @author ram8647@google.com (Ralph Morelli)
 */
'use strict';

// Extensions to Blockly's JavaScript generator.

Blockly.JavaScript['tune_play_a'] = function(block) {
  return "Tune.notes.push('noteA');\n";
};

Blockly.JavaScript['tune_play_e'] = function(block) {
  return 'Tune.notes.push("noteE");\n';
};

Blockly.JavaScript['tune_play_c'] = function(block) { 
  return 'Tune.notes.push("noteC");\n';
};

Blockly.JavaScript['tune_play_g'] = function(block) {
  return 'Tune.notes.push("noteG");\n';
};

Blockly.JavaScript['tune_if'] = function(block) {
  // Generate JavaScript for 'if' conditional if there is a path.
  var argument = 'Tune.' + block.getTitleValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  var code = 'if (' + argument + ') {\n' + branch + '}\n';
  return code;
};

Blockly.JavaScript['tune_ifElse'] = function(block) {
  // Generate JavaScript for 'if/else' conditional if there is a path.
  var argument = 'Tune.' + block.getTitleValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
  var branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
  var code = 'if (' + argument + ') {\n' + branch0 +
             '} else {\n' + branch1 + '}\n';
  return code;
};

Blockly.JavaScript['tune_forever'] = function(block) {
  // Generate JavaScript for do forever loop.
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }
  return 'while (true) {\n' + branch + '}\n';
};

Blockly.JavaScript['tune_times'] = function(block) {
  // Generate JavaScript for do times loop
  var n = block.getTitleValue('N');
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }
  return 'for (var i=0; i < ' + n + '; i++) {\n' + branch + '}\n';
};

Blockly.JavaScript['button_click'] = function(block) {
  // Generate JavaScript for a button click
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return branch;
};

