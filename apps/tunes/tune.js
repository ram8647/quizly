/**
 * Quizly/apps/tune derived and adapted from Blockly/apps/maze
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
 * @fileoverview JavaScript for Quizly's Tune application.
 * @author fraser@google.com (Neil Fraser)
 * @author ram8648@gmail.com (Ralph Morelli)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Tune = {};


var PACKAGE_URL = 'http://appinventor.cs.trincoll.edu/csp/tunebuilder/package.php';

// Supported languages.
//BlocklyApps.LANGUAGES = ['br', 'ca', 'cs', 'da', 'de', 'el', 'en',
//    'es', 'eu', 'fr', 'gl', 'hu', 'ia', 'it', 'ko', 'lv', 'mk', 'ms',
//    'nl', 'pl', 'pms', 'pt', 'ru', 'sk', 'sr', 'sv', 'sw', 'th', 'tr',
//    'uk', 'vi', 'zh-hans', 'zh-hant'];
BlocklyApps.LANGUAGES = ['en'];
BlocklyApps.LANG = BlocklyApps.getLang();

document.write('<script type="text/javascript" src="generated/' +
               BlocklyApps.LANG + '.js"></script>\n');

// The set of 10 puzzles
Tune.MAX_LEVEL = 10;
Tune.puzzles = [ 
   [],                                    // 0. Dummy entry
   ['noteC', 'noteG'],                    // 1. 2 notes
   ['noteA', 'noteC', 'noteE', 'noteG'],  // 2. My dog has fleas
   ['noteC', 'noteC', 'noteC'],           // 3. Repeat 3 times (2 blocks)
                                          //   4. Repeat 4 times (3 blocks)
   ['noteC', 'noteE', 'noteC', 'noteE', 'noteC', 'noteE','noteG'],
                                          // 5. 6 blocks, 3 repeats
   ['noteC', 'noteG', 'noteE', 'noteG', 'noteE', 'noteG', 'noteE', 'noteG', 'noteE', 'noteC'], 
                                          // 6. Two repeat loops in succession
   ['noteC', 'noteE', 'noteE','noteC', 'noteE', 'noteE','noteCHigh','noteG', 'noteG','noteCHigh','noteG', 'noteG'],  
                                          // 7. Same as 6 except repeated twice -- nested repeats
   ['noteC', 'noteE', 'noteE','noteC', 'noteE', 'noteE','noteCHigh','noteG', 'noteG','noteCHigh','noteG', 'noteG',
    'noteC', 'noteE', 'noteE','noteC', 'noteE', 'noteE','noteCHigh','noteG', 'noteG','noteCHigh','noteG', 'noteG'],  
                                         // 8. Same as 7 with interval changes included
   ['noteC', 'noteE', 'noteE','noteC', 'noteE', 'noteE','noteCHigh','noteG', 'noteG','noteCHigh','noteG', 'noteG',
    'short', 'noteC', 'noteE', 'noteE','noteC', 'noteE', 'noteE','noteCHigh','noteG', 'noteG','noteCHigh','noteG', 'noteG'],  
                                         // 9.  Uses if/else to alternate C-E-G slow then fast in a loop.               
   ["noteC", "noteE", "noteG", "short", "noteC", "noteE", "noteG", "medium", "noteC", "noteE", "noteG", "short", "noteC", "noteE", "noteG", "medium", "noteC"],

   [],  // 10. Top level -- make your own tune and package it.
  ]; 
Tune.puzzle = [];          // The current puzzle tune, destructed when played
Tune.puzzleTimer = null;   // Timer for playing the puzzle tune
Tune.notes = [];           // The user's tune, destructed when played
Tune.notesEval = [];       // Copy of the user's notes for testing
Tune.notesTimer = null;    // Timer for playing the user's tune

Tune.IS_PUZZLE_TUNE = false; // Used as arguments to Tune.playNotes()
Tune.IS_USER_TUNE = true;

Tune.TIMER_CYCLE = 50;     // The fixed rate at which the clock ticks
Tune.FLASH_CYCLE = 100;    // The fixed rate at which keys flash visibly
Tune.TIMER_SHORT = 300;    // Three fixed note-playing rates
Tune.TIMER_INTERVAL_SHORT = 'short';
Tune.TIMER_LONG = 900;
Tune.TIMER_INTERVAL_LONG = 'long';
Tune.TIMER_MEDIUM = 600;
Tune.TIMER_INTERVAL_MEDIUM = 'medium';

Tune.Timer_interval = Tune.TIMER_MEDIUM;    // The variable rate at which notes are played

// Interval used while interpreting Javascript code.
// Intervals are assigned by set_interval and tested by if/else_interval.
Tune.Codegen_interval = Tune.TIMER_MEDIUM;  
                         

Tune.Time = 0;             // Time advances by TIMER_CYCLE on each Timer cycle.
                          // Note events occur when Time -  TimePrevNote == Timer_interval
Tune.TimePrevNote = 0;    // Time the previous note was played.
Tune.LastNotePlayed;


Tune.noteMap = { 'noteC':'3c.wav', 'noteD':'3d.wav', 'noteE':'3e.wav','noteF':'3f.wav',
                 'noteG':'3g.wav','noteA':'3a.wav', 'noteB':'3b.wav', 'noteCHigh':'3chigh.wav', 
                 'medium':Tune.TIMER_INTERVAL_MEDIUM, 
                 'short':Tune.TIMER_INTERVAL_SHORT, 
                 'long':Tune.TIMER_INTERVAL_LONG, 
                 'noteRest':'3rest.wav'};

Tune.IntervalMap = { 'short': Tune.TIMER_SHORT, 'medium': Tune.TIMER_MEDIUM, 'long': Tune.TIMER_LONG};

// Get the current level from the Url
Tune.LEVEL = BlocklyApps.getNumberParamFromUrl('level', 1, Tune.MAX_LEVEL);
Tune.MAX_BLOCKS = [undefined, // Level 0.
    Infinity, Infinity, 3, 5, 6, 9, 10, 11, 9, 21][Tune.LEVEL];
/**
 * Outcomes of playing the user's tune -- does it match the puzzle tune
 */
