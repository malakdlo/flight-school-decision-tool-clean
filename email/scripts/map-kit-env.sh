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

echo "Fetching Kit tags, forms, and custom fields..."
TAGS_JSON=$(curl -sS \
  --request GET \
  --url "https://api.kit.com/v4/tags" \
  --header "X-Kit-Api-Key: $KIT_API_KEY")

FORMS_JSON=$(curl -sS \
  --request GET \
  --url "https://api.kit.com/v4/forms" \
  --header "X-Kit-Api-Key: $KIT_API_KEY")

FIELDS_JSON=$(curl -sS \
  --request GET \
  --url "https://api.kit.com/v4/custom_fields" \
  --header "X-Kit-Api-Key: $KIT_API_KEY")

find_tag_id() {
  local name1="$1"
  local name2="${2:-}"
  local name3="${3:-}"

  echo "$TAGS_JSON" | jq -r \
    --arg name1 "$name1" \
    --arg name2 "$name2" \
    --arg name3 "$name3" \
    '.tags[] | select(.name == $name1 or .name == $name2 or .name == $name3) | .id' \
    | head -n 1
}

echo ""
echo "# Copy/paste these into email/.env.local"
echo ""

echo "KIT_TAG_LEAD_QUIZ_COMPLETED=$(find_tag_id "lead_quiz_completed" "KIT_TAG_LEAD_QUIZ_COMPLETED")"
echo "KIT_TAG_LEAD_PDF_REQUESTED=$(find_tag_id "lead_pdf_requested" "KIT_TAG_LEAD_PDF_REQUESTED")"
echo "KIT_TAG_SEGMENT_CAREER_CAPTAIN=$(find_tag_id "segment_career_captain" "KIT_TAG_SEGMENT_CAREER_CAPTAIN")"
echo "KIT_TAG_SEGMENT_WEEKEND_HOBBYIST=$(find_tag_id "segment_weekend_hobbyist" "KIT_TAG_SEGMENT_WEEKEND_HOBBYIST")"
echo "KIT_TAG_SEGMENT_PERSONAL_OWNER=$(find_tag_id "segment_personal_owner" "KIT_TAG_SEGMENT_PERSONAL_OWNER")"
echo "KIT_TAG_SEGMENT_RESEARCH_FIRST=$(find_tag_id "segment_research_first" "KIT_TAG_SEGMENT_RESEARCH_FIRST")"
echo "KIT_TAG_SOURCE_FSF_SITE=$(find_tag_id "source_fsf_site" "KIT_TAG_SOURCE_FSF_SITE")"
echo "KIT_TAG_SOURCE_QUIZ_RESULT_PAGE=$(find_tag_id "source_quiz_result_page" "KIT_TAG_SOURCE_QUIZ_RESULT_PAGE")"

echo ""
FORM_ID=$(echo "$FORMS_JSON" | jq -r '.forms[]? | select(.name == "FSF Quiz Result Email Capture") | .id' | head -n 1)
if [ -n "$FORM_ID" ]; then
  echo "KIT_FORM_ID=$FORM_ID"
fi

echo "KIT_FIELD_QUIZ_SEGMENT=quiz_segment"
echo "KIT_FIELD_SOURCE_PAGE=source_page"
echo "KIT_FIELD_UTM_SOURCE=utm_source"
echo "KIT_FIELD_UTM_MEDIUM=utm_medium"
echo "KIT_FIELD_UTM_CAMPAIGN=utm_campaign"

echo ""
echo "# Existing custom fields found in Kit"
echo "$FIELDS_JSON" | jq -r '.custom_fields[]? | "# \(.key) | \(.label)"'

echo ""
echo "If any tag value is blank, neither the lowercase tag name nor accidental env-style tag name was found in Kit."
