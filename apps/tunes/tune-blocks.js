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

// Extensions to Blockly's language.

Blockly.Blocks['set_interval'] = {
  // Block for setting the interval between the notes
  init: function() {
    var CHOICES = [['short','short'],['medium','medium'],['long','long']];
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(50);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_setInterval'))
        .appendTitle(new Blockly.FieldDropdown(CHOICES), 'S');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_setIntervalTooltip'));
  }
};

Blockly.Blocks['tune_play_c'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playC'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playCTooltip'));
  }
};

Blockly.Blocks['tune_play_d'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playD'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playDTooltip'));
  }
};

Blockly.Blocks['tune_play_e'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playE'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playETooltip'));
  }
};

Blockly.Blocks['tune_play_f'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playF'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playFooltip'));
  }
};

Blockly.Blocks['tune_play_g'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playG'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playGTooltip'));
  }
};

Blockly.Blocks['tune_play_a'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playA'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playATooltip'));
  }
};

Blockly.Blocks['tune_play_b'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playB'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playBTooltip'));
  }
};

Blockly.Blocks['tune_play_c_high'] = {
  // Block for playing a note
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_playCHigh'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_playCHighTooltip'));
  }
};

Blockly.Blocks['tune_if'] = {
  // Block for 'if' conditional if the interval is a certain value
  init: function() {
    var CHOICES = [['short','short'],['medium','medium'],['long','long']];
    this.setColour(210);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_ifInterval'))
        .appendTitle(new Blockly.FieldDropdown(CHOICES), 'INT');
    this.appendStatementInput('DO')
        .appendTitle(BlocklyApps.getMsg('Tune_doCode'));
    this.setTooltip(BlocklyApps.getMsg('Tune_ifTooltip'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['tune_ifElse'] = {
  // Block for 'if/else' conditional if there is a path.
  init: function() {
    var CHOICES = [['short','short'],['medium','medium'],['long','long']];
    this.setColour(210);
    this.appendDummyInput()
        .appendTitle(BlocklyApps.getMsg('Tune_ifInterval'))
        .appendTitle(new Blockly.FieldDropdown(CHOICES), 'INT');
    this.appendStatementInput('DO')
        .appendTitle(BlocklyApps.getMsg('Tune_doCode'));
    this.appendStatementInput('ELSE')
        .appendTitle(BlocklyApps.getMsg('Tune_elseCode'));
    this.setTooltip(BlocklyApps.getMsg('Tune_ifelseTooltip'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['tune_forever'] = {
  // Do forever loop.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Repeat');
    this.setColour(120);
    this.appendDummyInput()
    .appendTitle(BlocklyApps.getMsg('Tune_repeatUntil'));
    //        .appendTitle(new Blockly.FieldImage(Tune.SKIN.marker, 12, 16));
    this.appendStatementInput('DO')
        .appendTitle(BlocklyApps.getMsg('Tune_doCode'));
    this.setPreviousStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_whileTooltip'));
  }
};

Blockly.Blocks['tune_times'] = {
  // Do N times
  init: function() {
    var CHOICES = [['2','2'],['3','3'],['4','4']];
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Repeat');
    this.setColour(120);
    this.appendDummyInput()
    .appendTitle(BlocklyApps.getMsg('Tune_repeatTimes'))
    .appendTitle(new Blockly.FieldDropdown(CHOICES), 'N');
    //        .appendTitle(new Blockly.FieldImage(Tune.SKIN.marker, 12, 16));
    this.appendStatementInput('DO')
        .appendTitle(BlocklyApps.getMsg('Tune_doCode'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Tune_repeatTimesTooltip'));
  }
};

/**
 * Create an event block of the given type for a component with the given
 * instance name. eventType is one of the "events" objects in a typeJsonString
 * passed to Blockly.Component.add.
 */
Blockly.Blocks['button_click'] = {
  // Initializes an event BlocklyBlock
  // This is called by the BlocklyBlock constructor where its type field is set to, e.g., 'Button1_Click'
  init: function() {
    this.category = 'Component',
    this.blockType = 'event',
    this.helpUrl = function() {
	var mode = this.typeName;
	return Blockly.ComponentBlock.EVENTS_HELPURLS[mode];
      },
    this.instanceName = 'PlayButton';
    this.eventType = 'Click';
    //    this.setColour(Blockly.CONTROL_CATEGORY_HUE);
    this.setColour(380);
    this.appendDummyInput().appendTitle('when PlayButton clicked')
    //    .appendTitle('.' + this.eventType.name);
    this.appendStatementInput("DO").appendTitle('do');
    //    Blockly.Language.setTooltip(this, eventType.description);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
  }
};
