import sys
import json
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def test_duckduckgo_ai(prompt: str):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/event-stream',
        'Accept-Language': 'en-US,en;q=0.9',
        'x-vqd-accept': '1',
    }
    
    # 1. Fetch status token (vqd)
    status_resp = requests.get('https://duckduckgo.com/duckchat/v1/status', headers=headers, timeout=10)
    vqd = status_resp.headers.get('x-vqd-4')
    if not vqd:
        print("Failed to get VQD token:", status_resp.status_code)
        return None

    # 2. Chat with model (gpt-4o-mini, claude-3-haiku, or meta-llama/Llama-3.3-70B-Instruct)
    chat_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/event-stream',
        'Content-Type': 'application/json',
        'x-vqd-4': vqd,
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    chat_resp = requests.post('https://duckduckgo.com/duckchat/v1/chat', headers=chat_headers, json=payload, timeout=20, stream=True)
    
    full_text = []
    for line in chat_resp.iter_lines():
        if line:
            decoded = line.decode('utf-8')
            if decoded.startswith('data: '):
                data_str = decoded[6:]
                if data_str.strip() == '[DONE]':
                    break
                try:
                    chunk = json.loads(data_str)
                    msg = chunk.get('message', '')
                    if msg:
                        full_text.append(msg)
                except:
                    pass
                    
    return ''.join(full_text)

if __name__ == '__main__':
    q = "តើព្រះបាទជ័យវរ្ម័នទី៧ បានសាងសង់ប្រាសាទអ្វីខ្លះ? សូមរៀបរាប់ខ្លីៗជាភាសាខ្មែរ"
    ans = test_duckduckgo_ai(q)
    print("Response:")
    print(ans)
