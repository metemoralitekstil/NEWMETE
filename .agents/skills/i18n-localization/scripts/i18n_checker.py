#!/usr/bin/env python3
"""
i18n Key Parity & Missing Translation Checker
Scans JSON locale files or translation dictionaries to ensure complete coverage across all languages.
"""

import os
import sys
import json

def check_locale_parity(locales_dir, base_lang="tr"):
    if not os.path.isdir(locales_dir):
        print(f"Error: Directory '{locales_dir}' not found.")
        return 1

    files = [f for f in os.listdir(locales_dir) if f.endswith(".json")]
    if not files:
        print(f"No JSON files found in {locales_dir}")
        return 1

    base_file = os.path.join(locales_dir, f"{base_lang}.json")
    if not os.path.exists(base_file):
        print(f"Base locale file '{base_file}' not found.")
        return 1

    with open(base_file, "r", encoding="utf-8") as f:
        base_data = json.load(f)

    def extract_keys(d, prefix=""):
        keys = set()
        for k, v in d.items():
            curr = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.update(extract_keys(v, curr))
            else:
                keys.add(curr)
        return keys

    base_keys = extract_keys(base_data)
    print(f"Base language '{base_lang}' has {len(base_keys)} keys.")

    has_errors = False
    for filename in files:
        if filename == f"{base_lang}.json":
            continue
        lang = filename.replace(".json", "")
        file_path = os.path.join(locales_dir, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            target_data = json.load(f)

        target_keys = extract_keys(target_data)
        missing = base_keys - target_keys
        extra = target_keys - base_keys

        if missing:
            print(f"[{lang}] MISSING {len(missing)} keys:")
            for m in sorted(missing)[:10]:
                print(f"  - {m}")
            if len(missing) > 10:
                print(f"  ... and {len(missing) - 10} more.")
            has_errors = True
        else:
            print(f"[{lang}] OK (100% key parity)")

        if extra:
            print(f"[{lang}] NOTE: {len(extra)} extra keys not in base.")

    return 1 if has_errors else 0

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "./locales"
    base = sys.argv[2] if len(sys.argv) > 2 else "tr"
    sys.exit(check_locale_parity(target, base))
