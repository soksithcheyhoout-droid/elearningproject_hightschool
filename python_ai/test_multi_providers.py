import sys
import g4f
from g4f.Provider import (
    TeachAnything,
    Pollinations,
    PhindAi,
    Cerebras,
    LMArena,
    OperaAria,
    You,
    Pi
)

test_providers = [
    TeachAnything,
    Pollinations,
    PhindAi,
    Cerebras,
    LMArena,
    OperaAria,
    You,
    Pi
]

prompt = "សួស្តី តើអង្គរវត្តសាងសង់ដោយនរណា? សូមឆ្លើយជាភាសាខ្មែរ"

for prov in test_providers:
    prov_name = prov.__name__
    print(f"Testing {prov_name}...")
    try:
        resp = g4f.ChatCompletion.create(
            model=g4f.models.default,
            provider=prov,
            messages=[{"role": "user", "content": prompt}],
            timeout=8
        )
        if resp and len(resp.strip()) > 5:
            print(f"SUCCESS with {prov_name} -> {resp[:120]}...\n")
    except Exception as e:
        print(f"Failed {prov_name}: {str(e)[:60]}\n")
