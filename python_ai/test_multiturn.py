import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def resolve_contextual_query(current_prompt: str, history: list) -> str:
    """
    If user asks a follow-up like 'who is the director?', 'tell me more', 'where is it located?',
    this function merges the previous context entity to form a complete searchable query.
    """
    q = current_prompt.strip()
    pronouns = ['it', 'they', 'he', 'she', 'him', 'her', 'its', 'their', 'that', 'this', 'វា', 'គាត់', 'នោះ', 'នេះ', 'ហ្នឹង']
    
    # Check if query is a short follow-up or contains pronouns
    is_short_followup = len(q.split()) <= 4 or any(re.search(rf'\b{p}\b', q, re.IGNORECASE) for p in pronouns)
    is_vague = any(kw in q.lower() for kw in ['tell me more', 'how about', 'what else', 'more details', 'ប្រាប់បន្ថែម', 'មានអ្វីទៀត', 'ចុះ', 'ហើយ'])
    
    if (is_short_followup or is_vague) and history:
        # Find the last subject discussed in history
        for msg in reversed(history):
            text = msg.get('text', '') or msg.get('content', '')
            if msg.get('sender') == 'user' or msg.get('role') == 'user':
                prev_q = re.sub(r'^(?:can you|please|tell me|do you know|what is|who is)\s*', '', text, flags=re.IGNORECASE).strip('?!. ')
                if prev_q and len(prev_q) > 2:
                    return f"{prev_q} {q}"
    return q

# Test
history = [
    {"sender": "user", "text": "do you know beltei ?"},
    {"sender": "ai", "text": "បាទប្អូន! សាកលវិទ្យាល័យ ប៊ែលធី អន្តរជាតិ..."}
]

print("Follow-up 1 ('who is the director?'):", resolve_contextual_query("who is the director?", history))
print("Follow-up 2 ('tell me more'):", resolve_contextual_query("tell me more", history))
print("Follow-up 3 ('ចុះទីតាំងនៅឯណា?'):", resolve_contextual_query("ចុះទីតាំងនៅឯណា?", history))
