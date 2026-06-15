#!/usr/bin/env bash
set -euo pipefail

EMAIL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$EMAIL_DIR/.env.local"

REQUIRED_TAG_VARS=(
  KIT_TAG_LEAD_QUIZ_COMPLETED
  KIT_TAG_LEAD_PDF_REQUESTED
  KIT_TAG_SEGMENT_CAREER_CAPTAIN
  KIT_TAG_SEGMENT_WEEKEND_HOBBYIST
  KIT_TAG_SEGMENT_PERSONAL_OWNER
  KIT_TAG_SEGMENT_RESEARCH_FIRST
  KIT_TAG_SOURCE_FSF_SITE
  KIT_TAG_SOURCE_QUIZ_RESULT_PAGE
)

REQUIRED_FIELD_VARS=(
  KIT_FIELD_QUIZ_SEGMENT
  KIT_FIELD_SOURCE_PAGE
  KIT_FIELD_UTM_SOURCE
  KIT_FIELD_UTM_MEDIUM
  KIT_FIELD_UTM_CAMPAIGN
)

require_jq() {
  if ! command -v jq >/dev/null 2>&1; then
    echo "Missing jq. Install it with: brew install jq"
    exit 1
  fi
}

mask_key() {
  local key="$1"
  printf "%s...%s (%s chars)" "${key:0:4}" "${key: -4}" "${#key}"
}

fetch_kit() {
  local path="$1"
  curl -sS \
    --request GET \
    --url "https://api.kit.com/v4/$path" \
    --header "X-Kit-Api-Key: $KIT_API_KEY"
}

env_value() {
  local name="$1"
  printf "%s" "${!name:-}"
}

require_jq

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [ -z "${KIT_API_KEY:-}" ]; then
  echo "❌ KIT_API_KEY missing from env"
  exit 1
fi

echo "Using Kit API key: $(mask_key "$KIT_API_KEY")"
echo "Fetching Kit tags, custom fields, and forms..."

TAGS_JSON=$(fetch_kit "tags")
FIELDS_JSON=$(fetch_kit "custom_fields")
FORMS_JSON=$(fetch_kit "forms")

echo ""
echo "Kit env verification"
echo ""

echo "Core"
echo "✅ KIT_API_KEY present and masked"

if [ -z "${KIT_FORM_ID:-}" ]; then
  echo "❌ KIT_FORM_ID missing from env"
else
  FORM_FOUND=$(echo "$FORMS_JSON" | jq -r --arg id "$KIT_FORM_ID" '.forms[]? | select((.id | tostring) == $id) | .id' | head -n 1)
  if [ -n "$FORM_FOUND" ]; then
    FORM_NAME=$(echo "$FORMS_JSON" | jq -r --arg id "$KIT_FORM_ID" '.forms[]? | select((.id | tostring) == $id) | .name // "unnamed"' | head -n 1)
    echo "✅ KIT_FORM_ID=$KIT_FORM_ID present and valid ($FORM_NAME)"
  else
    echo "⚠️ KIT_FORM_ID=$KIT_FORM_ID present but not found in Kit"
  fi
fi

echo ""
echo "Tags"
for env_name in "${REQUIRED_TAG_VARS[@]}"; do
  value="$(env_value "$env_name")"
  if [ -z "$value" ]; then
    echo "❌ $env_name missing from env"
    continue
  fi

  tag_name=$(echo "$TAGS_JSON" | jq -r --arg id "$value" '.tags[]? | select((.id | tostring) == $id) | .name // empty' | head -n 1)
  if [ -n "$tag_name" ]; then
    echo "✅ $env_name=$value present and valid ($tag_name)"
  else
    echo "⚠️ $env_name=$value present but not found in Kit"
  fi
done

echo ""
echo "Custom fields"
for env_name in "${REQUIRED_FIELD_VARS[@]}"; do
  value="$(env_value "$env_name")"
  if [ -z "$value" ]; then
    echo "❌ $env_name missing from env"
    continue
  fi

  field_label=$(echo "$FIELDS_JSON" | jq -r --arg key "$value" '.custom_fields[]? | select(.key == $key) | .label // empty' | head -n 1)
  if [ -n "$field_label" ]; then
    echo "✅ $env_name=$value present and valid ($field_label)"
  else
    echo "⚠️ $env_name=$value present but not found in Kit"
  fi
done
