
SET FFEF_APP_DIR=%CD%

pushd %~dp0
set FFEF_BIN_DIR=%CD%
popd

IF "%FF_FABRIC_DOMAIN%"=="" set FF_FABRIC_DOMAIN=fatfractal.com

java "-Dcom.fatfractal.deployer.FFEF_BIN_DIR=%FFEF_BIN_DIR%" "-Dcom.fatfractal.deployer.FFEF_APP_DIR=%FFEF_APP_DIR%" "-Dhttp.base.uri=http://system.%FF_FABRIC_DOMAIN%" "-Dhttps.base.uri=https://system.%FF_FABRIC_DOMAIN%" "-Dtrusted.host=system.%FF_FABRIC_DOMAIN%" -jar "%FFEF_BIN_DIR%\..\lib\fatfractal-desktop-deployer-0.1.0.jar" %*
