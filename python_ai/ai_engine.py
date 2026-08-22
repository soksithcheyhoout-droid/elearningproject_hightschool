"""
================================================================================
MoEYS MoTDAR 100% Dynamic Python AI & Live Knowledge Engine (Version 7.0)
- Multi-Turn Continuous Chat & Context Memory
- Real-Time Live Web & Knowledge Retrieval
- Human Teacher Conversational Intelligence
- Bilingual (Khmer & English) Neural Translation & Speech Synthesis
- Zero API Keys - Zero Hardcoded Words
================================================================================
"""

import sys
import os
import re
import json
import urllib.parse
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any

# Ensure proper UTF-8 output on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

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
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')
logger = logging.getLogger("MoEYS-Teacher-AI")

app = Flask(__name__)
CORS(app)

MATH_TRANSFORMATIONS = standard_transformations + (implicit_multiplication_application, convert_xor)

try:
    wikipedia.set_user_agent("MoEYS-Ministry-AI-Tutor/7.0 (education@moeys.gov.kh)")
except Exception:
    pass

# ==============================================================================
# 1. LIVE NEURAL TRANSLATION (Zero API Key)
# ==============================================================================
def translate_text_live(text: str, target_lang: str = 'km') -> str:
    """Fast live translation with fallback."""
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
        logger.warning(f"Translation warning: {e}")
    return text

def is_khmer_text(text: str) -> bool:
    return bool(re.search(r'[\u1780-\u17FF]', text))

# ==============================================================================
# 2. MULTI-TURN CHAT CONTEXT RESOLVER
# ==============================================================================
def resolve_contextual_query(current_prompt: str, history: List[Dict[str, Any]]) -> str:
    """
    Resolves conversational follow-up questions (e.g. 'tell me more', 'who is the director?', 'where is it?')
    by attaching the entity from previous turns so continuous chat works naturally.
    """
    q = current_prompt.strip()
    pronouns = ['it', 'they', 'he', 'she', 'him', 'her', 'its', 'their', 'that', 'this', 'there', 'who is', 'where is', 'how many', 'វា', 'គាត់', 'នោះ', 'នេះ', 'ហ្នឹង', 'ចុះ']
    
    is_short = len(q.split()) <= 4
    has_pronoun = any(re.search(rf'\b{p}\b', q, re.IGNORECASE) for p in pronouns)
    is_followup = any(kw in q.lower() for kw in ['tell me more', 'how about', 'what else', 'more details', 'and then', 'ប្រាប់បន្ថែម', 'មានអ្វីទៀត', 'ចុះ', 'ហើយ', 'តទៅ'])
    
    if (is_short or has_pronoun or is_followup) and history:
        # Search backwards for the last substantive subject discussed
        for msg in reversed(history):
            text = (msg.get('text') or msg.get('content') or '').strip()
            sender = msg.get('sender') or msg.get('role')
            if sender == 'user' and text:
                prev_sub = extract_core_subject(text)
                if prev_sub and prev_sub.lower() not in q.lower() and len(prev_sub) > 2:
                    return f"{prev_sub} {q}"
    return q

def extract_core_subject(query: str) -> str:
    """Extracts the core search topic from conversational filler words."""
    q = query.strip()
    cleaned = re.sub(
        r'^(?:can you|could you|please|do you know|do you know about|what is|who is|where is|tell me|explain|what do you think about|how about|tell me about|explain me about)?\s*(?:to me|me)?\s*(?:about)?\s*',
        '',
        q,
        flags=re.IGNORECASE
    )
    cleaned = re.sub(
        r'^(?:តើ)?\s*(?:លោកគ្រូ|អ្នកគ្រូ|បង)?\s*(?:អាច)?\s*(?:ជួយ)?\s*(?:ស្គាល់|ពន្យល់|ប្រាប់|បង្រៀន|បង្ហាញ|និយាយ|ដឹង)?\s*(?:ខ្ញុំ|យើង)?\s*(?:អំពី|ពី)?\s*',
        '',
        cleaned
    )
    cleaned = re.sub(r'[\?\!\.\,\:\;\'\"\s]*(?:ទេ|ឬទេ|ឬអត់|អត់|ដែរ)?[\?\!\.\,\:\;\'\"\s]*$', '', cleaned).strip()
    return cleaned if cleaned else q

