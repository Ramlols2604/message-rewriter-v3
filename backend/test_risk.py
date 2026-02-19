from risk_scoring import compute_risk

test_cases = [
    "Hey can you send me that report?",
    "Contact me at john@example.com or 555-123-4567",
    "I guarantee this will be 100% risk free!",
    "Fix this ASAP or else!",
    "This is confidential NDA information, do not share",
]

for text in test_cases:
    result = compute_risk(text)
    print(f"\nText: {text}")
    print(f"Score: {result.score}, Level: {result.level}")
    print(f"Flags: {result.flags}")
    print(f"Reasons: {result.reasons}")
