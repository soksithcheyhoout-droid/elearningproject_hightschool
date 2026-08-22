import sys
import urllib.parse
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def translate_text_free(text: str, target_lang: str = 'km') -> str:
    """Translates any text to Khmer (km) or English (en) with 0 API key."""
    if not text or not text.strip():
        return ""
    try:
        encoded = urllib.parse.quote(text.strip())
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={target_lang}&dt=t&q={encoded}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        }
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data and data[0]:
                return ''.join([p[0] for p in data[0] if p and p[0]])
    except Exception as e:
        print(f"Translation error: {e}")
    return text

if __name__ == '__main__':
    en_sample = "Isaac Newton was an English mathematician, physicist, astronomer, and author who is widely recognized as one of the greatest mathematicians and physicists of all time."
    km_out = translate_text_free(en_sample, 'km')
    print("Translated to Khmer:")
    print(km_out)
    
    km_sample = "សួស្តីលោកគ្រូ តើភពណាដែលនៅជិតព្រះអាទិត្យជាងគេ?"
    en_out = translate_text_free(km_sample, 'en')
    print("\nTranslated to English:")
    print(en_out)
