@echo off
title MoEYS Python AI & Live Google Search Microservice
echo =======================================================
echo   MoEYS MoTDAR Python AI Engine (Zero API Key)
echo   Connected to Live Google & Wikipedia & SymPy Math
echo =======================================================
echo Starting microservice on http://127.0.0.1:5001 ...
set START_SERVER=1
set PORT=5001
"C:\Users\TUF\AppData\Local\Programs\Python\Python314\python.exe" python_ai\ai_engine.py --server
pause
