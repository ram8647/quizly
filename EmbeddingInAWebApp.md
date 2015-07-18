# Introduction #

As a descendant of [Blockly](http://blockly.googlecode.com), Quizly just [follows its approach](https://code.google.com/p/blockly/wiki/InjectingResizable) for injecting Blockly into a resizable 'iframe' in the _top-level_ or (_container_) page.

## In the Container Page ##

The following code snippet is inserted into the _top-level_ page. For example, for the [Makequiz](http://www.cs.trincoll.edu/~ram/quizly/makequiz.html) app, this snippet would be inserted into _makequiz.html_.

```
   <script>
     function blocklyLoaded(blockly) {
       // Called once Blockly is fully loaded.
       window.Blockly = blockly;
     }
   </script>
   <iframe style="width: 100%; height: 100%; border: 1px solid #ccc;" src="blockly.html"></iframe>
```

The _blocklyLoaded()_ function is called when Quizly finishes loading.  It installs Blockly on the top-level window.  It is where you could also perform any initializations of the Container window.

## In the Quizly IFrame ##

The Quizly iframe contains all of the source Javascript code (only some of which is shown here) plus the _initBlockly()_ function:

```
<script type="text/javascript" src="quizme-initblocklyeditor.js"></script>
<script type="text/javascript" src="quizme.js"></script>

<script>

  function initBlockly() {
    Blockly.inject(document.body,
        {path: './', toolbox: document.getElementById('toolbox')});

    // Let the top-level application know that Blockly is ready.
    // Do any Quizme initializations here.
 
    window.parent.blocklyLoaded(Blockly);
    if (window.parent.document.title == "Quiz Maker Utility")
      initQuizMaker('./');
    else
      initQuizme(undefined, './');
  }
</script>
```

The _initBlockly()_ function is called when the page finishes loading.  It notifies the parent (Container) window, and initializes the app.  As you can see here, the same iframe is used for both the Quizme app (which has _index.html_ as its container) and the _Makequiz_ app (which has _makequiz.html_ as its container).

Here's a [example](http://turing.cs.trincoll.edu/~ram/mobilecsp/lesson1-hellopurr/activity-1.9.html) that uses this setup.
