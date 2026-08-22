import sys
import requests
from bs4 import BeautifulSoup
from googlesearch import search

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def google_search_live(query: str, num_results: int = 4):
    """Real-time Google search without any API key."""
    results = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }
    
    try:
        urls = list(search(query, num_results=num_results, lang='km'))
        for url in urls[:num_results]:
            try:
                resp = requests.get(url, headers=headers, timeout=5)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, 'html.parser')
                    title = soup.title.string.strip() if soup.title else url
                    # Extract main paragraph content
                    paragraphs = [p.get_text().strip() for p in soup.find_all('p') if len(p.get_text().strip()) > 30]
                    body_text = " ".join(paragraphs[:3])
                    if body_text:
                        results.append({
                            'title': title,
                            'url': url,
                            'snippet': body_text[:400]
                        })
            except Exception:
                continue
    except Exception as e:
        print(f"Google search error: {e}")
        
    return results

if __name__ == '__main__':
    q = "ព្រះបាទជ័យវរ្ម័នទី៧ ប្រាសាទ"
    print(f"Searching Google for: {q}")
    res = google_search_live(q, 3)
    print(f"Found {len(res)} results:")
    for r in res:
        print(f"\nTitle: {r['title']}\nURL: {r['url']}\nSnippet: {r['snippet']}\n")
