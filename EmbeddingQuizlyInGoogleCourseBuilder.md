# Introduction #

Quizly exercises can easily be incorporated into [GCB](https://code.google.com/p/course-builder/) as **lessons** and **activities**.  Here is a sample page from the [Mobile CSP](https://ram8647.appspot.com/mobileCSP/unit?unit=22&lesson=32) course.  (You may have to register to view it.)

This document shows how to create a GCB Quizly component, which can be used in GCB lessons.

A [a GCB component](https://code.google.com/p/course-builder/wiki/CreateComponents) is a schema that can be rendered on a web page. GCB has a nice GUI for creating and editing lessons.  The Quizly component lets you create lessons that consist of a Quizly interactive exercise.  Quizly automatically _grades_ the exercise, reporting to the user whether their solution was correct or not.

This document describes how to install the Quizly GCB component from downloaded archives.  For details on how components are structured, see the [GCB documentation](https://code.google.com/p/course-builder/).

# Details #

  * Create a directory named 'extensions/tags/quizly/'.  This directory must contain 'init.py' and a 'resources/' folder, which in turn contains the icon used by the component.
  * Copy the [quizly-gcb-component.zip](https://code.google.com/p/quizly/downloads/detail?name=quizly-gcb-component.zip&can=2&q=) file into the '/quizly' directory and unzip it.
  * Copy the [quizly-gcb-mmdd.tar file](https://drive.google.com/file/d/0B2IG3uhfSus-S3dnendSN0pZbUE) into 'assets/lib/' and untar it -- **tar xvzf quizly-gcb-mmdd.tar** -- to create the quizly/ folder, assets/lib/quizly/.
  * Update your your GCB instance.

That's it!