import sys
import json
import logging

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from duckduckgo_search import DDGS
from g4f.client import Client

# Configure logging
logging.basicConfig(level=logging.INFO)

def web_search(query: str, max_results: int = 4):
    """Search Google/Web live without API key."""
    try:
        ddgs = DDGS()
        results = list(ddgs.text(query, max_results=max_results))
        return results
    except Exception as e:
        print(f"Search warning: {e}", file=sys.stderr)
        return []

def ask_ai(query: str, chat_history=None):
    """Generate dynamic AI answers using Web Search + Free AI Provider without any API Key."""
    # 1. Perform Live Web Search to get fresh Google/Web context
    search_results = web_search(query, max_results=4)
    
    context_text = ""
    if search_results:
        context_text = "\n\n--- ព័ត៌មានស្រង់ពីអ៊ីនធឺណិត (Live Web Search Context) ---\n"
        for i, item in enumerate(search_results, 1):
            title = item.get('title', '')
            body = item.get('body', '')
            link = item.get('href', '')
            context_text += f"{i}. **{title}**\n{body}\nប្រភព: {link}\n\n"

    # 2. System prompt
    system_prompt = (
        "You are 'MoEYS MoTDAR Super AI' — an advanced, intelligent, and helpful educational and general AI tutor.\n"
        "You can answer ANY question thoroughly, accurately, and dynamically in Khmer or English.\n"
        "Explain step-by-step with clear logic, formulas (using LaTeX notation like $x^2$ where applicable), "
        "and clear examples.\n"
        "If live web search information is provided, use it to ensure the most up-to-date and accurate answer."
    )

    messages = [
        {"role": "system", "content": system_prompt}
    ]

    if chat_history and isinstance(chat_history, list):
        for msg in chat_history[-6:]:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})

    user_content = query
    if context_text:
        user_content = f"{query}\n\n[Live Google/Web Search Data]:\n{context_text}"

    messages.append({"role": "user", "content": user_content})

    # 3. Call Free AI providers via g4f (Auto fallback)
    client = Client()
    models_to_try = ["gpt-4o", "gpt-4", "gpt-3.5-turbo", "claude-3.5-sonnet", "gemini-flash"]
    
    for model in models_to_try:
        try:
            print(f"Attempting model: {model}...", file=sys.stderr)
            response = client.chat.completions.create(
                model=model,
                messages=messages,
            )
            reply = response.choices[0].message.content
            if reply and len(reply.strip()) > 5:
                return reply
        except Exception as e:
            print(f"Model {model} failed: {e}", file=sys.stderr)
            continue

    # Fallback to direct web summarizer if LLM provider has network limits
    if search_results:
        summary = "🔍 **ព័ត៌មានស្រាវជ្រាវផ្ទាល់ពី Google/Web (Live Search Results) ៖**\n\n"
        for i, item in enumerate(search_results, 1):
            summary += f"### {i}. {item.get('title')}\n{item.get('body')}\n🔗 [តំណភ្ជាប់]({item.get('href')})\n\n"
        return summary

    return "សូមអភ័យទោស មិនអាចទាញយកចម្លើយបាននៅពេលនេះ សូមព្យាយាមម្តងទៀត។"

if __name__ == "__main__":
    test_q = "តើព្រះបាទជ័យវរ្ម័នទី៧ បានសាងសង់ប្រាសាទអ្វីខ្លះ?"
    print(f"Testing Question: {test_q}")
    ans = ask_ai(test_q)
    print("\n--- AI Response ---\n")
    print(ans)
