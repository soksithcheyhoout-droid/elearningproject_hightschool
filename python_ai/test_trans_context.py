import sys
import re
import urllib.parse
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def translate_text_live(text: str, target_lang: str = 'km') -> str:
    if not text or not text.strip():
        return ""
    try:
        encoded = urllib.parse.quote(text.strip()[:2500])
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
        print(f"Translation warning: {e}")
    return text

def handle_translate_request(query: str, history: list):
    q = query.strip()
    q_lower = q.lower()
    
    is_translate_to_english = bool(re.search(r'\b(?:translate|explain|convert|change|say)\s+(?:this\s+|it\s+)?(?:in|into|to)\s+english\b|^(?:in\s+english|english\s+please|translate\s+to\s+english|translate\s+into\s+english)$', q_lower))
    is_translate_to_khmer = bool(re.search(r'\b(?:translate|explain|convert|change|say)\s+(?:this\s+|it\s+)?(?:in|into|to)\s+khmer\b|^(?:ជាភាសាខ្មែរ|បកប្រែជាភាសាខ្មែរ|បកប្រែមកខ្មែរ|បកប្រែជាខ្មែរ|translate\s+to\s+khmer)$', q_lower))
    
    if is_translate_to_english:
        # Find last AI message from history
        last_ai_text = ""
        for m in reversed(history):
            if m.get('sender') == 'ai' or m.get('role') == 'model' or m.get('role') == 'assistant':
                last_ai_text = m.get('text') or m.get('content') or ''
                # Strip header prefix
                last_ai_text = re.sub(r'^\*\*🎓[^\*]+\*\*\s*', '', last_ai_text).strip()
                break
        
        if last_ai_text:
            translated = translate_text_live(last_ai_text, 'en')
            return f"**🎓 MoTDAR Ministry AI Tutor (English Translation):**\n\n{translated}"
            
    return None

# Test with previous Khmer message
history = [
    {"sender": "user", "text": "សួរអំពីកម្ពុជា"},
    {"sender": "ai", "text": "**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nប្រទេសកម្ពុជា ជាផ្លូវការ ព្រះរាជាណាចក្រកម្ពុជា គឺជាប្រទេសមួយនៅអាស៊ីអាគ្នេយ៍ដីគោក។ រាជធានីគឺ ភ្នំពេញ។"}
]

print("Test 'can you translate into english':")
print(handle_translate_request("can you translate into english", history))
