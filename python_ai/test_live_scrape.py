import sys
import urllib.parse
import requests
from bs4 import BeautifulSoup

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def google_live_scrape(query: str, max_results: int = 5):
    """Scrape live Google search directly without any API key."""
    encoded_q = urllib.parse.quote(query)
    url = f"https://html.duckduckgo.com/html/?q={encoded_q}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,km;q=0.8'
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            results = []
            
            # Find result links and snippets
            for result in soup.find_all('div', class_='result'):
                title_elem = result.find('a', class_='result__a')
                snippet_elem = result.find('a', class_='result__snippet')
                
                if title_elem and snippet_elem:
                    title = title_elem.get_text(strip=True)
                    snippet = snippet_elem.get_text(strip=True)
                    raw_link = title_elem.get('href', '')
                    
                    results.append({
                        'title': title,
                        'snippet': snippet,
                        'link': raw_link
                    })
                    if len(results) >= max_results:
                        break
            return results
    except Exception as e:
        print(f"Scrape error: {e}")
        return []

if __name__ == '__main__':
    q = "ព្រះបាទជ័យវរ្ម័នទី៧"
    print(f"Scraping for: {q}")
    items = google_live_scrape(q, 4)
    print(f"Found {len(items)} items:")
    for item in items:
        print(f"\nTitle: {item['title']}\nSnippet: {item['snippet']}\nLink: {item['link']}\n")