Tune.ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  FAILURE: -1,
  TIMEOUT: 2,
  ERROR: -2
};

/**
 * Result of last execution.
 */
Tune.result = Tune.ResultType.UNSET;

/**
 * PIDs of animation tasks currently executing.
 */
//Tune.pidList = [];

/**
 * Initialize Blockly and the tune app.  Called on page load.
 */
Tune.init = function() {
  // Measure the height of arrow characters.
  // Firefox on Vista creates enormously high arrows (80px) for no reason.
  // TODO: Detect if arrow is printed, or Unicode square is printed.
  var textElement = document.getElementById('arrowTest');
  var height = textElement.getBBox().height;
  Tune.addArrows = height < Blockly.BlockSvg.MIN_BLOCK_Y;
  var svg = textElement.ownerSVGElement
  svg.parentNode.removeChild(svg);

  BlocklyApps.init();

  var rtl = BlocklyApps.isRtl();
  var toolbox = document.getElementById('toolbox');
  Blockly.inject(document.getElementById('blockly'),
      {path: '../../',
       maxBlocks: Tune.MAX_BLOCKS,
       rtl: rtl,
       toolbox: toolbox,
       trashcan: true});
  Blockly.loadAudio_(['apps/tunes/3c.wav', 'apps/tunes/3c.wav'], 'noteC');
  Blockly.loadAudio_(['apps/tunes/3d.wav', 'apps/tunes/3d.wav'], 'noteD');
  Blockly.loadAudio_(['apps/tunes/3e.wav', 'apps/tunes/3e.wav'], 'noteE');
  Blockly.loadAudio_(['apps/tunes/3f.wav', 'apps/tunes/3f.wav'], 'noteF');
  Blockly.loadAudio_(['apps/tunes/3g.wav', 'apps/tunes/3g.wav'], 'noteG');
  Blockly.loadAudio_(['apps/tunes/3a.wav', 'apps/tunes/3a.wav'], 'noteA');
  Blockly.loadAudio_(['apps/tunes/3b.wav', 'apps/tunes/3b.wav'], 'noteB');
  Blockly.loadAudio_(['apps/tunes/3chigh.wav', 'apps/tunes/3chigh.wav'], 'noteCHigh');

  var blocklyDiv = document.getElementById('blockly');
  var visualization = document.getElementById('visualization');
  var onresize = function(e) {
    var top = visualization.offsetTop;
    blocklyDiv.style.top = Math.max(10, top - window.scrollY) + 'px';
    blocklyDiv.style.left = rtl ? '10px' : '420px';
    blocklyDiv.style.width = (window.innerWidth - 440) + 'px';
  };
  window.addEventListener('scroll', function() {
      onresize();
      Blockly.fireUiEvent(window, 'resize');
    });
  window.addEventListener('resize', onresize);
  onresize();
  Blockly.fireUiEvent(window, 'resize');

  var defaultXml = '';
  if (Tune.LEVEL < 6) {
    defaultXml =  '<xml>' +
	'<block type="button_click" x="69" y="143"><statement name="DO"><block type="tune_play_c"></block></statement></block>' +
	'</xml>';
  } else if (Tune.LEVEL < 9) {
    defaultXml =  '<xml>' +
	'<block type="button_click" x="69" y="143"><statement name="DO"><block type="tune_play_note"></block></statement></block>' +
	'</xml>';
  } else if (Tune.LEVEL == 9) {
    defaultXml =  '<xml>' +
	'<block type="button_click" x="69" y="143"><statement name="DO"><block type="tune_times"><title name="N">2</title></block></statement></block>' +
	'</xml>';
  } else {
    defaultXml =  '<xml>' +
	'<block type="button_click" x="69" y="143"><statement name="DO"></statement></block>' +
	'</xml>';
  }
  BlocklyApps.loadBlocks(defaultXml);

  Tune.reset(true);   // Presents the puzzle

  Blockly.addChangeListener(function() {Tune.updateCapacity()});

  document.body.addEventListener('mousemove', Tune.updatePegSpin_, true);

  BlocklyApps.bindClick('runButton', Tune.runButtonClick);
  BlocklyApps.bindClick('resetButton', Tune.resetButtonClick);
  BlocklyApps.bindClick('packageButton', Tune.packageButtonClick);

  if (Tune.LEVEL == 1) {
    // Make connecting blocks easier for beginners.
    Blockly.SNAP_RADIUS *= 2;
  }
  if (Tune.LEVEL == Tune.MAX_LEVEL) {
    // MAX_LEVEL gets an introductory modal dialog.
    
    var packageBtn = document.getElementById('packageButton');
    packageBtn.style.display = 'inline';

    var content = document.getElementById('dialogLastLevel');
    var style = {
      width: '30%',
      left: '35%',
      top: '12em'
    };
    BlocklyApps.showDialog(content, null, false, true, style,
        BlocklyApps.stopDialogKeyDown);
    BlocklyApps.startDialogKeyDown();
  } else {
    // NOTE: Removing this delay; user has to dismiss instructions
    // All other levels get interactive help.  But wait 5 seconds for the
    // user to think a bit before they are told what to do.
    //    window.setTimeout(function() {
    //      Blockly.addChangeListener(function() {Tune.levelHelp()});
    //      Tune.levelHelp();
    //    }, 5000);
  }

  // Lazy-load the syntax-highlighting.
  window.setTimeout(BlocklyApps.importPrettify, 1);
};

