import sys
import g4f

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

providers = [
    'Puter',
    'Airforce',
    'DeepInfra',
    'FenayAI',
    'TeachAnything',
    'GlhfChat',
    'PhindAi',
    'Pi',
    'BlackboxPro',
    'LMArena'
]

client = g4f.client.Client()

for name in providers:
    try:
        provider = getattr(g4f.Provider, name, None)
        if not provider:
            continue
        print(f"Testing provider {name}...")
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello! Reply with 'HELLO STUDENT'"}],
            provider=provider
        )
        content = resp.choices[0].message.content
        print(f"✅ SUCCESS with {name}: {content}\n")
        break
    except Exception as e:
        print(f"❌ Failed {name}: {e}\n")
