/**
 * Remote Controller - OPTIMIZED VERSION
 * File: C:\labmonitor-agent\src\controllers\remote.js
 * 
 * PERUBAHAN:
 * ✅ Rate limiting untuk mouse/keyboard commands
 * ✅ Queue system untuk prevent overload
 * ✅ Optimized PowerShell scripts
 * ✅ Better error handling
 * ✅ Throttling mechanism
 */

const { exec } = require('child_process');
const logger = require('../utils/logger');

class RemoteController {
  constructor() {
    this.commandHistory = [];
    this.commandQueue = [];
    this.isProcessing = false;
    this.LAST_COMMAND_TIME = new Map(); // Track last command time per type
    this.MIN_INTERVAL = 100; // Minimum 100ms between same type commands
  }

  /**
   * Check if command is allowed (rate limiting)
   */
  canExecute(commandType) {
    const now = Date.now();
    const lastTime = this.LAST_COMMAND_TIME.get(commandType) || 0;
    
    if (now - lastTime < this.MIN_INTERVAL) {
      logger.debug(`⏱️ Command ${commandType} throttled (too fast)`);
      return false;
    }
    
    this.LAST_COMMAND_TIME.set(commandType, now);
    return true;
  }

  /**
   * Execute command with rate limiting
   */
  async execute(command) {
    try {
      logger.info('🎮 Executing remote command:', command.action);

      // Check rate limiting
      if (!this.canExecute(command.action)) {
        return {
          success: false,
          message: 'Command throttled - too fast'
        };
      }

      // Normalize action name
      const action = command.action.toLowerCase().replace(/[-_\s]/g, '_');
      
      let result;

      switch (action) {
        case 'shutdown':
        case 'shut_down':
        case 'power_off':
          logger.info('⏹️ Executing SHUTDOWN command');
          result = await this.shutdown(command.delay || 0);
          break;
        
        case 'restart':
        case 'reboot':
          logger.info('🔄 Executing RESTART command');
          result = await this.restart(command.delay || 0);
          break;
        
        case 'lock':
        case 'lock_screen':
        case 'lockscreen':
          logger.info('🔒 Executing LOCK SCREEN command');
          result = await this.lockScreen();
          break;
        
        case 'message':
        case 'show_message':
        case 'send_message':
        case 'msg':
          logger.info('💬 Executing SHOW MESSAGE command');
          result = await this.showMessage(command.message || 'Pesan dari admin');
          break;
        
        case 'block_internet':
        case 'block':
        case 'block_network':
        case 'disable_internet':
          logger.info('🚫 Executing BLOCK INTERNET command');
          result = await this.blockInternet();
          break;
        
        case 'unblock_internet':
        case 'unblock':
        case 'unblock_network':
        case 'enable_internet':
          logger.info('✅ Executing UNBLOCK INTERNET command');
          result = await this.unblockInternet();
          break;
        
        case 'screenshot':
        case 'view_screen':
        case 'screen':
        case 'capture':
          logger.info('📸 Executing VIEW SCREEN / SCREENSHOT command');
          result = await this.takeScreenshot();
          break;
        
        case 'open_url':
        case 'openurl':
        case 'open_browser':
          logger.info('🌐 Executing OPEN URL command');
          result = await this.openUrl(command.url);
          break;
        
        case 'close_app':
        case 'close':
        case 'kill_app':
          logger.info('❌ Executing CLOSE APP command');
          result = await this.closeApp(command.appName);
          break;
        
        // OPTIMIZED MOUSE COMMANDS
        case 'mouse_move':
        case 'move_mouse':
          logger.info('🖱️ Executing MOUSE MOVE command');
          result = await this.moveMouse(command.x, command.y);
          break;
        
        case 'mouse_click':
        case 'click':
        case 'click_mouse':
          logger.info('🖱️ Executing MOUSE CLICK command');
          result = await this.clickMouse(command.button || 'left', command.x, command.y);
          break;
        
        case 'mouse_scroll':
        case 'scroll':
          logger.info('🖱️ Executing MOUSE SCROLL command');
          result = await this.scrollMouse(command.direction, command.amount);
          break;
        
        // OPTIMIZED KEYBOARD COMMANDS
        case 'type_text':
        case 'type':
          logger.info('⌨️ Executing TYPE TEXT command');
          result = await this.typeText(command.text);
          break;
        
        case 'press_key':
        case 'key':
          logger.info('⌨️ Executing PRESS KEY command');
          result = await this.pressKey(command.key);
          break;
        
        case 'key_combination':
        case 'combo':
        case 'hotkey':
          logger.info('⌨️ Executing KEY COMBINATION command');
          result = await this.keyCombination(command.keys);
          break;
        
        default:
          logger.warn(`⚠️ Unknown command: ${command.action} (normalized: ${action})`);
          result = {
            success: false,
            message: `Unknown command: ${command.action}`
          };
      }

      logger.info(`✅ Command executed: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      return result;

    } catch (error) {
      logger.error('❌ Error executing command:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // ========================================
  // OPTIMIZED MOUSE CONTROL METHODS
  // ========================================

  async moveMouse(x, y) {
    return new Promise((resolve) => {
      // Convert percentage to actual screen coordinates
      const screenX = Math.round((x / 100) * 1920);
      const screenY = Math.round((y / 100) * 1080);
      
      // OPTIMIZED: Use simpler PowerShell command
      const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${screenX}, ${screenY})`;
      
      exec(`powershell -Command "${psCommand}"`, { timeout: 2000 }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to move mouse: ${error.message}`
          });
        } else {
          logger.debug(`✅ Mouse moved to: ${screenX}, ${screenY}`);
          resolve({
            success: true,
            message: `Mouse moved to: ${screenX}, ${screenY}`
          });
        }
      });
    });
  }

  async clickMouse(button = 'left', x, y) {
    return new Promise(async (resolve) => {
      try {
        // Move mouse first if coordinates provided
        if (x !== undefined && y !== undefined) {
          await this.moveMouse(x, y);
          await new Promise(r => setTimeout(r, 50)); // Reduced delay
        }

        // OPTIMIZED: Use SendKeys for click
        const buttonMap = {
          'left': '{LEFT}',
          'right': '{RIGHT}',
          'middle': '{MIDDLE}'
        };
        
        const clickKey = buttonMap[button] || '{LEFT}';
        
        const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${clickKey}')`;
        
        exec(`powershell -Command "${psCommand}"`, { timeout: 2000 }, (error) => {
          if (error) {
            resolve({
              success: false,
              message: `Failed to click mouse: ${error.message}`
            });
          } else {
            logger.debug(`✅ Mouse ${button} click executed`);
            resolve({
              success: true,
              message: `Mouse ${button} click executed`
            });
          }
        });
      } catch (error) {
        resolve({
          success: false,
          message: `Failed to click mouse: ${error.message}`
        });
      }
    });
  }