if (window.location.pathname.match(/readonly.html$/)) {
  window.addEventListener('load', BlocklyApps.initReadonly);
} else {
  window.addEventListener('load', Tune.init);
}

/**
 * When the workspace changes, update the help as needed.
 */
Tune.levelHelp = function() {
  if (Blockly.Block.dragMode_ != 0) {
    // Don't change helps during drags.
    return;
  } else if (Tune.result == Tune.ResultType.SUCCESS) {
    // The user has already won.  They are just playing around.
    return;
  }
  var userBlocks = Blockly.Xml.domToText(
      Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
  var toolbar = Blockly.mainWorkspace.flyout_.workspace_.getTopBlocks(true);
  var content = null;
  var origin = null;
  var style = null;
  if (Tune.LEVEL == 1) {
    if (Blockly.mainWorkspace.getAllBlocks().length < 3) {
      content = document.getElementById('dialogHelpStack');
      style = {width: '370px', top: '120px'};
      style[Blockly.RTL ? 'right' : 'left'] = '50px';
      //      style[Blockly.RTL ? 'right' : 'left'] = '215px';
      origin = toolbar[2].getSvgRoot();
    } else {
      var topBlocks = Blockly.mainWorkspace.getTopBlocks(true)
      if (topBlocks.length > 1) {
        content = document.getElementById('dialogHelpOneTopBlock');
        style = {width: '360px', top: '120px'};
        style[Blockly.RTL ? 'right' : 'left'] = '225px';
        origin = topBlocks[0].getSvgRoot();
      } else if (Tune.result == Tune.ResultType.UNSET) {
        // Show run help dialog.
        content = document.getElementById('dialogHelpRun');
        style = {width: '360px', top: '300px'};
        style[Blockly.RTL ? 'right' : 'left'] = '400px';
        origin = document.getElementById('runButton');
      }
    }
  } else if (Tune.LEVEL == 2) {
    if (Tune.result != Tune.ResultType.UNSET &&
        document.getElementById('runButton').style.display == 'none') {
      content = document.getElementById('dialogHelpReset');
      style = {width: '360px', top: '410px'};
      style[Blockly.RTL ? 'right' : 'left'] = '400px';
      origin = document.getElementById('resetButton');
    }
  } else if (Tune.LEVEL == 3) {
    if (userBlocks.indexOf('tune_times') == -1) {
      if (Blockly.mainWorkspace.remainingCapacity() == 0) {
        content = document.getElementById('dialogHelpCapacity');
        style = {width: '430px', top: '310px'};
        style[Blockly.RTL ? 'right' : 'left'] = '50px';
        origin = document.getElementById('capacityBubble');
      } else {
        content = document.getElementById('dialogHelpRepeat');
        style = {width: '360px', top: '575px'};
        style[Blockly.RTL ? 'right' : 'left'] = '425px';
        origin = toolbar[3].getSvgRoot();
      }
    }
  } else if (Tune.LEVEL == 4) {
    if (Blockly.mainWorkspace.remainingCapacity() == 0 &&
        (userBlocks.indexOf('tune_times') == -1 ||
         Blockly.mainWorkspace.getTopBlocks(false).length > 1)) {
      content = document.getElementById('dialogHelpCapacity');
      style = {width: '430px', top: '310px'};
      style[Blockly.RTL ? 'right' : 'left'] = '50px';
      origin = document.getElementById('capacityBubble');
    } else {
      var showHelp = true;
      // Only show help if there is not a loop with two nested blocks.
      var blocks = Blockly.mainWorkspace.getAllBlocks();
      for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        if (block.type != 'tune_times') {
          continue;
        }
        var j = 0;
        while (block) {
          var kids = block.getChildren();
          block = kids.length ? kids[0] : null;
          j++;
        }
        if (j > 2) {
          showHelp = false;
          break;
        }
      }
      if (showHelp) {
        content = document.getElementById('dialogHelpRepeatMany');
        style = {width: '360px', top: '575px'};
        style[Blockly.RTL ? 'right' : 'left'] = '425px';
        origin = toolbar[3].getSvgRoot();
      }
    }
  } else if (Tune.LEVEL == 6) {
    if (userBlocks.indexOf('play_note') == -1) {
      content = document.getElementById('dialogHelpGenericNote');
      style = {width: '370px', top: '120px'};
      style[Blockly.RTL ? 'right' : 'left'] = '425px';
      origin = toolbar[1].getSvgRoot();
    }
  } else if (Tune.LEVEL == 7) {
    if (userBlocks.indexOf('tune_times') == -1) {
      content = document.getElementById('dialogHelpNestedRepeat');
      style = {width: '370px', top: '220px'};
      style[Blockly.RTL ? 'right' : 'left'] = '425px';
      origin = toolbar[1].getSvgRoot();
    }
  } else if (Tune.LEVEL == 8) {
    if (userBlocks.indexOf('set_interval') == -1) {
      content = document.getElementById('dialogHelpInterval');
      style = {width: '370px', top: '250px'};
      style[Blockly.RTL ? 'right' : 'left'] = '425px';
      origin = toolbar[1].getSvgRoot();
    }
  } else if (Tune.LEVEL == 9) {
     if (userBlocks.indexOf('tune_if') == -1) {
       content = document.getElementById('dialogHelpIfElse');
       //       content = document.getElementById('dialogHelpIf');
       style = {width: '360px', top: '375px'};
       style[Blockly.RTL ? 'right' : 'left'] = '425px';
       origin = toolbar[3].getSvgRoot();
     }
  }

  if (content) {
    if (content.parentNode != document.getElementById('dialog')) {
      BlocklyApps.showDialog(content, origin, true, false, style, null);
    }
  } else {
    BlocklyApps.hideDialog(false);
  }
};

