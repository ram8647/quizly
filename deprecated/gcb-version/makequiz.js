/**
 * Makequiz.js  -- UI stuff for the makequiz app.
 *
 * Copyright 2013 R. Morelli
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
 * @fileoverview JavaScript for makequiz UI.
 * @author ram8647@gmail.com (Ralph Morelli)
 */

/**
 * List of tab names.
 * @private
 */
var TABS_ = ['create', 'quiz', 'solution', 'preview', 'json'];

var selected = 'create';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} id ID of tab clicked.
 */
function tabClick(id) {

  // Deselect all tabs and hide all panes.
  for (var x in TABS_) {
    document.getElementById('tab_' + TABS_[x]).className = 'taboff';
  }

  // Select the active tab.
  selected = id.replace('tab_', '');
  document.getElementById(id).className = 'tabon';

  if (id == "tab_create") {
    setupInfo();
  } else if (id == "tab_quiz") {
    setupProblemBlocks();
  } else if (id == "tab_solution") {
    setupSolutionBlocks();
  } else if (id == "tab_preview") {
    previewTheQuiz();
  } else if (id == "tab_json") {
    generateJSON();
  }
}

// Script to support custom alert box available through this top-level window.
// http://snipplr.com/view/46677/custom-alert-box-formatted-and-controlled-by-jscss/
      
var ALERT_TITLE = "Copy and paste the following JSON string into quizzes.json.";
var ALERT_BUTTON_TEXT = "Ok";
      
if (document.getElementById) {
  window.alert = function (txt) {
    createCustomAlert(txt);
  }
}
      
function showCode() {
  // Generate JavaScript code and display it.
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  $("#js_div").html(code);
}
      
function createCustomAlert(txt, title, btn_title) {
  if (!title)
    title = ALERT_TITLE;
  if (!btn_title)
    btn_title = ALERT_BUTTON_TEXT;
  var d = document;
        
  if (d.getElementById("modalContainer")) return;
        
  var mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
  mObj.id = "modalContainer";
  mObj.style.height = d.documentElement.scrollHeight + "px";
        
  var alertObj = mObj.appendChild(d.createElement("div"));
  alertObj.id = "alertBox";
  if (d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
  alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth) / 2 + "px";
  alertObj.style.visiblity = "visible";
        
  var h1 = alertObj.appendChild(d.createElement("h1"));
  h1.appendChild(d.createTextNode(title));
        
  var msg = alertObj.appendChild(d.createElement("p"));
  msg.appendChild(d.createTextNode(txt));
  //  msg.innerHTML = txt;
        
  var btn = alertObj.appendChild(d.createElement("a"));
  btn.id = "closeBtn";
  btn.appendChild(d.createTextNode(btn_title));
  btn.href = "#";
  btn.focus();
  btn.onclick = function () {
    removeCustomAlert();
    return false;
  }
          
  alertObj.style.display = "block";
}
      
function removeCustomAlert() {
  document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}


