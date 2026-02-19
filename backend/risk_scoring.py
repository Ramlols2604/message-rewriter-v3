import re
from typing import Set, List
from dataclasses import dataclass


WEIGHTS = {
    # PII & Personal Data
    "PII_EMAIL": 40,
    "PII_PHONE": 40,
    "PII_SSN": 50,
    "PII_CREDIT_CARD": 50,
    
    # Behavioral Risks
    "THREAT_OR_VIOLENCE": 30,
    "HARASSMENT_HATE": 30,
    "SEXUAL_CONTENT": 30,
    "OVERPROMISE": 15,
    "AGGRESSIVE": 10,
    
    # Compliance Risks
    "CONFIDENTIAL_HINT": 20,
    "BYPASS_OFFICIAL_CHANNELS": 35,
    "FINANCIAL_DISCLOSURE": 40,
    "HIPAA_MEDICAL_INFO": 45,
    "CUSTOMER_DATA_SHARE": 35,
    "INSIDER_TRADING": 50,
    "LEGAL_CONTRACT_DISCUSS": 30,
    "CREDENTIALS_EXPOSURE": 45,
    "DISCRIMINATION": 40,
    "REGULATORY_VIOLATION": 35,
}

THREAT_KEYWORDS = [
    "hurt", "kill", "destroy", "ruin", "make you", "pay for this"
]

HARASSMENT_KEYWORDS = [
    "hate", "stupid", "idiot", "worthless", "pathetic", "loser"
]

SEXUAL_KEYWORDS = [
    "sexual", "porn", "explicit", "nude", "nsfw"
]

OVERPROMISE_KEYWORDS = [
    "guarantee", "guaranteed", "risk free", "risk-free", "100%", 
    "definitely", "promise", "promised"
]

AGGRESSIVE_KEYWORDS = [
    "asap", "immediately", "unacceptable", "you need to", "fix this now",
    "right now", "urgent"
]

CONFIDENTIAL_KEYWORDS = [
    "nda", "confidential", "do not share", "internal only", "proprietary",
    "secret", "classified"
]

BYPASS_CHANNEL_KEYWORDS = [
    "personal email", "personally", "private email", "personal account",
    "off the record", "offline", "side channel", "direct message me",
    "dm me", "text me personally", "call my cell", "my personal",
    "outside of work", "not through work", "bypass", "workaround"
]

FINANCIAL_KEYWORDS = [
    "revenue", "earnings", "profit", "loss", "quarterly results",
    "financial results", "sales figures", "budget numbers", "p&l",
    "margin", "ebitda", "cash flow", "valuation", "funding round",
    "acquisition price", "stock price", "ipo", "pre-announce"
]

HIPAA_KEYWORDS = [
    "patient", "diagnosis", "medical record", "health condition",
    "treatment", "prescription", "hipaa", "phi", "medical history",
    "symptoms", "illness", "disease", "medication", "doctor visit"
]

CUSTOMER_DATA_KEYWORDS = [
    "customer data", "user data", "client information", "customer list",
    "customer database", "export customers", "share customer", "client list",
    "contact list", "lead list", "crm export"
]

INSIDER_TRADING_KEYWORDS = [
    "material non-public", "mnpi", "insider information", "before announcement",
    "not yet public", "not public yet", "embargoed", "pre-release", 
    "confidential earnings", "unreleased numbers", "pending acquisition", 
    "merger talks", "unannounced", "acquisition", "merger", "buyout",
    "stock tip", "inside info"
]

LEGAL_CONTRACT_KEYWORDS = [
    "legal dispute", "lawsuit", "litigation", "settlement", "contract breach",
    "violation", "non-compliance", "sue", "legal action", "attorney",
    "court case", "subpoena", "deposition"
]

CREDENTIALS_KEYWORDS = [
    "password", "credentials", "api key", "access token", "private key",
    "ssh key", "certificate", "secret key", "auth token", "login",
    "username and password", "admin access", "root access"
]

DISCRIMINATION_KEYWORDS = [
    "too old", "too young", "younger candidate", "older candidate",
    "pregnant", "maternity", "disability", "disabled",
    "age requirement", "prefer younger", "prefer older", 
    "prefer male", "prefer female", "only hire", "must be young",
    "cultural fit", "not a good fit", "overqualified"
]

REGULATORY_KEYWORDS = [
    "gdpr", "ccpa", "sox", "pci", "compliance violation", "audit finding",
    "regulatory breach", "fda violation", "sec violation", "ftc complaint",
    "privacy violation", "data breach"
]


@dataclass
class RiskResult:
    score: int
    level: str
    reasons: List[str]
    flags: Set[str]


def detect_email(text: str) -> bool:
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return bool(re.search(pattern, text))


def detect_phone(text: str) -> bool:
    patterns = [
        r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',
        r'\(\d{3}\)\s?\d{3}[-.\s]?\d{4}',
        r'\b\d{10}\b'
    ]
    return any(re.search(pattern, text) for pattern in patterns)


