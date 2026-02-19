from risk_scoring import compute_risk

print("=== Risk Scoring Verification ===\n")

test_cases = [
    ("hey can u send me that report asap", "Input with ASAP"),
    ("Contact me at john@example.com", "Email PII"),
    ("Call me at 555-123-4567", "Phone PII"),
    ("I guarantee 100% success", "Overpromise"),
    ("This is NDA confidential", "Confidential"),
]

for text, description in test_cases:
    result = compute_risk(text)
    print(f"{description}:")
    print(f"  Text: '{text}'")
    print(f"  Score: {result.score}/100")
    print(f"  Level: {result.level}")
    print(f"  Flags: {result.flags}")
    print(f"  Reasons: {result.reasons}")
    print()

