import sys
import g4f
from g4f.Provider import (
    Airforce,
    Blackbox,
    CablyAI,
    DarkAI,
    DDG,
    DeepInfra,
    FreeChatgpt,
    GizAI,
    Liaobots,
    Nexra,
    OpenaiChat,
    PerplexityLabs,
    Pi,
    Pizzagpt,
    PollinationsAI,
    ReplicateHome,
    RubiksAI,
    TeachAnything,
    You
)

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

test_list = [
    PollinationsAI,
    Blackbox,
    Airforce,
    DarkAI,
    Pizzagpt,
    TeachAnything,
    DeepInfra,
    Pi
]

prompt = "សួស្តី! តើប្អូនអាចសួរអ្វីបានខ្លះ?"

for prov in test_list:
    try:
        print(f"Testing: {prov.__name__}...")
        resp = g4f.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            provider=prov,
            timeout=8
        )
        print(f"✅ SUCCESS with {prov.__name__}:\n{resp}\n")
    except Exception as e:
        print(f"❌ {prov.__name__} failed: {e}")
