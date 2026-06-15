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
  echo "Create it and add: KIT_API_KEY=your_v4_key_here"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [ -z "${KIT_API_KEY:-}" ]; then
  echo "KIT_API_KEY is missing from $ENV_FILE"
  exit 1
fi

create_tag() {
  local env_name="$1"
  local tag_name="$2"

  local response
  response=$(curl -sS \
    --request POST \
    --url "https://api.kit.com/v4/tags" \
    --header "Content-Type: application/json" \
    --header "X-Kit-Api-Key: $KIT_API_KEY" \
    --data "$(jq -nc --arg name "$tag_name" '{name:$name}')")

  local tag_id
  tag_id=$(echo "$response" | jq -r '.tag.id // empty')

  if [ -z "$tag_id" ]; then
    echo "ERROR creating/finding tag: $tag_name" >&2
    echo "$response" | jq >&2
    return 1
  fi

  echo "$env_name=$tag_id"
}

create_field() {
  local env_name="$1"
  local field_label="$2"

  local response
  response=$(curl -sS \
    --request POST \
    --url "https://api.kit.com/v4/custom_fields" \
    --header "Content-Type: application/json" \
    --header "X-Kit-Api-Key: $KIT_API_KEY" \
    --data "$(jq -nc --arg label "$field_label" '{label:$label}')")

  local field_key
  field_key=$(echo "$response" | jq -r '.custom_field.key // empty')

  if [ -z "$field_key" ]; then
    echo "ERROR creating/finding custom field: $field_label" >&2
    echo "$response" | jq >&2
    return 1
  fi

  echo "$env_name=$field_key"
}

echo ""
echo "# Copy these Kit tag env vars into email/.env.local"
create_tag "KIT_TAG_LEAD_QUIZ_COMPLETED" "lead_quiz_completed"
create_tag "KIT_TAG_LEAD_PDF_REQUESTED" "lead_pdf_requested"
create_tag "KIT_TAG_SEGMENT_CAREER_CAPTAIN" "segment_career_captain"
create_tag "KIT_TAG_SEGMENT_WEEKEND_HOBBYIST" "segment_weekend_hobbyist"
create_tag "KIT_TAG_SEGMENT_PERSONAL_OWNER" "segment_personal_owner"
create_tag "KIT_TAG_SEGMENT_RESEARCH_FIRST" "segment_research_first"
create_tag "KIT_TAG_SOURCE_FSF_SITE" "source_fsf_site"
create_tag "KIT_TAG_SOURCE_QUIZ_RESULT_PAGE" "source_quiz_result_page"

echo ""
echo "# Copy these Kit custom field env vars into email/.env.local"
create_field "KIT_FIELD_QUIZ_SEGMENT" "quiz_segment"
create_field "KIT_FIELD_SOURCE_PAGE" "source_page"
create_field "KIT_FIELD_UTM_SOURCE" "utm_source"
create_field "KIT_FIELD_UTM_MEDIUM" "utm_medium"
create_field "KIT_FIELD_UTM_CAMPAIGN" "utm_campaign"

echo ""
echo "Done. Copy the env vars above into:"
echo "$ENV_FILE"
