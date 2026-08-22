import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def is_wiki_match_relevant(query_subject: str, wiki_title: str, wiki_summary: str) -> bool:
    """Verifies that the Wikipedia result actually matches the searched subject."""
    q = query_subject.lower().strip()
    title = wiki_title.lower().strip()
    summary = (wiki_summary or '').lower()[:300]
    
    # 1. Direct or partial title match
    if q in title or title in q:
        return True
    
    # 2. Token overlap (e.g. "isaac newton" -> "newton")
    q_tokens = [t for t in re.split(r'\s+', q) if len(t) > 2]
    if any(tok in title for tok in q_tokens):
        return True
        
    # 3. Appears in the first 300 characters of the summary
    if any(tok in summary for tok in q_tokens):
        return True

    return False

# Test cases
print("Beltei vs Khan Chbar Ampov:", is_wiki_match_relevant("beltei", "Khan Chbar Ampov", "Khan Chbar Ampov is a district in Phnom Penh.")) # False
print("Cambodia vs Cambodia:", is_wiki_match_relevant("cambodia", "Cambodia", "Cambodia is a country in Southeast Asia.")) # True
print("Angkor Wat vs Angkor Wat:", is_wiki_match_relevant("angkor wat", "Angkor Wat", "Angkor Wat is a temple complex in Cambodia.")) # True
print("Newton vs Isaac Newton:", is_wiki_match_relevant("newton", "Isaac Newton", "Sir Isaac Newton was an English mathematician.")) # True