/**
 * Save the blocks for a one-time reload.
 */
Tune.saveToStorage = function() {
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var text = Blockly.Xml.domToText(xml);
  window.sessionStorage.loadOnceBlocks = text;
};

/**
 * Reset the notesTimer to clear out any unplayed notes. Then play the
 *  notes in the puzzle for this level
 * @param {boolean} first True if an opening animation is to be played.
 */
Tune.reset = function(first) {
  if (Tune.LEVEL != Tune.MAX_LEVEL) {
   document.getElementById('runButton').style.display = 'none';
   document.getElementById('resetButton').style.display = 'inline';
  } else {
   document.getElementById('runButton').style.display = 'inline';
   document.getElementById('resetButton').style.display = 'none';
  }
   clearInterval(Tune.notesTimer);

   if (Tune.LEVEL < Tune.MAX_LEVEL) {
     var content = document.getElementById('dialogIntroduceThePuzzle');
     var style = {left: '400px', top: '400px'};

     var redo = document.createElement('button');
     var buttonDiv = document.getElementById('dialogIntroduceButtons');
     buttonDiv.textContent = '';
     redo.className = 'secondary';
     redo.appendChild(document.createTextNode(BlocklyApps.getMsg('Tune_dialogRedo')));
     buttonDiv.appendChild(redo);

     var ok = document.createElement('button');
     ok.className = 'ok';
     ok.appendChild(
	 document.createTextNode(BlocklyApps.getMsg('dialogOk')));
     buttonDiv.appendChild(ok);

     // Show the IntroducePuzzle dialog
     BlocklyApps.showDialog(content, null, false, true, style,
	 function() {
	   document.body.removeEventListener('keydown',
	       Tune.congratulationsKeyDown_, true);
	   });
     document.body.addEventListener('keydown',
	 Tune.congratulationsKeyDown_, true);

     for (var i=0; i < Tune.puzzles[Tune.LEVEL].length; i++) 
       Tune.puzzle.push(Tune.puzzles[Tune.LEVEL][i]);

     Tune.Time = 0;
     Tune.TimePrevNote = 0;
     Tune.Timer_interval = Tune.TIMER_MEDIUM;

     // Play the puzzle for the user
     Tune.notesTimer = setInterval(function() {	
 Tune.playNotes(Tune.puzzle, Tune.IS_PUZZLE_TUNE);
       }, Tune.TIMER_CYCLE);
   }
};

