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
    if (!url || url === 'unknown') return 'other';
    
    const url_lower = url.toLowerCase();
    const domain = this.extractDomain(url).toLowerCase();
    
    // ========================================
    // DATABASE KATEGORI WEBSITE (200+ domain)
    // ========================================
    
    const categories = {
      // PENDIDIKAN (Educational)
      'educational': {
        domains: [
          // Platform Belajar Indonesia
          'ruangguru.com', 'zenius.net', 'kelas.pintar.co.id', 'akademi.quipper.com',
          'sekolah.mu', 'belajar.kemdikbud.go.id', 'platform.belajar.id', 'merdeka.belajar.id',
          
          // Platform Belajar Internasional
          'khanacademy.org', 'coursera.org', 'udemy.com', 'edx.org', 'skillshare.com',
          'codecademy.com', 'freecodecamp.org', 'sololearn.com', 'datacamp.com',
          
          // Programming & Tech
          'github.com', 'stackoverflow.com', 'w3schools.com', 'mdn.mozilla.org',
          'geeksforgeeks.org', 'tutorialspoint.com', 'leetcode.com', 'hackerrank.com',
          'codepen.io', 'jsfiddle.net', 'replit.com', 'codesandbox.io',
          
          // Academic Resources
          'scholar.google.com', 'jstor.org', 'researchgate.net', 'academia.edu',
          'arxiv.org', 'ieee.org', 'springer.com', 'elsevier.com',
          
          // Online Courses & Tutorials
          'lynda.com', 'pluralsight.com', 'linkedin.com/learning', 'youtube.com/education',
          'ted.com', 'mit.edu', 'stanford.edu', 'harvard.edu',
          
          // Dictionary & Reference
          'dictionary.com', 'thesaurus.com', 'merriam-webster.com', 'britannica.com',
          'wikipedia.org', 'wikihow.com', 'wolframalpha.com'
        ],
        keywords: ['edu', 'learn', 'course', 'tutorial', 'school', 'university', 'college',
                   'academic', 'study', 'kelas', 'belajar', 'pelajaran', 'materi']
      },
      
      // MEDIA SOSIAL (Social Media)
      'social-media': {
        domains: [
          // Major Social Platforms
          'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com',
          'linkedin.com', 'pinterest.com', 'reddit.com', 'snapchat.com', 'tumblr.com',
          
          // Messaging Apps
          'whatsapp.com', 'telegram.org', 'line.me', 'wechat.com', 'viber.com',
          'discord.com', 'slack.com', 'skype.com', 'messenger.com',
          
          // Indonesian Social Media
          'sharechat.com', 'bigo.live', 'likee.com', 'kwai.com',
          
          // Forums & Communities
          'quora.com', 'kaskus.co.id', 'flickr.com', 'imgur.com',
          '9gag.com', 'twitch.tv', 'clubhouse.com', 'threads.net',
          
          // Professional Networks
          'behance.net', 'dribbble.com', 'medium.com', 'dev.to',
          'hashnode.com', 'producthunt.com'
        ],
        keywords: ['social', 'chat', 'message', 'friend', 'follow', 'share', 'post',
                   'sosmed', 'obrolan', 'teman', 'grup', 'komunitas']
      },
      
      // HIBURAN (Entertainment)
      'entertainment': {
        domains: [
          // Video Streaming
          'youtube.com', 'netflix.com', 'disneyplus.com', 'hbo.com', 'hbomax.com',
          'primevideo.com', 'vidio.com', 'we.tv', 'iflix.com', 'viu.com',
          
          // Music Streaming
          'spotify.com', 'apple.com/music', 'joox.com', 'soundcloud.com',
          'deezer.com', 'tidal.com', 'langitmusik.co.id',
          
          // Gaming
          'steam.com', 'epicgames.com', 'twitch.tv', 'playstation.com',
          'xbox.com', 'nintendo.com', 'roblox.com', 'minecraft.net',
          'genshin.hoyoverse.com', 'pubg.com', 'mobilelegends.com',
          
          // Anime & Comics
          'crunchyroll.com', 'funimation.com', 'myanimelist.net',
          'webtoons.com', 'tapas.io', 'manganelo.com',
          
          // Movies & TV
          'imdb.com', 'rottentomatoes.com', 'tmdb.org', 'justwatch.com',
          
          // Fun & Viral Content
          '9gag.com', 'buzzfeed.com', 'boredpanda.com', 'cheezburger.com',
          'funnyordie.com', 'collegehumor.com'
        ],
        keywords: ['video', 'movie', 'music', 'game', 'play', 'stream', 'watch',
                   'film', 'musik', 'lagu', 'hiburan', 'nonton', 'main']
      },
      
      // MESIN PENCARI (Search Engine)
      'search-engine': {
        domains: [
          'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com',
          'yandex.com', 'ask.com', 'aol.com', 'ecosia.org', 'startpage.com',
          'search.brave.com', 'presearch.org', 'qwant.com'
        ],
        keywords: ['search', 'cari', 'pencarian', 'find', 'query']
      },
      
      // BELANJA (Shopping)
      'shopping': {
        domains: [
          // E-commerce Indonesia
          'tokopedia.com', 'shopee.co.id', 'bukalapak.com', 'blibli.com',
          'lazada.co.id', 'zalora.co.id', 'jd.id', 'elevenia.co.id',
          'bhineka.com', 'eraspace.com', 'citilink.co.id',
          
          // E-commerce International
          'amazon.com', 'ebay.com', 'alibaba.com', 'aliexpress.com',
          'wish.com', 'etsy.com', 'walmart.com', 'target.com',
          
          // Fashion & Beauty
          'zara.com', 'h&m.com', 'uniqlo.com', 'sephora.com',
          'nyxcosmetics.com', 'sociolla.com',
          
          // Electronics
          'bhineka.com', 'eraspace.com', 'enter.co.id',
          
          // Food Delivery
          'gojek.com', 'grab.com', 'shopee.com/food', 'traveloka.com/eats'
        ],
        keywords: ['shop', 'store', 'buy', 'price', 'cart', 'checkout', 'belanja',
                   'toko', 'harga', 'beli', 'diskon', 'promo', 'sale']
      },
      
      // BERITA (News)
      'news': {
        domains: [
          // News Indonesia
          'detik.com', 'kompas.com', 'tempo.co', 'cnnindonesia.com',
          'tribunnews.com', 'liputan6.com', 'merdeka.com', 'kumparan.com',
          'tirto.id', 'voaindonesia.com', 'bbc.com/indonesia',
          'antaranews.com', 'beritasatu.com', 'sindonews.com',
          'jawapos.com', 'suara.com', 'okezone.com', 'inews.id',
          
          // News International
          'cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com', 'washingtonpost.com',
          'theguardian.com', 'aljazeera.com', 'bloomberg.com', 'ft.com',
          'wsj.com', 'usatoday.com', 'nbcnews.com', 'abcnews.go.com',
          
          // Tech News
          'techcrunch.com', 'theverge.com', 'wired.com', 'arstechnica.com',
          'engadget.com', 'gizmodo.com', 'mashable.com',
          
          // Business News
          'forbes.com', 'businessinsider.com', 'entrepreneur.com', 'inc.com'
        ],
        keywords: ['news', 'berita', 'artikel', 'headline', 'breaking', 'update',
                   'terkini', 'terbaru', 'laporan', 'wartawan']
      },
      
      // PRODUKTIVITAS (Productivity)
      'productivity': {
        domains: [
          // Office & Documents
          'docs.google.com', 'sheets.google.com', 'slides.google.com',
          'office.com', 'office365.com', 'onedrive.live.com', 'dropbox.com',
          'box.com', 'drive.google.com',
          
          // Project Management
          'trello.com', 'asana.com', 'notion.so', 'clickup.com', 'monday.com',
          'basecamp.com', 'jira.atlassian.com', 'github.com/projects',
          
          // Communication & Collaboration
          'zoom.us', 'meet.google.com', 'teams.microsoft.com', 'webex.com',
          'gotomeeting.com', 'bluejeans.com',
          
          // Note Taking
          'evernote.com', 'onenote.com', 'bear.app', 'simplenote.com',
          
          // Calendar & Tasks
          'calendar.google.com', 'outlook.live.com', 'todoist.com',
          'any.do', 'ticktick.com'
        ],
        keywords: ['docs', 'document', 'sheet', 'slide', 'presentation', 'task',
                   'project', 'meeting', 'calendar', 'dokumen', 'tugas', 'rapat']
      },
      
      // EMAIL (Email)
      'email': {
        domains: [
          'gmail.com', 'mail.google.com', 'outlook.com', 'outlook.live.com',
          'hotmail.com', 'yahoo.com/mail', 'zoho.com', 'protonmail.com',
          'icloud.com/mail', 'aol.com/mail', 'yandex.com/mail',
          'mail.com', 'gmx.com', 'tutanota.com'
        ],
        keywords: ['mail', 'email', 'inbox', 'surat', 'pesan']
      },
      
      // GAME ONLINE (Gaming)
      'gaming': {
        domains: [
          // Game Platforms
          'steam.com', 'epicgames.com', 'origin.com', 'gog.com',
          'battle.net', 'ubisoft.com', 'ea.com',
          
          // Browser Games
          'miniclip.com', 'kongregate.com', 'newgrounds.com', 'armor games.com',
          'crazygames.com', 'poki.com', 'y8.com',
          
          // Mobile Games Web
          'mobilelegends.com', 'pubg.com', 'freefiremobile.com',
          'genshin.hoyoverse.com', 'honkai.hoyoverse.com',
          
          // Game News & Communities
          'ign.com', 'gamespot.com', 'pcgamer.com', 'polygon.com',
          'kotaku.com', 'rockpapershotgun.com', 'gamepedia.com'
        ],
        keywords: ['game', 'play', 'gaming', 'main', 'permainan']
      },
      
      // KEUANGAN (Finance)
      'finance': {
        domains: [
          // Banking Indonesia
          'bca.co.id', 'mandiri.co.id', 'bni.co.id', 'bri.co.id',
          'cimbniaga.co.id', 'danamon.co.id', 'permatabank.com',
          'bankmega.com', 'ocbc.id', 'hsbc.co.id',
          
          // E-Wallet & Payment
          'gopay.co.id', 'ovo.id', 'dana.id', 'linkaja.com',
          'shopeepay.co.id', 'jenius.co.id',
          
          // Investment & Trading
          'bibit.id', 'ajaib.co.id', 'bareksa.com', 'ipot.com',
          'mncsekuritas.com', 'stockbit.com', 'rti.co.id',
          
          // Crypto
          'coinbase.com', 'binance.com', 'indodax.com', 'tokocrypto.com',
          'crypto.com', 'kraken.com',
          
          // Financial News
          'cnbcindonesia.com', 'kontan.co.id', 'investing.com',
          'marketwatch.com', 'yahoo.com/finance'
        ],
        keywords: ['bank', 'money', 'finance', 'payment', 'transfer', 'investasi',
                   'saham', 'kripto', 'rekening', 'transaksi']
      }
    };
    
    // ========================================
    // ALGORITMA KLASIFIKASI CERDAS
    // ========================================
    
    // 1. Exact domain match (prioritas tertinggi)
    for (const [category, data] of Object.entries(categories)) {
      if (data.domains.some(d => domain === d || domain.endsWith('.' + d))) {
        return category;
      }
    }
    
    // 2. Domain contains match
    for (const [category, data] of Object.entries(categories)) {
      if (data.domains.some(d => domain.includes(d.replace('.com', '').replace('.co.id', '').replace('.org', '')))) {
        return category;
      }
    }
    
    // 3. URL path analysis
    for (const [category, data] of Object.entries(categories)) {
      if (data.domains.some(d => url_lower.includes(d))) {
        return category;
      }
    }
    
    // 4. Keyword matching
    for (const [category, data] of Object.entries(categories)) {
      if (data.keywords && data.keywords.some(keyword => url_lower.includes(keyword))) {
        return category;
      }
    }
    
    // 5. Special patterns
    if (url_lower.includes('google.com') && !url_lower.includes('search')) {
      return 'search-engine';
    }
    
    if (url_lower.includes('.edu') || url_lower.includes('.ac.id')) {
      return 'educational';
    }
    
    if (url_lower.includes('.gov') || url_lower.includes('.go.id')) {
      return 'government';
    }
    
    // 6. Default category
    return 'other';
  }
}

module.exports = BrowserMonitor;
