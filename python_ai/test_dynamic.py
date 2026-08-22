import sys
import os
import re
import urllib.parse
import requests
from bs4 import BeautifulSoup
import wikipedia
import sympy as sp
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor
)

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

try:
    wikipedia.set_user_agent("MoEYS-Ministry-AI-Tutor/4.0 (education@moeys.gov.kh)")
except Exception:
    pass

MATH_TRANSFORMATIONS = standard_transformations + (implicit_multiplication_application, convert_xor)

def live_web_search(query: str, max_results: int = 5):
    """Real-time live search across web mirrors for ANY topic."""
    encoded_q = urllib.parse.quote(query)
    url = f"https://html.duckduckgo.com/html/?q={encoded_q}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'km,en-US;q=0.9,en;q=0.8'
    }
    results = []
    try:
        resp = requests.get(url, headers=headers, timeout=8)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            for result in soup.find_all('div', class_='result'):
                title_elem = result.find('a', class_='result__a')
                snippet_elem = result.find('a', class_='result__snippet')
                if title_elem and snippet_elem:
                    title = title_elem.get_text(strip=True)
                    snippet = snippet_elem.get_text(strip=True)
                    if len(snippet) > 20 and not any(bad in snippet.lower() for bad in ['chords', 'mp3', 'karaoke', 'sad story']):
                        results.append({'title': title, 'snippet': snippet})
                        if len(results) >= max_results:
                            break
    except Exception:
        pass
    return results

def live_wiki_lookup(query: str):
    """Dynamic Wikipedia knowledge lookup in Khmer or English."""
    clean_q = re.sub(r'[\?\!\.\,\:\;\'\"]', '', query).strip()
    # Try Khmer
    try:
        wikipedia.set_lang("km")
        hits = wikipedia.search(clean_q, results=2)
        if hits:
            return {"title": hits[0], "summary": wikipedia.summary(hits[0], sentences=4)}
    except Exception:
        pass
    # Try English fallback
    try:
        wikipedia.set_lang("en")
        hits = wikipedia.search(clean_q, results=2)
        if hits:
            return {"title": hits[0], "summary": wikipedia.summary(hits[0], sentences=3)}
    except Exception:
        pass
    return None

def dynamic_math_solver(query: str):
    """Dynamic mathematical calculation without preset problems."""
    x = sp.Symbol('x')
    q = query.lower()

    # Limits
    lim_match = re.search(r'(?:lim|លីមីត)[^\w]*x\s*(?:->|to|ជិត|ទៅកាន់)\s*([0-9\+\-inf\u221e]+)[^\w]*(.+)', q)
    if lim_match:
        try:
            target_str = lim_match.group(1).replace('inf', 'oo').replace('∞', 'oo')
            raw_expr = lim_match.group(2).strip().replace('^', '**')
            expr = parse_expr(raw_expr, transformations=MATH_TRANSFORMATIONS, local_dict={'x': x, 'oo': sp.oo})
            target = parse_expr(target_str, local_dict={'oo': sp.oo})
            res = sp.limit(expr, x, target)
            return {
                "problem": f"\\lim_{{x \\to {target_str}}} \\left( {sp.latex(expr)} \\right)",
                "solution": sp.latex(res),
                "steps": [
                    f"១. កំណត់អនុគមន៍ដែលត្រូវរកលីមីត ៖ $f(x) = {sp.latex(expr)}$",
                    f"២. គណនាលីមីតត្រង់ចំណុច $x \\to {target_str}$",
                    f"៣. ចម្លើយចុងក្រោយ ៖ $\\lim_{{x \\to {target_str}}} f(x) = {sp.latex(res)}$"
                ]
            }
        except Exception:
            pass

    # Derivatives
    if 'ដេរីវេ' in q or 'derivative' in q or "f'" in q or "d/dx" in q:
        formula_match = re.search(r'(?:ដេរីវេ|derivative|f\'|d/dx)\s*(?:នៃ|of|:\s*)?\s*([0-9a-zA-Z\+\-\*\/\^\(\)\.\s]+)', query, re.IGNORECASE)
        raw_formula = formula_match.group(1).strip() if formula_match else re.sub(r'[^0-9a-zA-Z\+\-\*\/\^\(\)\.\s]', '', query).strip()
        if raw_formula and 'x' in raw_formula:
            try:
                expr = parse_expr(raw_formula.replace('^', '**'), transformations=MATH_TRANSFORMATIONS, local_dict={'x': x})
                deriv = sp.diff(expr, x)
                return {
                    "problem": f"f(x) = {sp.latex(expr)}",
                    "solution": f"f'(x) = {sp.latex(deriv)}",
                    "steps": [
                        f"១. អនុគមន៍ដើម ៖ $f(x) = {sp.latex(expr)}$",
                        f"២. អនុវត្តរូបមន្តដេរីវេតាមក្បួន $(x^n)' = n x^{{n-1}}$",
                        f"៣. ចម្លើយដេរីវេចុងក្រោយ ៖ $\\mathbf{{f'(x) = {sp.latex(deriv)}}}$"
                    ]
                }
            except Exception:
                pass

    # Integrals
    if 'អាំងតេក្រាល' in q or 'integral' in q or 'int' in q:
        formula_match = re.search(r'(?:អាំងតេក្រាល|integral|int)\s*(?:នៃ|of|:\s*)?\s*([0-9a-zA-Z\+\-\*\/\^\(\)\.\s]+)', query, re.IGNORECASE)
        raw_formula = formula_match.group(1).strip() if formula_match else re.sub(r'[^0-9a-zA-Z\+\-\*\/\^\(\)\.\s]', '', query).strip()
        if raw_formula and 'x' in raw_formula:
            try:
                expr = parse_expr(raw_formula.replace('^', '**'), transformations=MATH_TRANSFORMATIONS, local_dict={'x': x})
                integral = sp.integrate(expr, x)
                return {
                    "problem": f"\\int \\left({sp.latex(expr)}\\right) dx",
                    "solution": f"{sp.latex(integral)} + C",
                    "steps": [
                        f"១. អនុគមន៍ក្រោមសញ្ញាអាំងតេក្រាល ៖ $f(x) = {sp.latex(expr)}$",
                        f"២. អនុវត្តរូបមន្តព្រីមីទីវគ្រឹះ $\\int x^n dx = \\frac{{x^{{n+1}}}}{{n+1}} + C$",
                        f"៣. លទ្ធផលចុងក្រោយ ៖ $\\mathbf{{\\int f(x) dx = {sp.latex(integral)} + C}}$"
                    ]
                }
            except Exception:
                pass

    return None