/**
 * Click the run button.  Start the program.
 */
Tune.runButtonClick = function() {
  BlocklyApps.hideDialog(false);
  document.getElementById('runButton').style.display = 'none';
  document.getElementById('resetButton').style.display = 'inline';

  Tune.Time = 0;
  Tune.TimePrevNote = 0;

  // Only allow a single top block on level 1.
  //  if (Tune.LEVEL == 1 && Blockly.mainWorkspace.getTopBlocks().length > 1) {
  var content = null;
  var origin = null;
  var style = null;
  var topBlocks = Blockly.mainWorkspace.getTopBlocks(true)
  if (topBlocks.length > 1) {
    content = document.getElementById('dialogHelpOneTopBlock');
    style = {width: '360px', top: '120px'};
    style[Blockly.RTL ? 'right' : 'left'] = '225px';
    origin = topBlocks[0].getSvgRoot();
    BlocklyApps.showDialog(content, origin, true, false, style, null);
    return;
  }
  if (Tune.LEVEL < Tune.MAX_LEVEL) {
    var runButton = document.getElementById('runButton');
    var resetButton = document.getElementById('resetButton');
    runButton.style.display = 'none';
    resetButton.style.display = 'inline';
  }
  Blockly.mainWorkspace.traceOn(true);
  Tune.execute();
};

/**
 * Updates the document's 'capacity' element with a message
 * indicating how many more blocks are permitted.  The capacity
 * is retrieved from Blockly.mainWorkspace.remainingCapacity().
 */
Tune.updateCapacity = function() {
  var cap = Blockly.mainWorkspace.remainingCapacity();
  var p = document.getElementById('capacity');
  if (cap == Infinity) {
    p.style.display = 'none';
  } else {
    p.style.display = 'inline';
    p.innerHTML = '';
    cap = Number(cap);
    var capSpan = document.createElement('span');
    capSpan.className = 'capacityNumber';
    capSpan.appendChild(document.createTextNode(cap));
    if (cap == 0) {
      var msg = BlocklyApps.getMsg('Tune_capacity0');
    } else if (cap == 1) {
      var msg = BlocklyApps.getMsg('Tune_capacity1');
    } else {
      var msg = BlocklyApps.getMsg('Tune_capacity2');
    }
    var parts = msg.split(/%\d/);
    for (var i = 0; i < parts.length; i++) {
      p.appendChild(document.createTextNode(parts[i]));
      if (i != parts.length - 1) {
        p.appendChild(capSpan.cloneNode(true));
      }
    }
  }
};

/**
 * Click the reset button.  Reset the maze.
 */
Tune.resetButtonClick = function() {
  document.getElementById('runButton').style.display = 'inline';
  document.getElementById('resetButton').style.display = 'none';
  Blockly.mainWorkspace.traceOn(false);
  Tune.reset(false);

  // Dispensing with this; user dismisses dialog
  // Show help dialog but wait 3 seconds
//   window.setTimeout(function() {
//     Blockly.addChangeListener(function() {Tune.levelHelp()});
//     Tune.levelHelp();
//   }, 2000);
};

