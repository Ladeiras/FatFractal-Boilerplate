@echo off

setlocal enableextensions 

setLocal EnableDelayedExpansion
set CLASSPATH="
for /R ./lib %%a in (*.jar) do (
   set CLASSPATH=!CLASSPATH!;%%a
   )
set CLASSPATH=!CLASSPATH!

set FATFRACTAL_HOME=%cd%
set JAVA_OPTS=-Xms512m -Xmx1024m -XX:MaxPermSize=128m -XX:+CMSClassUnloadingEnabled -XX:+UseConcMarkSweepGC
set JAVACMD=java

%JAVACMD% %JAVA_OPTS% -Dfile.encoding=UTF-8 -Dcom.fatfractal.system.deploy.directory="%FATFRACTAL_HOME%" -Dcom.fatfractal.system.start.mode="cl" -Dcom.fatfractal.tool.main="run" -jar lib/fatfractal-tool-0.1.0.jar %*
   
endlocal   
