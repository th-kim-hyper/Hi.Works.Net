@ECHO OFF
ECHO 프로젝트를 처음 시작 할수 있도록 초기화 하는 중입니다.
ECHO ===============================================================================
ECHO. 
ECHO.
ECHO STEP1 : External 디렉토리 생성
ECHO ===============================================================================
mkdir External
ECHO ===============================================================================
ECHO.
ECHO.
ECHO STEP2 : 디자이너 링크 생성
ECHO ===============================================================================
if exist External\Designer (
	rmdir /S /Q External\Designer
)

mkdir External\

mklink /J External\Designer "%AppData%\Brity RPA Designer v2.1"
ECHO ===============================================================================