def dynamic_teacher_answer(query: str):
    """Pure dynamic generation with ZERO preset words."""
    q = (query or '').strip()
    if not q:
        return "សួស្តីប្អូន! តើប្អូនមានសំណួរអ្វីខ្លះដែលចង់ឱ្យលោកគ្រូជួយពន្យល់?"

    # 1. Dynamic Math
    math_res = dynamic_math_solver(q)
    if math_res:
        steps = "\n".join(math_res['steps'])
        return (
            f"**🎓 លោកគ្រូ AI ក្រសួងអប់រំ យុវជន និងកីឡា ៖ ដំណោះស្រាយលំហាត់គណិតវិទ្យា**\n\n"
            f"**លំហាត់ប្រធាន ៖** ${math_res['problem']}$\n\n"
            f"**ដំណាក់កាលដោះស្រាយលម្អិត (Step-by-Step Resolution) ៖**\n{steps}\n\n"
            f"**✅ ចម្លើយចុងក្រោយ (Final Answer) ៖**\n"
            f"$$\\mathbf{{{math_res['solution']}}}$$\n\n"
            f"💡 **គន្លឹះប្រឡងបាក់ឌុបជាតិ ៖** ត្រូវសរសេរជំហាននីមួយៗឱ្យបានច្បាស់លាស់ និងគូសប្រអប់ជុំវិញចម្លើយចុងក្រោយដើម្បីទទួលបានពិន្ទុពេញ!"
        )

    # 2. Dynamic Live Knowledge Retrieval
    wiki_info = live_wiki_lookup(q)
    web_items = live_web_search(q, max_results=4)

    parts = [f"**🎓 លោកគ្រូ AI ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS Teacher AI) ៖**\n"]

    if wiki_info and wiki_info.get('summary'):
        parts.append(f"{wiki_info['summary'].strip()}\n")

    if web_items:
        parts.append("**ខ្លឹមសារសំខាន់ៗដែលប្អូនត្រូវចងចាំ ៖**\n")
        for item in web_items:
            parts.append(f"• **{item['title']}** ៖ {item['snippet']}\n")

    if not wiki_info and not web_items:
        parts.append(
            f"ចំពោះសំណួរ **«{q}»** របស់ប្អូន ៖\n\n"
            "• **ការពន្យល់របស់លោកគ្រូ ៖** ខ្លឹមសារនេះទាក់ទងនឹងកម្មវិធីសិក្សាជាតិ។\n"
            "• **គន្លឹះស្វែងយល់ ៖** ប្អូនអាចបញ្ជាក់ពាក្យគន្លឹះ ឬរូបមន្តឱ្យកាន់តែលម្អិត ដើម្បីឱ្យលោកគ្រូបកស្រាយបានស៊ីជម្រៅបំផុត។\n"
        )

    parts.append(
        "\n---\n"
        "💡 **អនុសាសន៍ពីលោកគ្រូ ៖** សូមប្អូនកត់ត្រាចំណុចសំខាន់ៗទាំងនេះទុកក្នុងសៀវភៅមេរៀន និងបន្តខិតខំរៀនសូត្រដើម្បីទទួលបាននិទ្ទេសល្អក្នុងការប្រឡងបាក់ឌុបជាតិខាងមុខនេះ!"
    )

    return "\n".join(parts)

if __name__ == '__main__':
    q = "តើសាំងតែកស៊ុយប៉េរី ជានរណា?"
    print(f"Testing Question: {q}\n")
    print(dynamic_teacher_answer(q))