Tune.okButtonClicked = function() {
  BlocklyApps.hideDialog();
  window.setTimeout(function() {
    Blockly.addChangeListener(function() {Tune.levelHelp()});
    Tune.levelHelp();
  }, 2000);
};


/**
 * Called from the regrets dialog to cancel the reset
 * and allow the user to go directly to the workspace.
 */
Tune.cancelReset = function() {
  BlocklyApps.hideDialog();
  document.getElementById('runButton').style.display = 'inline';
  document.getElementById('resetButton').style.display = 'none';
  Blockly.mainWorkspace.traceOn(false);

  // Show help dialog but wait 3 seconds
  window.setTimeout(function() {
    Blockly.addChangeListener(function() {Tune.levelHelp()});
    Tune.levelHelp();
  }, 3000);
};

/**
 * Packages into App Inventor code. There are two pieces of code that must be
 *  passed to the server. The first is the blocks that define the global sounds 
 *  variable, which is just the list of sounds the app plays. These will be inserted into 
 *  a global list variable named 'sounds'.  The second is the yail code corresponding to
 *  that list. 
 *
 * The App Inventor app plays all the sounds in the 'sounds' list when its 
 *  button is clicked. 
 *
 * Server: http://appinventor.cs.trincoll.edu/csp/hourofcode/builder/package.php
 */
Tune.packageButtonClick = function() {
  var code = Blockly.JavaScript.workspaceToCode();
  Tune.notes = [];
  Tune.Codegen_interval = Tune.TIMER_MEDIUM;
  Tune.Timer_interval = Tune.TIMER_MEDIUM;
  eval(code);

  // Initialize the blocks for a global list declaration.
  var appinventorBlks = 
    '<block type="global_declaration" inline="false" x="320" y="-36">' +
    '\n <title name="NAME">sounds</title>' + 
    '\n <value name="VALUE">' +
    '\n  <block type="lists_create_with" inline="false">' +
    '\n    <mutation items="' + Tune.notes.length + '"></mutation>';

  // Initialize a YAIL def of the sounds list.
  var yailCode = '(def sounds (call-yail-primitive make-yail-list (*list-for-runtime* ';  
  var yailAny = "'(";
    
  // For each note in the tune, add appropriate blocks and YAIL code.
  for (var i=0; i < Tune.notes.length; i++)  {
    yailCode += '"' + Tune.noteMap[Tune.notes[i]] + '" ';
    yailAny += 'any ';
    appinventorBlks += 
      '\n<value name="ADD' + i + '">' + 
      '\n<block type="text">' +
      '\n<title name="TEXT">' + Tune.noteMap[Tune.notes[i]] + '</title>' +
      '\n</block>' +
      '\n</value>';
  }

  // Finish up the code snippets
  yailAny += ') ';
  yailCode += ') ';
  yailCode += yailAny;
  yailCode += '"make a list"))';
  appinventorBlks += '\n</block> \n</value> \n</block>';

  //  alert(appinventorBlks + ' ' + yailCode);
  var packageBtn = document.getElementById('packageButton');
  packageBtn.innerText = 'Packaging...';
  alert('Packaging your app will take a minute. Click Ok to start.');

  // Create an HTTP post request
  var mypostrequest = new XMLHttpRequest();
  
  // Function to handle result of HTTP request
  mypostrequest.onreadystatechange = function() {
    if (mypostrequest.readyState == 4) {
      if (mypostrequest.status==200 || window.location.href.indexOf("http")==-1) {
	packageBtn.innerText = 'Package';
	var popup = open("","QR Popup", "width=250, height=250, left=800,top=300,resizable=no");
	popup.document.title="Scan your app";
	var tt = popup.document.createElement("tt");
	tt.style.fontSize="5px";
	tt.innerHTML = mypostrequest.responseText;
        popup.document.body.appendChild(tt);
      }  else {
        alert("An error has occured making the request")
      }
    }
  };
  
  // Send the request to the server
  var parameters="blocks=" + encodeURIComponent(appinventorBlks) + "&yail=" + encodeURIComponent(yailCode);
  mypostrequest.open("POST", PACKAGE_URL, true);
  mypostrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  mypostrequest.send(parameters);
};


Tune.httpGet = function(theUrl) {
  var xmlHttp = null;

  xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false );
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

/**
 *  Plays the next note from the Tune.notes array.
 *  @param notesArray an array of notes either Tune.notes or Tune.puzzle
 *  @param isUserTuen a boolean indicating user's tune or puzzle tune
 */
