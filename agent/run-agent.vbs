' LabMonitor Agent - Silent Runner (No Console Window)
' File: run-agent.vbs
' 
' Cara Pakai:
' 1. Double-click file ini untuk menjalankan agent tanpa window
' 2. Atau gunakan di Task Scheduler untuk auto-start tanpa window
' 3. Agent akan berjalan di background tanpa terlihat

Set WshShell = CreateObject("WScript.Shell")

' Get script directory
strScriptPath = WScript.ScriptFullName
strScriptDir = Left(strScriptPath, InStrRev(strScriptPath, "\"))

' Set agent path
strAgentPath = strScriptDir & "src\agent.js"

' Run agent without console window
' 0 = Hidden window
' False = Don't wait for process to finish
WshShell.Run "cmd.exe /c node.exe """ & strAgentPath & """", 0, False

' Optional: Show notification that agent started (comment out if not needed)
' WshShell.Popup "LabMonitor Agent started in background", 2, "LabMonitor", 64

Set WshShell = Nothing
