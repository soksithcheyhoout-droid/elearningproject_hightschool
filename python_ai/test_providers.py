import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

import g4f
from g4f.Provider import (
    Blackbox,
    DDG,
    DeepInfraChat,
    FreeChatgpt,
    GizAI,
    Liaobots,
    Pizzagpt,
    Airforce,
    ChatGptEs
)

providers = [
    Airforce,
    Blackbox,
    Pizzagpt,
    GizAI,
    ChatGptEs,
    DDG
]

prompt = "Hello! Answer in 1 sentence: What is the capital of Cambodia?"

for p in providers:
    try:
        print(f"Testing provider: {p.__name__}...")
        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            messages=[{"role": "user", "content": prompt}],
            provider=p,
        )
        print(f"SUCCESS with {p.__name__}: {response}\n")
        break
    except Exception as e:
        print(f"FAILED {p.__name__}: {e}\n")
