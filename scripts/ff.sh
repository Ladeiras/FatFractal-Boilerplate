#!/bin/bash
install() {
  stop
  if [ ! -d "FatFractal_Runtime" ]; then
    test -d logs || mkdir logs
    wget http://system.fatfractal.com/console/ff/ext/Releases/Latest/FF_RUNTIME
    mv FF_RUNTIME FF_RUNTIME.zip
    unzip FF_RUNTIME.zip
    rm FF_RUNTIME.zip
    test -d logs || mkdir logs
    printf "Finished FF install\n"
  else
    printf "FF already installed\n"
  fi
  rm -rf webapp/databrowser
  wget http://system.fatfractal.com/console/ff/ext/Releases/Latest/FF_DATA_BROWSER
  mv FF_DATA_BROWSER FF_DATA_BROWSER.zip
  unzip FF_DATA_BROWSER.zip
  rm FF_DATA_BROWSER.zip
  sed -Eir 's|dataBrowser2Redirect[(][)];|//dataBrowser2Redirect();|g' databrowser/databrowser.html
  mv databrowser webapp/
}

reinstall() {
  rm -rf FatFractal_Runtime
  install
}

deploy() {
  FatFractal_Runtime/bin/ffef deploylocal
}

production() {
  FatFractal_Runtime/bin/ffef deployFFFabric
}

start() {
  cd FatFractal_Runtime
  JAVACMD=`which java`
  JVMOPTS="-Xms512m -Xmx1024m -XX:+CMSClassUnloadingEnabled -XX:+UseConcMarkSweepGC -cp -Dfile.encoding=UTF-8";
  JAR=`ls lib/fatfractal-tool-*.jar`
  "$JAVACMD" ${JVMOPTS} "-Dcom.fatfractal.system.deploy.directory=$PWD" "-Dcom.fatfractal.system.start.mode=cl" "-Dcom.fatfractal.tool.main=run" -jar "$JAR" 1>../logs/log 2>../logs/err &
  echo $! >../pid.file
}

stop() {
  kill -9 `cat pid.file`
}

restart() {
  stop
  start
}

debug() {
  # cd FatFractal_Runtime
  # tail -F $PWD/domain/$FF_DOMAIN/$FF_APP/logs/$FF_DOMAIN.$FF_APP.log | grep --line-buffered 'DEBUG_FLAG' | sed -E 's/DEBUG_FLAG//'
  tail -F logs/log | ccze -A | grep --line-buffered 'DEBUG_FLAG' | sed -E 's/DEBUG_FLAG//'
}

watch() {
  # cd FatFractal_Runtime
  # tail -F $PWD/domain/$FF_DOMAIN/$FF_APP/logs/$FF_DOMAIN.$FF_APP.log
  tail -F logs/log | ccze  -A
}

usage() {
	cat << EOF >&2

Usage: ff.sh {install|reinstall|start|stop|restart|deploy|production|debug|watch}

EOF
}

case "$1" in
  "install")
    install
  ;;
  "reinstall")
    reinstall
  ;;
  "start")
    start
  ;;
  "stop")
    stop
  ;;
  "restart")
    restart
  ;;
  "deploy")
    deploy
  ;;
  "production")
    production
  ;;
  "debug")
    debug
  ;;
  "watch")
    watch
  ;;
esac