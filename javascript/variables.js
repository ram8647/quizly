/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.JavaScript = Blockly.Generator.get('JavaScript');

// Global variable definition block                                                                                                                                                                         
Blockly.JavaScript.global_declaration = function() {
  var name = this.getTitleValue('NAME');
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  //  var code = Blockly.Yail.YAIL_DEFINE + name + Blockly.Yail.YAIL_SPACER + argument0 + Blockly.Yail.YAIL_CLOSE_COMBINATION;
  return 'global_' + name + ' = ' + argument0 + ';\n';
};



//Blockly.JavaScript.variables_get = function() {
Blockly.JavaScript.lexical_variable_get = function() {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(this.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

//Blockly.JavaScript.variables_set = function() {
Blockly.JavaScript.lexical_variable_set = function() {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};
