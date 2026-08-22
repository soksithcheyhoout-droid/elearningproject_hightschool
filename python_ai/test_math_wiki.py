import sys
import wikipedia
import sympy as sp

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# 1. Test Sympy Math solving
x = sp.Symbol('x')
expr = sp.sin(x)/x
lim = sp.limit(expr, x, 0)
deriv = sp.diff(x**3 + 5*x**2 - 7*x + 9, x)
integral = sp.integrate(3*x**2 + 2*x, x)

print("Math Solutions via Sympy:")
print(f"lim(x->0) [sin(x)/x] = {lim}")
print(f"d/dx [x^3 + 5x^2 - 7x + 9] = {deriv}")
print(f"int [3x^2 + 2x dx] = {integral}")

# 2. Test Wikipedia search
wikipedia.set_lang("km")
try:
    wiki_summary = wikipedia.summary("អង្គរវត្ត", sentences=3)
    print("\nWikipedia Khmer Summary (អង្គរវត្ត):")
    print(wiki_summary)
except Exception as e:
    print(f"Wiki error: {e}")
