import https from 'https';

// In-Memory Search Cache (15-minute TTL) for ultra-fast instant responses
const searchCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
}

// Fallback curated tracks if all networks fail
const FALLBACK_TRACKS = [
  {
    id: 'lTRiuFIWV54',
    title: '1 A.M Study Session - Lofi Hip Hop Beats',
    channel: 'Lofi Girl',
    duration: '1:01:00',
    thumbnail: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg'
  },
  {
    id: 'rvje5oblrLw',
    title: 'VannDa - Time To Rise feat. Master Kong Nay',
    channel: 'VannDa Official',
    duration: '5:40',
    thumbnail: 'https://i.ytimg.com/vi/rvje5oblrLw/hqdefault.jpg'
  },
  {
    id: 'gyTRfSOpQUM',
    title: 'Acoustic Guitar Nonstop - Khmer Chill Melodies',
    channel: 'Nob Acoustic',
    duration: '45:20',
    thumbnail: 'https://i.ytimg.com/vi/gyTRfSOpQUM/hqdefault.jpg'
  },
  {
    id: 'MIHCnP8pDrQ',
    title: 'Doung Virakseth - Selected Acoustic Hits',
    channel: 'MT Records',
    duration: '40:30',
    thumbnail: 'https://i.ytimg.com/vi/MIHCnP8pDrQ/hqdefault.jpg'
  },
  {
    id: 'oiGmGFxsJi8',
    title: 'Calm Piano Music for Studying, Reading & Focus',
    channel: 'HALIDONMUSIC',
    duration: '2:05:00',
    thumbnail: 'https://i.ytimg.com/vi/oiGmGFxsJi8/hqdefault.jpg'
  },
  {
    id: 'mPZkdNFkNps',
    title: 'Gentle Rain & Soft Study Piano for Concentration',
    channel: 'Rain & Focus',
    duration: '2:30:15',
    thumbnail: 'https://i.ytimg.com/vi/mPZkdNFkNps/hqdefault.jpg'
  }
];

/**
 * Searches YouTube using YouTube's official InnerTube API (JSON endpoint).
 * Highly reliable, fast, pure JSON without HTML scraping.
 */
async function searchViaInnerTube(query) {
  const postData = JSON.stringify({
    context: {
      client: {
        hl: 'km',
        gl: 'KH',
        clientName: 'WEB',
        clientVersion: '2.20240101.00.00'
      }
    },
    query: query
  });

  const options = {
    hostname: 'www.youtube.com',
    port: 443,
    path: '/youtubei/v1/search?prettyPrint=false',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Origin': 'https://www.youtube.com'
    }
  };

  const resData = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('InnerTube timeout (8s)'));
    });
    req.write(postData);
    req.end();
  });

  const json = JSON.parse(resData);
  const sections = json.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
  const results = [];

  for (const s of sections) {
    const items = s.itemSectionRenderer?.contents || [];
    for (const item of items) {
      const v = item.videoRenderer;
      if (v && v.videoId) {
        const rawTitle = v.title?.runs ? v.title.runs.map(r => r.text).join('') : (v.title?.simpleText || '');
        const title = decodeHtmlEntities(rawTitle);
        if (title) {
          const channel = decodeHtmlEntities(v.ownerText?.runs?.[0]?.text || '');
          const duration = v.lengthText?.simpleText || (v.badges?.some(b => b.metadataBadgeRenderer?.label === 'LIVE') ? 'LIVE' : '');
          let thumbnail = `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
          if (v.thumbnail?.thumbnails && v.thumbnail.thumbnails.length > 0) {
            thumbnail = v.thumbnail.thumbnails[v.thumbnail.thumbnails.length - 1].url;
          }
          results.push({
            id: v.videoId,
            title,
            channel,
            duration,
            thumbnail
          });
          if (results.length >= 25) break;
        }
      }
    }
    if (results.length >= 25) break;
  }

  return results;
}

/**
 * Secondary Fallback: Direct YouTube HTML Search Scrape
 */
async function searchViaHtmlScrape(rawQuery) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(rawQuery)}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'km,en-US;q=0.9,en;q=0.8',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  };

  const html = await new Promise((resolve, reject) => {
    const request = https.get(searchUrl, { headers }, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => resolve(data));
    });

    request.on('error', err => reject(err));
    request.setTimeout(6000, () => {
      request.destroy();
      reject(new Error('YouTube search timeout (6s)'));
    });
  });

  const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData\s*=\s*({.+?});/s);
  if (!match) return [];

  const parsed = JSON.parse(match[1]);
  const contents = parsed.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
  const results = [];

  if (contents && Array.isArray(contents)) {
    for (const section of contents) {
      const videoItems = section.itemSectionRenderer?.contents || [];
      for (const item of videoItems) {
        const v = item.videoRenderer;
        if (v && v.videoId) {
          const rawTitle = v.title?.runs ? v.title.runs.map(r => r.text).join('') : (v.title?.simpleText || '');
          const title = decodeHtmlEntities(rawTitle);
          
          if (title) {
            const channel = decodeHtmlEntities(v.ownerText?.runs?.[0]?.text || '');
            const duration = v.lengthText?.simpleText || (v.badges?.some(b => b.metadataBadgeRenderer?.label === 'LIVE') ? 'LIVE' : '');
            let thumbnail = `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
            if (v.thumbnail?.thumbnails && v.thumbnail.thumbnails.length > 0) {
              thumbnail = v.thumbnail.thumbnails[v.thumbnail.thumbnails.length - 1].url;
            }

            results.push({
              id: v.videoId,
              title,
              channel,
              duration,
              thumbnail
            });

            if (results.length >= 24) break;
          }
        }
      }
      if (results.length >= 24) break;
    }
  }

  return results;
}

/**
 * Searches YouTube for video items matching user's query
 * GET /api/youtube/search?q=...
 */
export async function searchYouTube(req, res) {
  try {
    const rawQuery = (req.query.q || '').trim();
    if (!rawQuery) {
      return res.status(200).json({
        success: true,
        query: '',
        results: FALLBACK_TRACKS
      });
    }

    const cacheKey = rawQuery.toLowerCase();
    const cached = searchCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return res.status(200).json({
        success: true,
        cached: true,
        query: rawQuery,
        results: cached.results
      });
    }

    let results = [];

    // Tier 1: Try InnerTube JSON API (Primary & Most Accurate)
    try {
      results = await searchViaInnerTube(rawQuery);
    } catch (innerErr) {
      console.warn('[YouTube Controller] InnerTube warning:', innerErr.message);
    }

    // Tier 2: Fallback to HTML Scraping if InnerTube yielded nothing
    if (!results || results.length === 0) {
      try {
        results = await searchViaHtmlScrape(rawQuery);
      } catch (scrapeErr) {
        console.warn('[YouTube Controller] HTML Scrape warning:', scrapeErr.message);
      }
    }

    if (!results || results.length === 0) {
      return res.status(200).json({
        success: true,
        fallback: true,
        query: rawQuery,
        results: FALLBACK_TRACKS
      });
    }

    // Cache successful search
    searchCache.set(cacheKey, {
      timestamp: Date.now(),
      results
    });

    if (searchCache.size > 200) {
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }

    return res.status(200).json({
      success: true,
      query: rawQuery,
      results
    });

  } catch (error) {
    console.warn('[YouTube Controller] Search warning:', error.message);
    return res.status(200).json({
      success: true,
      fallback: true,
      error: error.message,
      results: FALLBACK_TRACKS
    });
  }
}
