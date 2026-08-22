import sys
import g4f

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

providers = [
    g4f.Provider.Airforce,
    g4f.Provider.CablyAI,
    g4f.Provider.Nexra,
    g4f.Provider.Pizzagpt,
    g4f.Provider.TeachAnything,
    g4f.Provider.ChatgptFree,
    g4f.Provider.FreeNetfly,
    g4f.Provider.Koala
]

for p in providers:
    try:
        name = p.__name__
        print(f"Testing {name}...")
        client = g4f.client.Client(provider=p)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello, respond with: 'OK I AM ALIVE'"}]
        )
        print(f"✅ SUCCESS with {name}: {response.choices[0].message.content}")
        break
    except Exception as e:
        print(f"❌ FAILED {name}: {e}")