def detect_ssn(text: str) -> bool:
    pattern = r'\b\d{3}-\d{2}-\d{4}\b'
    return bool(re.search(pattern, text))


def detect_credit_card(text: str) -> bool:
    pattern = r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{3,4}\b'
    return bool(re.search(pattern, text))


def detect_keywords(text: str, keywords: List[str]) -> bool:
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in keywords)


def detect_flags(text: str) -> Set[str]:
    flags = set()
    
    if detect_email(text):
        flags.add("PII_EMAIL")
    
    if detect_phone(text):
        flags.add("PII_PHONE")
    
    if detect_ssn(text):
        flags.add("PII_SSN")
    
    if detect_credit_card(text):
        flags.add("PII_CREDIT_CARD")
    
    if detect_keywords(text, THREAT_KEYWORDS):
        flags.add("THREAT_OR_VIOLENCE")
    
    if detect_keywords(text, HARASSMENT_KEYWORDS):
        flags.add("HARASSMENT_HATE")
    
    if detect_keywords(text, SEXUAL_KEYWORDS):
        flags.add("SEXUAL_CONTENT")
    
    if detect_keywords(text, OVERPROMISE_KEYWORDS):
        flags.add("OVERPROMISE")
    
    if detect_keywords(text, AGGRESSIVE_KEYWORDS):
        flags.add("AGGRESSIVE")
    
    if detect_keywords(text, CONFIDENTIAL_KEYWORDS):
        flags.add("CONFIDENTIAL_HINT")
    
    if detect_keywords(text, BYPASS_CHANNEL_KEYWORDS):
        flags.add("BYPASS_OFFICIAL_CHANNELS")
    
    if detect_keywords(text, FINANCIAL_KEYWORDS):
        flags.add("FINANCIAL_DISCLOSURE")
    
    if detect_keywords(text, HIPAA_KEYWORDS):
        flags.add("HIPAA_MEDICAL_INFO")
    
    if detect_keywords(text, CUSTOMER_DATA_KEYWORDS):
        flags.add("CUSTOMER_DATA_SHARE")
    
    if detect_keywords(text, INSIDER_TRADING_KEYWORDS):
        flags.add("INSIDER_TRADING")
    
    if detect_keywords(text, LEGAL_CONTRACT_KEYWORDS):
        flags.add("LEGAL_CONTRACT_DISCUSS")
    
    if detect_keywords(text, CREDENTIALS_KEYWORDS):
        flags.add("CREDENTIALS_EXPOSURE")
    
    if detect_keywords(text, DISCRIMINATION_KEYWORDS):
        flags.add("DISCRIMINATION")
    
    if detect_keywords(text, REGULATORY_KEYWORDS):
        flags.add("REGULATORY_VIOLATION")
    
    return flags


def get_reason_label(flag: str) -> str:
    labels = {
        # PII & Personal Data
        "PII_EMAIL": "Contains email address",
        "PII_PHONE": "Contains phone number",
        "PII_SSN": "Contains SSN",
        "PII_CREDIT_CARD": "Contains credit card number",
        
        # Behavioral Risks
        "THREAT_OR_VIOLENCE": "Contains threatening language",
        "HARASSMENT_HATE": "Contains harassment or hate speech",
        "SEXUAL_CONTENT": "Contains sexual content",
        "OVERPROMISE": "Contains overpromising language",
        "AGGRESSIVE": "Contains aggressive tone",
        
        # Compliance Risks
        "CONFIDENTIAL_HINT": "Contains confidential information markers",
        "BYPASS_OFFICIAL_CHANNELS": "Requests communication outside official channels",
        "FINANCIAL_DISCLOSURE": "Contains sensitive financial information",
        "HIPAA_MEDICAL_INFO": "Contains protected health information (PHI/HIPAA)",
        "CUSTOMER_DATA_SHARE": "Requests sharing customer data improperly",
        "INSIDER_TRADING": "Contains material non-public information (MNPI)",
        "LEGAL_CONTRACT_DISCUSS": "Discusses legal matters or disputes",
        "CREDENTIALS_EXPOSURE": "Contains passwords or access credentials",
        "DISCRIMINATION": "Contains potentially discriminatory language",
        "REGULATORY_VIOLATION": "References regulatory compliance issues",
    }
    return labels.get(flag, flag)


def compute_risk(text: str) -> RiskResult:
    flags = detect_flags(text)
    
    score = sum(WEIGHTS[flag] for flag in flags)
    score = min(score, 100)
    
    if score < 30:
        level = "Low"
    elif score < 60:
        level = "Medium"
    else:
        level = "High"
    
    sorted_flags = sorted(flags, key=lambda f: WEIGHTS[f], reverse=True)
    top_flags = sorted_flags[:3]
    reasons = [get_reason_label(flag) for flag in top_flags]
    
    return RiskResult(
        score=score,
        level=level,
        reasons=reasons,
        flags=flags
    )