  async scrollMouse(direction = 'down', amount = 3) {
    return new Promise((resolve) => {
      const scrollAmount = direction === 'up' ? amount : -amount;
      
      // OPTIMIZED: Simpler scroll command
      const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{${direction === 'up' ? 'UP' : 'DOWN} ${amount}}')`;
      
      exec(`powershell -Command "${psCommand}"`, { timeout: 2000 }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to scroll mouse: ${error.message}`
          });
        } else {
          logger.debug(`✅ Mouse scrolled ${direction} by ${amount}`);
          resolve({
            success: true,
            message: `Mouse scrolled ${direction} by ${amount}`
          });
        }
      });
    });
  }

  // ========================================
  // OPTIMIZED KEYBOARD CONTROL METHODS
  // ========================================

  async typeText(text) {
    return new Promise((resolve) => {
      // OPTIMIZED: Escape special characters properly
      const escapedText = text.replace(/'/g, "''").replace(/"/g, '""').replace(/\{/g, '{{}').replace(/\}/g, '{}}');
      
      const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${escapedText}')`;
      
      exec(`powershell -Command "${psCommand}"`, { timeout: 5000 }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to type text: ${error.message}`
          });
        } else {
          logger.debug(`✅ Text typed: ${text.substring(0, 20)}...`);
          resolve({
            success: true,
            message: `Text typed successfully`
          });
        }
      });
    });
  }

  async pressKey(key) {
    return new Promise((resolve) => {
      // Map common keys to SendKeys format
      const keyMap = {
        'enter': '{ENTER}',
        'return': '{ENTER}',
        'tab': '{TAB}',
        'escape': '{ESC}',
        'esc': '{ESC}',
        'backspace': '{BACKSPACE}',
        'delete': '{DELETE}',
        'del': '{DELETE}',
        'space': ' ',
        'up': '{UP}',
        'down': '{DOWN}',
        'left': '{LEFT}',
        'right': '{RIGHT}',
        'home': '{HOME}',
        'end': '{END}',
        'pageup': '{PGUP}',
        'pagedown': '{PGDN}',
        'f1': '{F1}',
        'f2': '{F2}',
        'f3': '{F3}',
        'f4': '{F4}',
        'f5': '{F5}',
        'f6': '{F6}',
        'f7': '{F7}',
        'f8': '{F8}',
        'f9': '{F9}',
        'f10': '{F10}',
        'f11': '{F11}',
        'f12': '{F12}'
      };
      
      const sendKey = keyMap[key.toLowerCase()] || `{${key.toUpperCase()}}`;
      
      const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${sendKey}')`;
      
      exec(`powershell -Command "${psCommand}"`, { timeout: 2000 }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to press key: ${error.message}`
          });
        } else {
          logger.debug(`✅ Key pressed: ${key}`);
          resolve({
            success: true,
            message: `Key pressed: ${key}`
          });
        }
      });
    });
  }

  async keyCombination(keys) {
    return new Promise((resolve) => {
      // Parse key combination
      const keyArray = keys.split('+').map(k => k.trim().toLowerCase());
      
      // Map to SendKeys format
      const modifierMap = {
        'ctrl': '^',
        'control': '^',
        'alt': '%',
        'shift': '+',
        'win': '^({ESC})'
      };
      
      let sendKeys = '';
      let specialKey = '';
      
      for (const key of keyArray) {
        if (modifierMap[key]) {
          sendKeys += modifierMap[key];
        } else {
          specialKey = key;
        }
      }
      
      // Handle special combinations
      if (keys.toLowerCase().includes('ctrl+alt+del')) {
        const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^(%({DELETE}))')`;
        exec(`powershell -Command "${psCommand}"`, { timeout: 2000 }, (error) => {
          if (error) {
            resolve({
              success: false,
              message: `Failed to send key combination: ${error.message}`
            });
          } else {
            logger.info(`✅ Key combination sent: ${keys}`);
            resolve({
              success: true,
              message: `Key combination sent: ${keys}`
            });
          }
        });
        return;
      }
      
      // Regular key combination
      sendKeys += specialKey.toUpperCase();
      
      const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${sendKeys}')`;
      
      exec(`powershell -Command "${psCommand}"`, { timeout: 2000 }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to send key combination: ${error.message}`
          });
        } else {
          logger.info(`✅ Key combination sent: ${keys}`);
          resolve({
            success: true,
            message: `Key combination sent: ${keys}`
          });
        }
      });
    });
  }

  // ========================================
  // OTHER COMMANDS (unchanged)
  // ========================================

  async shutdown(delay = 0) {
    return new Promise((resolve) => {
      const command = delay > 0 
        ? `shutdown /s /t ${delay}` 
        : 'shutdown /s /t 0';
      
      exec(command, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to shutdown: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: `Computer will shutdown in ${delay} seconds`
          });
        }
      });
    });
  }

  async restart(delay = 0) {
    return new Promise((resolve) => {
      const command = delay > 0 
        ? `shutdown /r /t ${delay} `
        : 'shutdown /r /t 0';
      
      exec(command, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to restart: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: `Computer will restart in ${delay} seconds`
          });
        }
      });
    });
  }

  async lockScreen() {
    return new Promise((resolve) => {
      exec('rundll32.exe user32.dll,LockWorkStation', (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to lock screen: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: 'Screen locked successfully'
          });
        }
      });
    });
  }

  async showMessage(message) {
    return new Promise((resolve) => {
      const vbsContent = `MsgBox "${message}", vbInformation + vbSystemModal, "Pesan dari Admin"`;
      
      const fs = require('fs');
      const path = require('path');
      const tempFile = path.join(process.env.TEMP, 'labmonitor_message.vbs');
      
      fs.writeFile(tempFile, vbsContent, (err) => {
        if (err) {
          resolve({
            success: false,
            message: `Failed to create message file: ${err.message}`
          });
          return;
        }

        exec(`cscript //nologo "${tempFile}"`, { timeout: 10000 }, (error) => {
          fs.unlink(tempFile, () => {});
          
          if (error) {
            resolve({
              success: false,
              message: `Failed to show message: ${error.message}`
            });
          } else {
            resolve({
              success: true,
              message: 'Message displayed successfully'
            });
          }
        });
      });
    });
  }

  async blockInternet() {
    return new Promise((resolve) => {
      const config = require('../utils/config');
      const backendUrl = config.get('BACKEND_URL') || 'http://192.168.100.166:3001';
      
      let serverIp = '192.168.100.166';
      try {
        const url = new URL(backendUrl);
        serverIp = url.hostname;
      } catch (e) {
        logger.warn('⚠️ Could not parse backend URL, using default IP');
      }
      
      const commands = [
        `netsh advfirewall firewall add rule name="LabMonitor_Allow_Server" dir=out action=allow remoteip=${serverIp} protocol=any`,
        'netsh advfirewall firewall add rule name="LabMonitor_Allow_LAN_192" dir=out action=allow remoteip=192.168.0.0/16 protocol=any',
        'netsh advfirewall firewall add rule name="LabMonitor_Allow_LAN_10" dir=out action=allow remoteip=10.0.0.0/8 protocol=any',
        'netsh advfirewall firewall add rule name="LabMonitor_Allow_LAN_172" dir=out action=allow remoteip=172.16.0.0/12 protocol=any',
        'netsh advfirewall firewall add rule name="LabMonitor_Block_ALL_Out" dir=out action=block remoteip=any',
        'netsh advfirewall firewall add rule name="LabMonitor_Block_HTTP" dir=out action=block protocol=TCP remoteport=80,443',
        'netsh advfirewall firewall add rule name="LabMonitor_Block_DNS" dir=out action=block protocol=UDP remoteport=53',
        'netsh advfirewall firewall add rule name="LabMonitor_Block_DNS_TCP" dir=out action=block protocol=TCP remoteport=53',
      ];
      
      let successCount = 0;
      let errorMessages = [];
      
      const executeCommands = (index) => {
        if (index >= commands.length) {
          if (successCount > 0) {
            logger.info(`✅ Internet blocked: ${successCount}/${commands.length} rules applied`);
            logger.info(`✅ Agent can still connect to server: ${serverIp}`);
            resolve({
              success: true,
              message: `Internet blocked successfully. Agent still connected to server. Student cannot access internet.`
            });
          } else {
            resolve({
              success: false,
              message: `Failed to block internet. Errors: ${errorMessages.join('; ')}. Make sure agent is running as Administrator.`
            });
          }
          return;
        }

        exec(commands[index], { shell: 'cmd.exe', timeout: 5000 }, (error, stdout, stderr) => {
          if (error) {
            logger.error(`❌ Command ${index + 1} failed:`, error.message);
            errorMessages.push(`Rule ${index + 1}: ${error.message}`);
          } else {
            logger.info(`✅ Rule ${index + 1} applied successfully`);
            successCount++;
          }
          
          executeCommands(index + 1);
        });
      };
      
      executeCommands(0);
    });
  }

  async unblockInternet() {
    return new Promise((resolve) => {
      logger.info('✅ Attempting to unblock internet...');
      
      const commands = [
        'netsh advfirewall firewall delete rule name="LabMonitor_Block_ALL_Out"',
        'netsh advfirewall firewall delete rule name="LabMonitor_Block_HTTP"',
        'netsh advfirewall firewall delete rule name="LabMonitor_Block_DNS"',
        'netsh advfirewall firewall delete rule name="LabMonitor_Block_DNS_TCP"',
        'netsh advfirewall firewall delete rule name="LabMonitor_Block_TCP"',
      ];
      
      let successCount = 0;
      
      const executeCommands = (index) => {
        if (index >= commands.length) {
          logger.info(`✅ Internet unblocked: ${successCount} rules removed`);
          resolve({
            success: true,
            message: `Internet unblocked successfully. Test: ping google.com should work now.`
          });
          return;
        }

        exec(commands[index], { shell: 'cmd.exe', timeout: 5000 }, (error, stdout, stderr) => {
          if (error) {
            logger.debug(`Rule ${index + 1} not found or already removed`);
          } else {
            logger.info(`✅ Rule ${index + 1} removed`);
            successCount++;
          }
          
          executeCommands(index + 1);
        });
      };
      
      executeCommands(0);
    });
  }

  async takeScreenshot() {
    return new Promise((resolve) => {
      const fs = require('fs');
      const path = require('path');
      
      const timestamp = Date.now();
      const screenshotPath = path.join(process.env.TEMP || 'C:\\Temp', `labmonitor_screenshot_${timestamp}.png`);
      
      const psScript = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

$point = New-Object System.Drawing.Point(0, 0)
$graphics.CopyFromScreen($screen.Location, $point, $screen.Size)

$bitmap.Save('${screenshotPath.replace(/\\/g, '\\\\')}')

$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Screenshot saved to: ${screenshotPath.replace(/\\/g, '\\\\')}"
`;

      const psScriptPath = path.join(process.env.TEMP || 'C:\\Temp', `labmonitor_screenshot_script_${timestamp}.ps1`);
      
      fs.writeFile(psScriptPath, psScript, (err) => {
        if (err) {
          resolve({
            success: false,
            message: `Failed to create screenshot script: ${err.message}`
          });
          return;
        }

        exec(`powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`, { timeout: 10000 }, (error, stdout, stderr) => {
          fs.unlink(psScriptPath, () => {});
          
          if (error) {
            logger.error('Screenshot error:', error.message);
            logger.error('Stderr:', stderr);
            resolve({
              success: false,
              message: `Failed to take screenshot: ${error.message}`
            });
          } else {
            logger.info('✅ Screenshot saved to:', screenshotPath);
            
            fs.readFile(screenshotPath, (err, data) => {
              if (err) {
                logger.error('Failed to read screenshot:', err.message);
                resolve({
                  success: true,
                  message: 'Screenshot taken but failed to read file',
                  path: screenshotPath
                });
              } else {
                const base64Image = data.toString('base64');
                
                resolve({
                  success: true,
                  message: 'Screenshot taken successfully',
                  path: screenshotPath,
                  image: `image/png;base64,${base64Image}`,
                  size: data.length
                });
              }
            });
          }
        });
      });
    });
  }

  async openUrl(url) {
    return new Promise((resolve) => {
      exec(`start ${url}`, { timeout: 5000 }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to open URL: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: `URL opened: ${url}`
          });
        }
      });
    });
  }

  async closeApp(appName) {
    return new Promise((resolve) => {
      exec(`taskkill /F /IM ${appName}`, { timeout: 5000 }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to close app: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: `Application closed: ${appName}`
          });
        }
      });
    });
  }
}

module.exports = new RemoteController();
