' ========================================
' LabMonitor Agent - Silent Runner
' File: run-agent-silent.vbs
' 
' Menjalankan agent di background tanpa window CMD
' ========================================

Set WshShell = CreateObject("WScript.Shell")

' Get script directory
strScriptPath = WScript.ScriptFullName
strScriptDir = Left(strScriptPath, InStrRev(strScriptPath, "\"))

' Set working directory
strAgentDir = strScriptDir

' Set agent script path
strAgentScript = strAgentDir & "src\agent.js"

' Set node path (auto-detect)
strNodePath = "node.exe"

' Run agent with hidden window (0 = hidden, False = don't wait)
WshShell.CurrentDirectory = strAgentDir
WshShell.Run "cmd /c """ & strNodePath & """ """ & strAgentScript & """", 0, False

' Optional: Show notification (uncomment if needed)
' WshShell.Popup "LabMonitor Agent started in background", 2, "LabMonitor", 64

Set WshShell = Nothing
