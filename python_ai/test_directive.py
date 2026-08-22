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

def handle_language_directive(query: str, history: list):
    q = query.strip()
    q_lower = q.lower()
    
    # 1. English directive
    is_switch_english = bool(re.search(r'\b(?:speak|talk|reply|answer|chat|use|write|tell\s+me)\s+(?:in\s+)?english\b|^(?:english\s+bro|english\s+please|switch\s+to\s+english)$', q_lower))
    # 2. Khmer directive
    is_switch_khmer = bool(re.search(r'\b(?:speak|talk|reply|answer|chat|use|write)\s+(?:in\s+)?khmer\b|^(?:khmer\s+bro|khmer\s+please|switch\s+to\s+khmer|និយាយខ្មែរ|និយាយភាសាខ្មែរ|ឆ្លើយជាខ្មែរ|ប្តូរមកខ្មែរ)$', q_lower))
    
    if is_switch_english:
        last_ai_text = ""
        for m in reversed(history):
            sender = m.get('sender') or m.get('role')
            if sender in ['ai', 'model', 'assistant']:
                last_ai_text = m.get('text') or m.get('content') or ''
                last_ai_text = re.sub(r'^\*\*🎓[^\*]+\*\*\s*', '', last_ai_text).strip()
                break
        
        if last_ai_text:
            translated = translate_text_live(last_ai_text, 'en')
            return f"**🎓 MoTDAR Ministry AI Tutor (English):**\n\nSure! Here is the explanation in English:\n\n{translated}\n\n💡 *Feel free to continue asking any questions in English!*"
        else:
            return "**🎓 MoTDAR Ministry AI Tutor (English):**\n\nHello! I am now speaking in English. What subject, mathematics problem, or question would you like to discuss?"

    if is_switch_khmer:
        last_ai_text = ""
        for m in reversed(history):
            sender = m.get('sender') or m.get('role')
            if sender in ['ai', 'model', 'assistant']:
                last_ai_text = m.get('text') or m.get('content') or ''
                last_ai_text = re.sub(r'^\*\*🎓[^\*]+\*\*\s*', '', last_ai_text).strip()
                break
        
        if last_ai_text:
            translated = translate_text_live(last_ai_text, 'km')
            return f"**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nបាទប្អូន! នេះជាការពន្យល់ជាភាសាខ្មែរ ៖\n\n{translated}\n\n💡 *ប្អូនអាចបន្តសួរសំណួរជាភាសាខ្មែរបន្ថែមទៀតបាន!*"
        else:
            return "**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nសួស្តីប្អូន! លោកគ្រូកំពុងនិយាយជាភាសាខ្មែរជាមួយប្អូន។ តើប្អូនមានចម្ងល់លើមេរៀន ឬសំណួរអ្វីខ្លះដែរ?"

    return None

# Test with previous Khmer lesson
history = [
    {"sender": "user", "text": "សួរអំពីច្បាប់ញូតុន"},
    {"sender": "ai", "text": "**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nច្បាប់ទី២ញូតុនចែងថា ផលបូកកម្លាំង ΣF = m * a។ កម្លាំងគិតជាញូតុន ម៉ាសគិតជាគីឡូក្រាម និងសំទុះគិតជា m/s²។"}
]

print("=== TEST 'speak english bro' ===")
print(handle_language_directive("speak english bro", history))
