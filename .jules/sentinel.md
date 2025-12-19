## 2025-12-19 - Prompt Injection Prevention
**Vulnerability:** User input (`concept`) was directly interpolated into the LLM prompt without sanitization, allowing potential prompt injection.
**Learning:** In LLM applications, user input acts as code (instructions). Direct interpolation is akin to SQL injection.
**Prevention:** Always sanitize/escape user inputs intended for prompts. Use delimiters (like triple quotes) and specific instructions to the model to treat input as data, and strip control characters.
