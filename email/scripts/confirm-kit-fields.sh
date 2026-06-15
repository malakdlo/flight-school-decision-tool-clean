#!/usr/bin/env bash
set -euo pipefail

EMAIL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$EMAIL_DIR/.env.local"

if ! command -v jq >/dev/null 2>&1; then
  echo "Missing jq. Install it with: brew install jq"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [ -z "${KIT_API_KEY:-}" ]; then
  echo "KIT_API_KEY is missing from $ENV_FILE"
  exit 1
fi

echo "Fetching Kit custom fields..."
FIELDS_JSON=$(curl -sS \
  --request GET \
  --url "https://api.kit.com/v4/custom_fields" \
  --header "X-Kit-Api-Key: $KIT_API_KEY")

echo ""
echo "Existing Kit custom fields:"
echo "$FIELDS_JSON" | jq -r '.custom_fields[]? | "- key=\(.key) | label=\(.label)"'

echo ""
echo "Checking required fields..."
echo ""

check_field() {
  local env_name="$1"
  local expected_key="$2"

  local found
  found=$(echo "$FIELDS_JSON" | jq -r \
    --arg key "$expected_key" \
    '.custom_fields[]? | select(.key == $key or .label == $key) | .key' \
    | head -n 1)

  if [ -n "$found" ]; then
    echo "✅ $env_name=$found"
  else
    echo "❌ Missing: $env_name expected key/label '$expected_key'"
  fi
}

check_field "KIT_FIELD_QUIZ_SEGMENT" "${KIT_FIELD_QUIZ_SEGMENT:-quiz_segment}"
check_field "KIT_FIELD_SOURCE_PAGE" "${KIT_FIELD_SOURCE_PAGE:-source_page}"
check_field "KIT_FIELD_UTM_SOURCE" "${KIT_FIELD_UTM_SOURCE:-utm_source}"
check_field "KIT_FIELD_UTM_MEDIUM" "${KIT_FIELD_UTM_MEDIUM:-utm_medium}"
check_field "KIT_FIELD_UTM_CAMPAIGN" "${KIT_FIELD_UTM_CAMPAIGN:-utm_campaign}"

echo ""
echo "This script verifies fields only. Create missing fields manually in Kit, or use setup-kit-tags.sh if you intentionally want the setup script to create tags and fields."
