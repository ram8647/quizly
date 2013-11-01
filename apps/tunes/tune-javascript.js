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

// Level of nesting for for loops
Blockly.JavaScript.nestLevel = 0;

// Extensions to Blockly's JavaScript generator.

// A side effect block
Blockly.JavaScript['set_interval'] = function(block) { 
  var s = block.getTitleValue('S');
  var n = 'interval';
  var m = 500;
  if (s == 'short') {
    n = 'interval250';
    m = 250;    
  }
  else if (s == 'long') {
    n = 'interval750';
    m = 750;    
  }
  else  {
    n = 'interval500';
    m = 500;    
  }
  Tune.Timer_interval = m;   // Side effect
  return 'Tune.notes.push("' + n + '");\n';
};

Blockly.JavaScript['tune_play_c'] = function(block) { 
  return 'Tune.notes.push("noteC");\n';
};

Blockly.JavaScript['tune_play_d'] = function(block) { 
  return 'Tune.notes.push("noteD");\n';
};

Blockly.JavaScript['tune_play_e'] = function(block) {
  return 'Tune.notes.push("noteE");\n';
};

Blockly.JavaScript['tune_play_f'] = function(block) {
  return 'Tune.notes.push("noteF");\n';
};

Blockly.JavaScript['tune_play_g'] = function(block) {
  return 'Tune.notes.push("noteG");\n';
};

Blockly.JavaScript['tune_play_a'] = function(block) {
  return "Tune.notes.push('noteA');\n";
};

Blockly.JavaScript['tune_play_b'] = function(block) {
  return 'Tune.notes.push("noteB");\n';
};

Blockly.JavaScript['tune_play_c_high'] = function(block) {
  return 'Tune.notes.push("noteCHigh");\n';
};

Blockly.JavaScript['tune_if'] = function(block) {
  // Generate JavaScript for 'if' conditional if interval value
  var interval = Tune.IntervalMap[block.getTitleValue('INT')];
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  var condition = interval ==  Tune.Timer_interval;
  var code = 'if (' + condition + '  /* Tune.Timer_interval == ' + interval + '*/) {\n' + branch + '}\n';
  return code;
};

Blockly.JavaScript['tune_ifElse'] = function(block) {
  // Generate JavaScript for 'if/else' conditional if interval value
  var interval = Tune.IntervalMap[block.getTitleValue('INT')];
  var branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
  var branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
  var condition = interval ==  Tune.Timer_interval;
  var code = 'if (' + condition + ' /* Tune.Timer_interval == ' + interval + '*/) {\n' + branch0 +
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
  Blockly.JavaScript.nestLevel += 1;
  var loopvar = 'i' +  Blockly.JavaScript.nestLevel;

  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }
  return 'for (var ' + loopvar + '=0; ' + loopvar + ' < ' + n + '; ' + loopvar + '++) {\n' + branch + '}\n';
};

Blockly.JavaScript['button_click'] = function(block) {
  // Generate JavaScript for a button click
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return branch;
};