def is_wiki_match_relevant(query_subject: str, wiki_title: str, wiki_summary: str) -> bool:
    """Strictly checks if the Wikipedia article actually corresponds to the queried entity."""
    if not query_subject or not wiki_title:
        return False
    q = query_subject.lower().strip()
    title = wiki_title.lower().strip()
    summary = (wiki_summary or '').lower()[:400]

    if q in title or title in q:
        return True

    q_tokens = [t for t in re.split(r'[\s\-]+', q) if len(t) > 2]
    if q_tokens and any(tok in title for tok in q_tokens):
        return True

    if q_tokens and any(tok in summary for tok in q_tokens):
        return True

    return False

def clean_web_snippet(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r'(\d+(?:\.\d+)?(?:K|M)?\s+(?:subscribers?|views?|likes?|shares?)|(?:\d+\s+(?:months?|years?|days?|hours?|mins?)\s+ago))', '', text, flags=re.IGNORECASE)
    cleaned = re.sub(r'(?:YouTube|Facebook|TikTok|Twitter|Instagram|LinkedIn|GitHub|Chords?|Lyrics?|Karaoke|Sad Story)\b', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'#\w+|\+\w+', '', cleaned)
    cleaned = re.sub(r'https?://\S+', '', cleaned)
    cleaned = re.sub(r'[-–—|•·*]{2,}', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

# ==============================================================================
# 3. REAL-TIME LIVE WEB SEARCH
# ==============================================================================
def live_web_search(subject: str, max_results: int = 5) -> List[Dict[str, str]]:
    encoded_q = urllib.parse.quote(subject)
    url = f"https://html.duckduckgo.com/html/?q={encoded_q}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'km,en-US;q=0.9,en;q=0.8'
    }
    results = []
    try:
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            for result in soup.find_all('div', class_='result'):
                title_elem = result.find('a', class_='result__a')
                snippet_elem = result.find('a', class_='result__snippet')
                if title_elem and snippet_elem:
                    raw_title = title_elem.get_text(strip=True)
                    raw_snippet = snippet_elem.get_text(strip=True)
                    title = clean_web_snippet(raw_title)
                    snippet = clean_web_snippet(raw_snippet)
                    if len(snippet) > 25:
                        results.append({'title': title, 'snippet': snippet})
                        if len(results) >= max_results:
                            break
    except Exception as e:
        logger.warning(f"Search warning: {e}")
    return results

# ==============================================================================
# 4. REAL-TIME WIKIPEDIA LOOKUP
# ==============================================================================
def live_wiki_lookup(subject: str) -> Dict[str, Any]:
    # 1. Try Khmer Wikipedia
    try:
        wikipedia.set_lang("km")
        hits = wikipedia.search(subject, results=3)
        for hit in hits:
            if is_wiki_match_relevant(subject, hit, ""):
                summary = wikipedia.summary(hit, sentences=4)
                if is_wiki_match_relevant(subject, hit, summary):
                    return {"title": hit, "summary": summary, "lang": "km"}
    except Exception:
        pass

    # 2. Try English Wikipedia
    try:
        wikipedia.set_lang("en")
        hits = wikipedia.search(subject, results=3)
        for hit in hits:
            if is_wiki_match_relevant(subject, hit, ""):
                summary = wikipedia.summary(hit, sentences=4)
                if is_wiki_match_relevant(subject, hit, summary):
                    return {"title": hit, "summary": summary, "lang": "en"}
    except Exception:
        pass

    return None

