/**
 * Remote Controller - Menangani perintah remote dari admin
 */

const { exec } = require('child_process');
const logger = require('../utils/logger');

class RemoteController {
  constructor() {
    this.commandHistory = [];
  }

  async execute(command) {
    try {
      logger.info('🎮 ========================================');
      logger.info('🎮 Executing remote command');
      logger.info(`🎮 Action: ${command.action}`);
      logger.info('🎮 ========================================');

      let result;

      switch (command.action) {
        case 'shutdown':
          logger.info('⏹️ Executing SHUTDOWN command');
          result = await this.shutdown(command.delay || 0);
          break;
        
        case 'restart':
          logger.info('🔄 Executing RESTART command');
          result = await this.restart(command.delay || 0);
          break;
        
        case 'lock':
          logger.info('🔒 Executing LOCK SCREEN command');
          result = await this.lockScreen();
          break;
        
        case 'message':
          logger.info('💬 Executing SHOW MESSAGE command');
          result = await this.showMessage(command.message || 'Pesan dari admin');
          break;
        
        case 'block_internet':
          logger.info('🚫 Executing BLOCK INTERNET command');
          result = await this.blockInternet();
          break;
        
        case 'unblock_internet':
          logger.info('✅ Executing UNBLOCK INTERNET command');
          result = await this.unblockInternet();
          break;
        
        case 'screenshot':
          logger.info('📸 Executing SCREENSHOT command');
          result = await this.takeScreenshot();
          break;
        
        case 'open_url':
          logger.info('🌐 Executing OPEN URL command');
          result = await this.openUrl(command.url);
          break;
        
        case 'close_app':
          logger.info('❌ Executing CLOSE APP command');
          result = await this.closeApp(command.appName);
          break;
        
        default:
          logger.warn(`⚠️ Unknown command: ${command.action}`);
          result = {
            success: false,
            message: `Unknown command: ${command.action}`
          };
      }

      logger.info(`✅ Command result: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      logger.info(`✅ Message: ${result.message}`);

      return result;

    } catch (error) {
      logger.error('❌ Error executing command:', error.message);
      logger.error('❌ Stack:', error.stack);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async shutdown(delay = 0) {
    return new Promise((resolve) => {
      const command = delay > 0 
        ? `shutdown /s /t ${delay}` 
        : 'shutdown /s /t 0';
      
      logger.info(`Scheduling shutdown in ${delay} seconds`);
      
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
        ? `shutdown /r /t ${delay}` 
        : 'shutdown /r /t 0';
      
      logger.info(`Scheduling restart in ${delay} seconds`);
      
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
      // Create a temporary VBScript to show message
      const vbsContent = `
MsgBox "${message}", vbInformation + vbSystemModal, "Pesan dari Admin"
`;
      
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

        exec(`cscript //nologo "${tempFile}"`, (error) => {
          // Clean up temp file
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
      // Block internet by disabling network adapter or adding firewall rules
      // Method 1: Add firewall rule to block all outbound traffic
      const command = 'netsh advfirewall firewall add rule name="LabMonitor_Block" dir=out action=block protocol=any enable=yes';
      
      exec(command, { shell: 'cmd.exe' }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to block internet: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: 'Internet blocked successfully'
          });
        }
      });
    });
  }

  async unblockInternet() {
    return new Promise((resolve) => {
      // Remove firewall rule
      const command = 'netsh advfirewall firewall delete rule name="LabMonitor_Block"';
      
      exec(command, { shell: 'cmd.exe' }, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to unblock internet: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: 'Internet unblocked successfully'
          });
        }
      });
    });
  }

  async takeScreenshot() {
    return new Promise((resolve) => {
      // Use PowerShell to take screenshot
      const timestamp = Date.now();
      const screenshotPath = `${process.env.TEMP}\\labmonitor_screenshot_${timestamp}.png`;
      
      const psCommand = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap.Save('${screenshotPath}')
$graphics.Dispose()
$bitmap.Dispose()
`;

      exec(`powershell -Command "${psCommand.replace(/\n/g, ' ')}"`, (error) => {
        if (error) {
          resolve({
            success: false,
            message: `Failed to take screenshot: ${error.message}`
          });
        } else {
          resolve({
            success: true,
            message: 'Screenshot taken successfully',
            path: screenshotPath
          });
        }
      });
    });
  }

  async openUrl(url) {
    return new Promise((resolve) => {
      exec(`start ${url}`, (error) => {
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
      exec(`taskkill /F /IM ${appName}`, (error) => {
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

module.exports = RemoteController;
