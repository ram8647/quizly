# Introduction #

The [Makequiz](http://appinventor.cs.trincoll.edu/csp/quizly/makequiz.html) app helps the user create an App Inventor quiz.  The app leads the user through a number of steps that lead to creation of a JSON object that is displayed in an alert popup.  The JSON text can be copied and pasted into _quizzes.json_, the file that is used for input by the [Quizly](http://www.cs.trincoll.edu/~ram/quizly/) app.

## Create ##

  * Make up a unique name for the quiz -- "My Quiz". This name will be parsed into an index that is used to identify the quiz to the app.
  * Select the _type_ of quiz.  Quizzes are typed according to the way their answers are determined:
    * Expression evaluation -- an arithmetic or relation block is displayed and the user determines its value; or an incomplete expression block is displayed and the user completes it to make it true.
    * Statement evaluation -- the user puts together one or more statements in the workspace to solve the problem.
    * Function definition -- the user's function definition is run against a set of test inputs.
    * Procedure definition  -- the user's procedure definition is run against a set of random variable assignments.

  * Provide a brief description of the quiz.
  * Type in the quiz question. This can accept HTML formatting.
  * Type in hints, using HTML formatting.
  * Select which _built-in blocks_ (e.g., math, logic, etc.) should be included in the quiz's workspace.
  * Select which _component blocks_ (e.g., Button, Sound) should be included in the workspace.

## Quiz ##
  * Set up the workspace as it will be presented to the student. For example, you can put in some of the blocks involved in the solution.

## Solution ##
  * This will save the problem workspace.  Here is where you write the correct solution to the quiz problem.

## Preview ##
  * The workspace will be set up and the quiz question will be presented.  Put together a valid or invalid solution to the problem and click the _Submit_ button.  Your solution will be evaluated and feedback will be provided.  This step can be repeated as often as necessary to determine that the quiz is correctly constructed.

## JSON ##
  * Click the _JSON_ button to display the quiz's code in an pop-up window.  Copy and save this text.

## Publishing the Quiz ##
  * To present the quiz to a student, paste the copied JSON code into the _quizly/quizzes.json_ file then reload the _Quizly_ app and test the quiz.

That's it. Have fun and report any problems to the [issues list](https://code.google.com/p/quizly/issues/list).