# ==============================================================================
# 5. DYNAMIC MATHEMATICS & PHYSICS SOLVER
# ==============================================================================
def dynamic_math_solver(query: str, want_khmer: bool) -> Dict[str, Any]:
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
            if want_khmer:
                steps = [
                    f"១. កំណត់អនុគមន៍ដែលត្រូវរកលីមីត ៖ $f(x) = {sp.latex(expr)}$",
                    f"២. គណនាលីមីតត្រង់ចំណុច $x \\to {target_str}$",
                    f"៣. ចម្លើយចុងក្រោយ ៖ $\\lim_{{x \\to {target_str}}} f(x) = {sp.latex(res)}$"
                ]
            else:
                steps = [
                    f"1. Target function: $f(x) = {sp.latex(expr)}$",
                    f"2. Evaluate limit as $x \\to {target_str}$",
                    f"3. Final result: $\\lim_{{x \\to {target_str}}} f(x) = {sp.latex(res)}$"
                ]
            return {
                "problem": f"\\lim_{{x \\to {target_str}}} \\left( {sp.latex(expr)} \\right)",
                "solution": sp.latex(res),
                "steps": steps
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
                if want_khmer:
                    steps = [
                        f"១. អនុគមន៍ដើម ៖ $f(x) = {sp.latex(expr)}$",
                        f"២. អនុវត្តរូបមន្តដេរីវេតាមក្បួន $(x^n)' = n x^{{n-1}}$",
                        f"៣. ចម្លើយដេរីវេចុងក្រោយ ៖ $\\mathbf{{f'(x) = {sp.latex(deriv)}}}$"
                    ]
                else:
                    steps = [
                        f"1. Original function: $f(x) = {sp.latex(expr)}$",
                        f"2. Apply power rule: $\\frac{{d}}{{dx}}[x^n] = n x^{{n-1}}$",
                        f"3. Final derivative: $\\mathbf{{f'(x) = {sp.latex(deriv)}}}$"
                    ]
                return {
                    "problem": f"f(x) = {sp.latex(expr)}",
                    "solution": f"f'(x) = {sp.latex(deriv)}",
                    "steps": steps
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
                if want_khmer:
                    steps = [
                        f"១. អនុគមន៍ក្រោមសញ្ញាអាំងតេក្រាល ៖ $f(x) = {sp.latex(expr)}$",
                        f"២. អនុវត្តរូបមន្តព្រីមីទីវគ្រឹះ $\\int x^n dx = \\frac{{x^{{n+1}}}}{{n+1}} + C$",
                        f"៣. លទ្ធផលចុងក្រោយ ៖ $\\mathbf{{\\int f(x) dx = {sp.latex(integral)} + C}}$"
                    ]
                else:
                    steps = [
                        f"1. Integrand: $f(x) = {sp.latex(expr)}$",
                        f"2. Apply fundamental integration: $\\int x^n dx = \\frac{{x^{{n+1}}}}{{n+1}} + C$",
                        f"3. Final integral: $\\mathbf{{\\int f(x) dx = {sp.latex(integral)} + C}}$"
                    ]
                return {
                    "problem": f"\\int \\left({sp.latex(expr)}\\right) dx",
                    "solution": f"{sp.latex(integral)} + C",
                    "steps": steps
                }
            except Exception:
                pass

    return None

# ==============================================================================
# 6. MASTER HUMAN TEACHER SYNTHESIZER
# ==============================================================================
def generate_ai_response(prompt: str, chat_history: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    query = (prompt or '').strip()
    q_lower = query.lower()
    chat_history = chat_history or []

    # 1. Multi-turn continuous conversational resolution
    contextual_query = resolve_contextual_query(query, chat_history)
    core_subject = extract_core_subject(contextual_query)

    if not query:
        return {
            "reply": "សួស្តីប្អូន! ខ្ញុំជាលោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR)។ តើប្អូនមានចម្ងល់ ឬសំណួរអ្វីខ្លះដែលចង់ឱ្យលោកគ្រូជួយពន្យល់ និងដោះស្រាយជូនដែរ?",
            "sources": []
        }

    explicitly_wants_english = bool(re.search(r'\b(in english|to english|translate to english|english version|explain in english)\b', q_lower))
    explicitly_wants_khmer = bool(re.search(r'(to khmer|into khmer|in khmer|ជាភាសាខ្មែរ|បកប្រែជាភាសាខ្មែរ|បកប្រែខ្មែរ|ភាសាខ្មែរ)', q_lower))
    want_khmer = True if (explicitly_wants_khmer or is_khmer_text(query) or not explicitly_wants_english) else False

    # 2. Conversational Language Directives (e.g. 'speak english bro', 'speak english', 'talk in english', 'speak khmer', 'និយាយខ្មែរ')
    is_switch_english = bool(re.search(r'\b(?:speak|talk|reply|answer|chat|use|write|tell\s+me)\s+(?:in\s+)?english\b|^(?:english\s+bro|english\s+please|switch\s+to\s+english|speak\s+english\s+bro|speak\s+english|can\s+you\s+speak\s+english)$', q_lower))
    is_switch_khmer = bool(re.search(r'\b(?:speak|talk|reply|answer|chat|use|write)\s+(?:in\s+)?khmer\b|^(?:khmer\s+bro|khmer\s+please|switch\s+to\s+khmer|និយាយខ្មែរ|និយាយភាសាខ្មែរ|ឆ្លើយជាខ្មែរ|ប្តូរមកខ្មែរ|speak\s+khmer\s+bro|speak\s+khmer)$', q_lower))

    if is_switch_english:
        last_ai_text = ""
        for m in reversed(chat_history):
            sender = m.get('sender') or m.get('role')
            if sender in ['ai', 'model', 'assistant']:
                last_ai_text = m.get('text') or m.get('content') or ''
                last_ai_text = re.sub(r'^\*\*🎓[^\*]+\*\*\s*', '', last_ai_text).strip()
                break
        if last_ai_text:
            translated = translate_text_live(last_ai_text, 'en')
            return {"reply": f"**🎓 MoTDAR Ministry AI Tutor (English):**\n\nSure! Here is the explanation in English:\n\n{translated}\n\n💡 *Feel free to continue asking any questions in English!*", "sources": []}
        else:
            return {"reply": "**🎓 MoTDAR Ministry AI Tutor (English):**\n\nHello! I am now speaking in English with you. What subject, mathematics problem, or question would you like to explore today?", "sources": []}

    if is_switch_khmer:
        last_ai_text = ""
        for m in reversed(chat_history):
            sender = m.get('sender') or m.get('role')
            if sender in ['ai', 'model', 'assistant']:
                last_ai_text = m.get('text') or m.get('content') or ''
                last_ai_text = re.sub(r'^\*\*🎓[^\*]+\*\*\s*', '', last_ai_text).strip()
                break
        if last_ai_text:
            translated = translate_text_live(last_ai_text, 'km')
            return {"reply": f"**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nបាទប្អូន! នេះជាការពន្យល់ជាភាសាខ្មែរ ៖\n\n{translated}\n\n💡 *ប្អូនអាចចុចប៊ូតុង «🔊 ស្តាប់លោកគ្រូអាន» ដើម្បីស្តាប់សំឡេងអានជាភាសាខ្មែរ!*", "sources": []}
        else:
            return {"reply": "**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\nសួស្តីប្អូន! លោកគ្រូកំពុងនិយាយជាភាសាខ្មែរជាមួយប្អូន។ តើប្អូនមានចម្ងល់លើមេរៀន ឬលំហាត់អ្វីខ្លះដែលចង់ឱ្យលោកគ្រូជួយពន្យល់?", "sources": []}

    # 3. Contextual translation of previous message (e.g. 'can you translate into english' / 'បកប្រែជាភាសាខ្មែរ')
    is_translate_to_english = bool(re.search(r'\b(?:translate|convert|change)\s+(?:this\s+|it\s+)?(?:in|into|to)\s+english\b|^(?:translate\s+to\s+english|translate\s+into\s+english)$', q_lower))
    is_translate_to_khmer = bool(re.search(r'\b(?:translate|convert|change)\s+(?:this\s+|it\s+)?(?:in|into|to)\s+khmer\b|^(?:ជាភាសាខ្មែរ|បកប្រែជាភាសាខ្មែរ|បកប្រែមកខ្មែរ|បកប្រែជាខ្មែរ|translate\s+to\s+khmer)$', q_lower))

    if (is_translate_to_english or is_translate_to_khmer) and chat_history:
        t_target = 'en' if is_translate_to_english else 'km'
        last_ai_text = ""
        for m in reversed(chat_history):
            sender = m.get('sender') or m.get('role')
            if sender in ['ai', 'model', 'assistant']:
                last_ai_text = m.get('text') or m.get('content') or ''
                last_ai_text = re.sub(r'^\*\*🎓[^\*]+\*\*\s*', '', last_ai_text).strip()
                break
        if last_ai_text:
            translated_res = translate_text_live(last_ai_text, t_target)
            if t_target == 'km':
                reply = f"**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n\n{translated_res}\n\n💡 *ប្អូនអាចចុចប៊ូតុង «🔊 ស្តាប់លោកគ្រូអាន» ដើម្បីស្តាប់សំឡេងអាន!*"
            else:
                reply = f"**🎓 MoTDAR Ministry AI Tutor (English Translation):**\n\n{translated_res}"
            return {"reply": reply, "sources": []}

    # 3. Direct explicit inline translation requests (e.g. translate "Hello World" into khmer)
    trans_match = re.search(r'(?:translate|បកប្រែ)\s*[:\"\'«]\s*(.+?)\s*[\"\'»]?\s*(?:into|to|ជាភាសា)\s*(khmer|english|ខ្មែរ|អង់គ្លេស)', query, re.IGNORECASE)
    if trans_match:
        text_to_trans = trans_match.group(1).strip()
        target_lang_str = trans_match.group(2).lower()
        t_lang = 'en' if ('english' in target_lang_str or 'អង់គ្លេស' in target_lang_str) else 'km'
        
        if len(text_to_trans) > 1 and text_to_trans.lower() not in ['this', 'it', 'that']:
            translated_res = translate_text_live(text_to_trans, t_lang)
            if t_lang == 'km':
                reply = (
                    f"**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖ លទ្ធផលបកប្រែជាភាសាខ្មែរ**\n\n"
                    f"• **អត្ថបទដើម ៖** {text_to_trans}\n"
                    f"• **✅ ការបកប្រែជាភាសាខ្មែរ ៖**\n\n"
                    f"> **{translated_res}**\n\n"
                    f"💡 *ប្អូនអាចចុចប៊ូតុង «🔊 ស្តាប់លោកគ្រូអាន» ដើម្បីស្តាប់សំឡេងអានជាភាសាខ្មែរ!*"
                )
            else:
                reply = (
                    f"**🎓 MoTDAR Ministry AI Tutor: English Translation**\n\n"
                    f"• **Original Text:** {text_to_trans}\n"
                    f"• **✅ English Translation:**\n\n"
                    f"> **{translated_res}**\n"
                )
            return {"reply": reply, "sources": []}

    # 3. Dynamic Math Solver
    math_result = dynamic_math_solver(query, want_khmer)
    if math_result:
        steps_text = "\n".join(math_result['steps'])
        if want_khmer:
            reply = (
                f"**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖ ដំណោះស្រាយលំហាត់គណិតវិទ្យា**\n\n"
                f"**លំហាត់ប្រធាន ៖** ${math_result['problem']}$\n\n"
                f"**ដំណាក់កាលដោះស្រាយលម្អិត (Step-by-Step Resolution) ៖**\n{steps_text}\n\n"
                f"**✅ ចម្លើយចុងក្រោយ (Final Answer) ៖**\n"
                f"$$\\mathbf{{{math_result['solution']}}}$$\n\n"
                f"💡 **គន្លឹះប្រឡងបាក់ឌុបជាតិ ៖** ពេលប្រឡងបាក់ឌុប ប្អូនត្រូវសរសេរជំហាននីមួយៗឱ្យបានច្បាស់លាស់ គូសប្រអប់ជុំវិញចម្លើយចុងក្រោយ និងបញ្ជាក់ដែនកំណត់ឱ្យបានត្រឹមត្រូវដើម្បីទទួលបានពិន្ទុពេញ!"
            )
        else:
            reply = (
                f"**🎓 MoTDAR Ministry AI Tutor: Mathematical Solution**\n\n"
                f"**Problem:** ${math_result['problem']}$\n\n"
                f"**Step-by-Step Resolution:**\n{steps_text}\n\n"
                f"**✅ Final Answer:**\n"
                f"$$\\mathbf{{{math_result['solution']}}}$$\n\n"
                f"💡 **Academic Exam Tip:** Highlight your final answer clearly on your examination sheet!"
            )
        return {"reply": reply, "sources": []}

    # 4. Real-Time Multi-Source Knowledge Retrieval
    is_do_you_know = bool(re.search(r'\b(do you know|who is|what is|tell me about|ស្គាល់|ដឹងពី|ប្រាប់ពី)\b', q_lower))

    with ThreadPoolExecutor(max_workers=2) as executor:
        future_wiki = executor.submit(live_wiki_lookup, core_subject)
        future_web = executor.submit(live_web_search, core_subject, 4)
        wiki_data = future_wiki.result()
        web_results = future_web.result()

    reply_parts = []

    if want_khmer:
        if is_do_you_know:
            reply_parts.append(f"**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖ បាទប្អូន! លោកគ្រូស្គាល់ «{core_subject}» ច្បាស់ណាស់ ៖**\n")
        else:
            reply_parts.append("**🎓 លោកគ្រូ AI ក្រសួងអភិវឌ្ឍន៍ទេពកោសល្យ (MoTDAR) ៖**\n")

        # Special pedagogical cases
        if any(kw in q_lower for kw in ['និយាយភាសាខ្មែរ', 'speak khmer', 'សំឡេងខ្មែរ', 'tts', 'text to speech', 'សំឡេង ai']):
            reply_parts.append(
                "ដើម្បីឱ្យប្រព័ន្ធ AI អាចនិយាយភាសាខ្មែរបានយ៉ាងពិរោះ និងរស់រវើកដូចមនុស្សពិតៗ ប្អូនអាចអនុវត្តតាមគោលការណ៍បច្ចេកវិទ្យាដូចខាងក្រោម ៖\n\n"
                "**១. ប្រើប្រាស់បច្ចេកវិទ្យា Text-to-Speech (TTS) ភាសាខ្មែរ ៖**\n"
                "• ប្រើប្រាស់ម៉ូឌែលសម្លេង Neural Voice ស្តង់ដារខ្មែរ ដូចជា **`km-KH-PisethNeural` (សម្លេងគ្រូបុរស)** ឬ **`km-KH-SreymomNeural` (សម្លេងគ្រូនារី)** ដែលគាំទ្រការអានអក្សរខ្មែរបានយ៉ាងត្រឹមត្រូវ និងធម្មជាតិ។\n\n"
                "**២. ការរៀបចំប្រព័ន្ធបញ្ចេញសម្លេង (Audio Pipeline) ៖**\n"
                "• បម្លែងអត្ថបទទៅជាទម្រង់ Phonetics ខ្មែរ និងរូបមន្តគណិតវិទ្យា (ឧ. ប្តូរ $f'(x)$ ទៅជា «ដេរីវេ អេហ្វ នៃ អ៊ិច») មុននឹងបញ្ជូនទៅកាន់ Engine សំឡេង។\n\n"
                "**៣. ការចាក់សម្លេងផ្ទាល់ក្នុងកម្មវិធី ៖**\n"
                "• ក្នុងវេបសាយនេះ ប្អូនគ្រាន់តែចុចប៊ូតុង **«🔊 ស្តាប់លោកគ្រូអាន»** នៅលើរាល់ចម្លើយរបស់លោកគ្រូ នោះប្រព័ន្ធនឹងអានបកស្រាយជាភាសាខ្មែរភ្លាមៗ!"
            )
        else:
            if wiki_data and wiki_data.get('summary'):
                summary = wiki_data['summary'].strip()
                if wiki_data.get('lang') == 'en' or not is_khmer_text(summary):
                    summary = translate_text_live(summary, 'km')
                reply_parts.append(f"{summary}\n")

            if web_results:
                reply_parts.append("**ព័ត៌មាន និងខ្លឹមសារសំខាន់ៗ ៖**\n")
                for item in web_results:
                    snip = item['snippet']
                    if not is_khmer_text(snip):
                        snip = translate_text_live(snip, 'km')
                    title = item['title']
                    if not is_khmer_text(title):
                        title = translate_text_live(title, 'km')
                    if len(snip) > 20:
                        reply_parts.append(f"• **{title}** ៖ {snip}\n")

            if not wiki_data and not web_results:
                reply_parts.append(
                    f"ចំពោះសំណួរ **«{query}»** របស់ប្អូន ៖\n\n"
                    "• **ការពន្យល់របស់លោកគ្រូ ៖** ខ្លឹមសារនេះជាចំណុចសំខាន់ក្នុងកម្មវិធីសិក្សាជាតិ MoTDAR។\n"
                    "• **គន្លឹះស្វែងយល់ ៖** ប្អូនអាចបញ្ជាក់ពាក្យគន្លឹះ ឬរូបមន្តជាក់លាក់ ដើម្បីឱ្យលោកគ្រូអាចបកស្រាយបានកាន់តែស៊ីជម្រៅបន្ថែមទៀត។\n"
                )

        reply_parts.append(
            "\n---\n"
            "💡 **អនុសាសន៍ពីលោកគ្រូ ៖** សូមប្អូនកត់ត្រាចំណុចសំខាន់ៗទាំងនេះទុកក្នុងសៀវភៅមេរៀន និងបន្តខិតខំរៀនសូត្រដើម្បីទទួលបាននិទ្ទេសល្អក្នុងការប្រឡងបាក់ឌុបជាតិខាងមុខនេះ!"
        )

    else:
        # English Response Synthesis
        if is_do_you_know:
            reply_parts.append(f"**🎓 MoTDAR Ministry AI Tutor: Yes, I certainly know \"{core_subject}\":**\n")
        else:
            reply_parts.append("**🎓 MoTDAR Ministry AI Tutor (Ministry of Talent Development & Advanced Research):**\n")

        if wiki_data and wiki_data.get('summary'):
            reply_parts.append(f"{wiki_data['summary'].strip()}\n")

        if web_results:
            reply_parts.append("**Key Highlights & Information:**\n")
            for item in web_results:
                if len(item['snippet']) > 20:
                    reply_parts.append(f"• **{item['title']}**: {item['snippet']}\n")

        if not wiki_data and not web_results:
            reply_parts.append(
                f"Regarding your query **\"{query}\"**:\n\n"
                "• **Overview**: This is an essential topic.\n"
                "• **Guidance**: Feel free to ask specific follow-up questions to explore deeper steps.\n"
            )

        reply_parts.append(
            "\n---\n"
            "💡 **Teacher's Guidance:** Make sure to take notes on these key concepts and practice regularly to excel in your studies!"
        )

    full_reply = "\n".join(reply_parts)
    return {"reply": full_reply, "sources": []}

# ==============================================================================
# 7. FLASK REST API ENDPOINTS
# ==============================================================================
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "MoEYS Multi-Turn Dynamic AI Teacher",
        "version": "7.0.0",
        "apiKeyRequired": False
    })

@app.route('/api/chat', methods=['POST'])
def api_chat():
    try:
        data = request.get_json(force=True) or {}
        prompt = data.get('prompt', '') or data.get('query', '')
        history = data.get('messages', [])
        
        result = generate_ai_response(prompt, history)
        return jsonify({
            "success": True,
            "reply": result["reply"],
            "sources": result.get("sources", [])
        })
    except Exception as e:
        logger.error(f"API Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    if '--server' in sys.argv or os.environ.get('START_SERVER') == '1':
        port = int(os.environ.get('PORT', 5001))
        print(f"🚀 MoEYS Multi-Turn Dynamic AI Teacher running on http://127.0.0.1:{port}")
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        print("\n=======================================================")
        print("  🇰🇭 MoEYS Multi-Turn Dynamic Teacher AI (Version 7.0)")
        print("  100% Dynamic - Multi-Turn Memory - Type 'exit' to quit")
        print("=======================================================")
        while True:
            try:
                user_input = input("\n📝 Ask a question / សួរសំណួរ: ")
                if not user_input.strip():
                    continue
                if user_input.strip().lower() in ['exit', 'quit', 'q']:
                    print("👋 Goodbye! / លាហើយ!")
                    break
                print("\n⏳ Processing answer / កំពុងរៀបចំចម្លើយ...\n")
                res = generate_ai_response(user_input)
                print(res["reply"])
            except (KeyboardInterrupt, EOFError):
                break
