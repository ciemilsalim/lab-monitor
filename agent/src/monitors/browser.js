/**
 * Browser Monitor - Monitoring semua tab browser yang terbuka
 */

const logger = require('../utils/logger');

class BrowserMonitor {
  constructor() {
    this.previousTabs = new Map();
  }

  async getData() {
    try {
      const tabs = await this.getAllBrowserTabs();
      const activeTab = await this.getActiveTab();

      return {
        tabs,
        activeUrl: activeTab?.url || '',
        activeTitle: activeTab?.title || '',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Error getting browser data:', error.message);
      return {
        tabs: [],
        activeUrl: '',
        activeTitle: '',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getAllBrowserTabs() {
    const tabs = [];

    try {
      // Chrome tabs
      const chromeTabs = await this.getChromeTabs();
      tabs.push(...chromeTabs);

      // Firefox tabs
      const firefoxTabs = await this.getFirefoxTabs();
      tabs.push(...firefoxTabs);

      // Edge tabs
      const edgeTabs = await this.getEdgeTabs();
      tabs.push(...edgeTabs);

      // Calculate duration for each tab
      tabs.forEach(tab => {
        if (this.previousTabs.has(tab.url)) {
          const prevTab = this.previousTabs.get(tab.url);
          tab.duration = Math.floor((Date.now() - prevTab.firstSeen) / 1000);
        } else {
          tab.duration = 0;
          this.previousTabs.set(tab.url, {
            firstSeen: Date.now(),
            title: tab.title
          });
        }
      });

      // Clean up old tabs (not seen in last 30 minutes)
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      for (const [url, data] of this.previousTabs.entries()) {
        if (data.firstSeen < thirtyMinutesAgo) {
          this.previousTabs.delete(url);
        }
      }

      return tabs;

    } catch (error) {
      logger.error('Error getting all browser tabs:', error.message);
      return [];
    }
  }

  async getChromeTabs() {
    try {
      // Method 1: Using Chrome DevTools Protocol (CDP)
      // This requires Chrome to be started with --remote-debugging-port=9222
      const axios = require('axios');
      
      try {
        const response = await axios.get('http://localhost:9222/json', {
          timeout: 2000
        });

        if (response.data && Array.isArray(response.data)) {
          return response.data
            .filter(tab => tab.type === 'page')
            .map(tab => ({
              id: `chrome-${tab.id}`,
              url: tab.url,
              domain: this.extractDomain(tab.url),
              title: tab.title,
              category: this.categorizeUrl(tab.url),
              isActive: false,
              browser: 'chrome',
              openTime: new Date().toISOString(),
              duration: 0
            }));
        }
      } catch (error) {
        logger.debug('Chrome CDP not available, trying alternative method');
      }

      // Method 2: Using window titles (less accurate)
      return await this.getTabsFromWindowTitles('chrome');

    } catch (error) {
      logger.debug('Error getting Chrome tabs:', error.message);
      return [];
    }
  }

  async getFirefoxTabs() {
    try {
      // Firefox doesn't have easy CDP access
      // Using window titles method
      return await this.getTabsFromWindowTitles('firefox');
    } catch (error) {
      logger.debug('Error getting Firefox tabs:', error.message);
      return [];
    }
  }

  async getEdgeTabs() {
    try {
      // Edge supports CDP similar to Chrome
      const axios = require('axios');
      
      try {
        const response = await axios.get('http://localhost:9223/json', {
          timeout: 2000
        });

        if (response.data && Array.isArray(response.data)) {
          return response.data
            .filter(tab => tab.type === 'page')
            .map(tab => ({
              id: `edge-${tab.id}`,
              url: tab.url,
              domain: this.extractDomain(tab.url),
              title: tab.title,
              category: this.categorizeUrl(tab.url),
              isActive: false,
              browser: 'edge',
              openTime: new Date().toISOString(),
              duration: 0
            }));
        }
      } catch (error) {
        logger.debug('Edge CDP not available');
      }

      return await this.getTabsFromWindowTitles('edge');

    } catch (error) {
      logger.debug('Error getting Edge tabs:', error.message);
      return [];
    }
  }

  async getTabsFromWindowTitles(browser) {
    try {
      // This is a simplified method using window titles
      // In production, you would use browser extensions or more sophisticated methods
      
      const activeWindow = require('active-win');
      const win = await activeWindow();
      
      if (!win) return [];

      const appName = (win.owner.name || '').toLowerCase();
      
      if (appName.includes(browser)) {
        const title = win.title;
        
        if (title && title !== 'New Tab' && title !== 'About:blank') {
          return [{
            id: `${browser}-${Date.now()}`,
            url: title, // Title often contains domain
            domain: this.extractDomain(title),
            title: title,
            category: this.categorizeUrl(title),
            isActive: true,
            browser: browser,
            openTime: new Date().toISOString(),
            duration: 0
          }];
        }
      }

      return [];

    } catch (error) {
      logger.debug('Error getting tabs from window titles:', error.message);
      return [];
    }
  }

  async getActiveTab() {
    try {
      const activeWindow = require('active-win');
      const win = await activeWindow();
      
      if (!win) return null;

      const appName = (win.owner.name || '').toLowerCase();
      const browsers = ['chrome', 'firefox', 'msedge', 'opera', 'brave'];
      
      const isBrowser = browsers.some(browser => appName.includes(browser));
      
      if (isBrowser && win.title) {
        return {
          url: win.title,
          title: win.title,
          domain: this.extractDomain(win.title),
          category: this.categorizeUrl(win.title)
        };
      }

      return null;

    } catch (error) {
      logger.debug('Error getting active tab:', error.message);
      return null;
    }
  }

  extractDomain(url) {
    try {
      // Simple domain extraction
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const urlObj = new URL(url);
        return urlObj.hostname;
      }
      
      // Try to extract from title or plain text
      const match = url.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
      if (match) {
        return match[1];
      }
      
      return url.split(' ')[0] || 'unknown';
      
    } catch (error) {
      return 'unknown';
    }
  }

  categorizeUrl(url) {
    const url_lower = url.toLowerCase();
    
    // Educational sites
    const educational = ['ruangguru', 'zenius', 'khanacademy', 'stackoverflow', 'github', 'w3schools', 'coursera', 'udemy', 'scholar'];
    if (educational.some(site => url_lower.includes(site))) {
      return 'educational';
    }
    
    // Social media
    const social = ['facebook', 'instagram', 'twitter', 'tiktok', 'linkedin', 'pinterest', 'reddit', 'snapchat'];
    if (social.some(site => url_lower.includes(site))) {
      return 'social-media';
    }
    
    // Entertainment
    const entertainment = ['youtube', 'netflix', 'spotify', 'twitch', 'hbo', 'disney', 'prime video'];
    if (entertainment.some(site => url_lower.includes(site))) {
      return 'entertainment';
    }
    
    // Search engines
    const search = ['google.com/search', 'bing.com/search', 'yahoo.com/search', 'duckduckgo'];
    if (search.some(site => url_lower.includes(site))) {
      return 'search-engine';
    }
    
    // Shopping
    const shopping = ['tokopedia', 'shopee', 'lazada', 'blibli', 'amazon', 'ebay', 'alibaba'];
    if (shopping.some(site => url_lower.includes(site))) {
      return 'shopping';
    }
    
    // News
    const news = ['detik', 'kompas', 'tempo', 'cnn', 'bbc', 'reuters', 'nytimes'];
    if (news.some(site => url_lower.includes(site))) {
      return 'news';
    }
    
    return 'other';
  }
}

module.exports = BrowserMonitor;
