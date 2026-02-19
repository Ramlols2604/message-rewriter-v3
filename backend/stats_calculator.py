import re
from models import Stats


def calculate_stats(text: str) -> Stats:
    char_count = len(text)
    
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    sentence_count = len(sentences)
    
    lines = text.split('\n')
    bullet_count = 0
    for line in lines:
        if re.match(r'^\s*[-•]\s', line):
            bullet_count += 1
        elif re.match(r'^\s*\d+\.\s', line):
            bullet_count += 1
    
    return Stats(
        character_count=char_count,
        sentence_count=sentence_count,
        bullet_count=bullet_count
    )