Tune.playNotes = function(notesArray, isUserTune) {
  Tune.Time += Tune.TIMER_CYCLE;   // Update the time
  console.log("Play notes " + Tune.Time + " " + notesArray );

  // Flash the keys
  if (Tune.Time % Tune.FLASH_CYCLE == 0 || notesArray.length == 0) 
    Tune.resetKeys();

  // If the notes are all played, stop the clock and exit
  if (notesArray.length == 0) {
    clearInterval(Tune.notesTimer);

    // Redisplay the PlayButton and enable dialog buttons
    document.getElementById('runButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'none';

    // Test the user's tune if we're not at MAX_LEVEL, if userTune
    if (isUserTune && Tune.LEVEL < Tune.MAX_LEVEL)  {
      var okBtn = document.getElementById('dialogIntroduceButtons').getElementsByClassName('ok')[0];
      var redoBtn = document.getElementById('dialogIntroduceButtons').getElementsByClassName('secondary')[0];
      if (redoBtn) {
	redoBtn.addEventListener('click', Tune.resetButtonClick, true);
	redoBtn.addEventListener('touchend', Tune.resetButtonClick, true);
      }
      if (okBtn) {
	okBtn.addEventListener('click', Tune.okButtonClicked, true);
	okBtn.addEventListener('touchend', Tune.okButtonClicked, true);
      }

      Tune.testUsersTune();    
    }

    return;  // We're done
  }

  Tune.note = notesArray[0];   // Check the next note

  // Is it an 'interval' setter, consume the note and set the interval timer
  if (Tune.note.indexOf('note') == -1) {
    notesArray.shift();      
    Tune.Timer_interval = Tune.IntervalMap[Tune.note];
  } else {

    // If the interval is right, consume and play the note and set TimePrevNote
    if (Tune.Time - Tune.TimePrevNote ==  Tune.Timer_interval) {
      notesArray.shift();
      Tune.TimePrevNote = Tune.Time;
      console.log("Playing  " + Tune.note);
      Tune.LastNotePlayed = Tune.note;
      if (Tune.note.indexOf('noteRest') == -1) {
        Blockly.playAudio(Tune.note);   
        var dot = document.getElementById(Tune.note);
        if (dot)
          dot.style.display='inline';
      }
    }
  }
};

/**
 *  Resets the red dot of the note that has just been played..
 *   Some 'notes' are 'interval' setters and so are skipped.
 */
Tune.resetKeys = function() {
  console.log("Resetting key " + Tune.note);
  if (Tune.LastNotePlayed && Tune.LastNotePlayed.indexOf('note') == 0 
      && Tune.LastNotePlayed.indexOf('noteRest') == -1) {
    var dot = document.getElementById(Tune.LastNotePlayed);
    dot.style.display='none';
  }
};

/**
 * Execute the user's code -- i.e., play the notes.
 */
Tune.execute = function() {
  var code = Blockly.JavaScript.workspaceToCode();

  // 1. Eval the user's code. This will push notes onto Tune.notes.
  // 2. Clone the notes on Tune.notes.  
  // 3. Play the user's notes. This involves a timer. 
  // 4. When the timer is done, test the user's notes. See Tune.playNotes().
  // 5. If the user's notes match the puzzle, congratulate else send regrets.

  Tune.notes = [];
  Tune.Codegen_interval = Tune.TIMER_MEDIUM;
  Tune.Timer_interval = Tune.TIMER_MEDIUM;

  // This pushes the user's notes on Tune.notes
  eval(code);

  // A clone is used for testing because Tune.notes is destructed
  Tune.notesEval = Tune.notes.slice(0);  

  // Play the user's tune and test whether it is correct
  Tune.notesTimer = setInterval(function() {
      Tune.playNotes(Tune.notes, Tune.IS_USER_TUNE);
     }, Tune.TIMER_CYCLE);
};

/**
 * Returns true if each note of the user's tune matches each note
 *  of the puzzle
 */
Tune.testUsersTune = function() {
  var result = Tune.notesEval.length == Tune.puzzles[Tune.LEVEL].length;
   
  if (result) 
    for (var i=0; i < Tune.puzzles[Tune.LEVEL].length; i++)  {
      if (Tune.notesEval[i] != Tune.puzzles[Tune.LEVEL][i]) {
	result =  false;
	break;
      }
    }

  if (result == true) {
    Tune.congratulations();
  } else {
    Tune.regrets();
  }
};


/**
 * Congratulates the user for completing the level and offers to
 * direct them to the next level, if available.
 */
Tune.congratulations = function() {
  var content = document.getElementById('dialogDone');
  var buttonDiv = document.getElementById('dialogDoneButtons');
  buttonDiv.textContent = '';
  var style = {
    width: '40%',
    left: '30%',
    top: '5em'
  };
  if (Tune.LEVEL < Tune.MAX_LEVEL) {
    var text = BlocklyApps.getMsg('Tune_nextLevel')
        .replace('%1', Tune.LEVEL + 1);
    var cancel = document.createElement('button');
    cancel.appendChild(
        document.createTextNode(BlocklyApps.getMsg('dialogCancel')));
    cancel.addEventListener('click', BlocklyApps.hideDialog, true);
    cancel.addEventListener('touchend', BlocklyApps.hideDialog, true);
    buttonDiv.appendChild(cancel);

    var ok = document.createElement('button');
    ok.className = 'secondary';
    ok.appendChild(document.createTextNode(BlocklyApps.getMsg('dialogOk')));
    ok.addEventListener('click', Tune.nextLevel, true);
    ok.addEventListener('touchend', Tune.nextLevel, true);
    buttonDiv.appendChild(ok);

    BlocklyApps.showDialog(content, null, false, true, style,
        function() {
          document.body.removeEventListener('keydown',
              Tune.congratulationsKeyDown_, true);
          });
    document.body.addEventListener('keydown',
        Tune.congratulationsKeyDown_, true);

  } else {
    var text = BlocklyApps.getMsg('Tune_finalLevel');
    var ok = document.createElement('button');
    ok.className = 'secondary';
    ok.addEventListener('click', BlocklyApps.hideDialog, true);
    ok.addEventListener('touchend', BlocklyApps.hideDialog, true);
    ok.appendChild(document.createTextNode(BlocklyApps.getMsg('dialogOk')));
    buttonDiv.appendChild(ok);
    BlocklyApps.showDialog(content, null, false, true, style,
        BlocklyApps.stopDialogKeyDown);
    BlocklyApps.startDialogKeyDown();
  }
  document.getElementById('dialogDoneText').textContent = text;
};

/**
 * Informs the user that their tune is incorrect and lets 
 * them retry.
 */
Tune.regrets = function() {
  var content = document.getElementById('dialogDone');
  var buttonDiv = document.getElementById('dialogDoneButtons');
  buttonDiv.textContent = '';
  var style = {
    width: '40%',
    left: '30%',
    top: '5em'
  };
  var text = BlocklyApps.getMsg('Tune_regrets');

  var redo = document.createElement('button');
  redo.className = 'secondary';
  redo.appendChild(document.createTextNode(BlocklyApps.getMsg('Tune_dialogRedo')));
  redo.addEventListener('click', Tune.resetButtonClick, true);
  redo.addEventListener('touchend', Tune.resetButtonClick, true);
  buttonDiv.appendChild(redo);

  var ok = document.createElement('button');
  ok.appendChild(
      document.createTextNode(BlocklyApps.getMsg('dialogOk')));
  ok.addEventListener('click', BlocklyApps.hideDialog, true);
  ok.addEventListener('touchend', BlocklyApps.hideDialog, true);
  ok.className = 'ok';
  ok.addEventListener('click', Tune.cancelReset, true);
  ok.addEventListener('touchend', Tune.cancelReset, true);
  buttonDiv.appendChild(ok);
  
  BlocklyApps.showDialog(content, null, false, true, style,
      function() {
        document.body.removeEventListener('keydown',
            Tune.congratulationsKeyDown_, true);
        });
  document.body.addEventListener('keydown',
      Tune.congratulationsKeyDown_, true);
  document.getElementById('dialogDoneText').textContent = text;
};

/**
 * If the user preses enter, escape, or space, hide the dialog.
 * Enter and space move to the next level, escape does not.
 * @param {!Event} e Keyboard event.
 * @private
 */
Tune.congratulationsKeyDown_ = function(e) {
  if (e.keyCode == 13 ||
      e.keyCode == 27 ||
      e.keyCode == 32) {
    BlocklyApps.hideDialog(true);
    e.stopPropagation();
    e.preventDefault();
    if (e.keyCode != 27) {
      Tune.nextLevel();
    }
  }
};

/**
 * Go to the next level.
 */
Tune.nextLevel = function() {
  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname +
      '?lang=' + BlocklyApps.LANG + '&level=' + (Tune.LEVEL + 1) +
      '&skin=' + Tune.SKIN_ID;
};

