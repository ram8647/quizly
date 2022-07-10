#!/bin/bash -f
#
# run this command from the appinventor directory
# This script starts up the local app inventor server
# and also the local build server, and creates logs for both servers
#cd ..
#rm -rf serverlog.out
#rm -rf buildserver-log.out
#killall java  #dangerous: figure out what to do here instead
PORT=$1
echo Starting Appinventor
# replace ~/appengien-java-sdk by the path
# to the sdk on your own machine
#nohup ~/appengine-java-sdk-1.9.2/bin/dev_appserver.sh --port=8888 --address=0.0.0.0 appengine/build/war/ > serverlog.out &
#nohup ~/appengine-java-sdk-1.9.2/bin/dev_appserver.sh --port=8898 --address=0.0.0.0 appengine/build/war/ > serverlog.out &
nohup ~/appengine-java-sdk-1.9.2/bin/dev_appserver.sh --port=$PORT --address=0.0.0.0 appengine/build/war/ > serverlog.out &
echo Appinventor started on localhost:$PORT
#pushd appinventor/buildserver
nohup ant RunLocalBuildServer > ../../buildserver-log.out &
#popd
#echo Buildserver started

# --------- Lyn's launch script  ----------------------
# He launches with a different port each time. 
# ----------------------------------------------------
# APPINVENTORDIR=/Applications/MAMP/htdocs/appinv-gerrit
# APPINVENTORPORT=$1

# dev_appserver.sh --port=$APPINVENTORPORT --address=0.0.0.0 $APPINVENTORDIR/appinventor/appengine/build/war/ 

# echo Started git appinventor server on localhost:$APPINVENTORPORT

