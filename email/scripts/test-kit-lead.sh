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

TEST_EMAIL="${1:-}"
SEGMENT="${2:-career_captain}"
FIRST_NAME="${3:-Test}"

if [ -z "$TEST_EMAIL" ]; then
  echo "Usage:"
  echo "  ./scripts/test-kit-lead.sh your-email@example.com career_captain"
  echo ""
  echo "Supported segments:"
  echo "  career_captain"
  echo "  weekend_hobbyist"
  echo "  personal_owner"
  echo "  research_first"
  exit 1
fi

if [ -z "${KIT_API_KEY:-}" ]; then
  echo "KIT_API_KEY is missing from $ENV_FILE"
  exit 1
fi

case "$SEGMENT" in
  career_captain)
    SEGMENT_TAG_ENV="KIT_TAG_SEGMENT_CAREER_CAPTAIN"
    RESULT_PATH="/flight-school-decision-tool/results/career-captain/"
    ;;
  weekend_hobbyist)
    SEGMENT_TAG_ENV="KIT_TAG_SEGMENT_WEEKEND_HOBBYIST"
    RESULT_PATH="/flight-school-decision-tool/results/weekend-hobbyist/"
    ;;
  personal_owner)
    SEGMENT_TAG_ENV="KIT_TAG_SEGMENT_PERSONAL_OWNER"
    RESULT_PATH="/flight-school-decision-tool/results/personal-owner/"
    ;;
  research_first)
    SEGMENT_TAG_ENV="KIT_TAG_SEGMENT_RESEARCH_FIRST"
    RESULT_PATH="/flight-school-decision-tool/results/research-first/"
    ;;
  *)
    echo "Unsupported segment: $SEGMENT"
    exit 1
    ;;
esac

QUIZ_FIELD="${KIT_FIELD_QUIZ_SEGMENT:-quiz_segment}"
SOURCE_FIELD="${KIT_FIELD_SOURCE_PAGE:-source_page}"
UTM_SOURCE_FIELD="${KIT_FIELD_UTM_SOURCE:-utm_source}"
UTM_MEDIUM_FIELD="${KIT_FIELD_UTM_MEDIUM:-utm_medium}"
UTM_CAMPAIGN_FIELD="${KIT_FIELD_UTM_CAMPAIGN:-utm_campaign}"

FIELDS_JSON=$(jq -n \
  --arg quizKey "$QUIZ_FIELD" \
  --arg sourceKey "$SOURCE_FIELD" \
  --arg utmSourceKey "$UTM_SOURCE_FIELD" \
  --arg utmMediumKey "$UTM_MEDIUM_FIELD" \
  --arg utmCampaignKey "$UTM_CAMPAIGN_FIELD" \
  --arg segment "$SEGMENT" \
  --arg sourcePage "$RESULT_PATH" \
  '{
    ($quizKey): $segment,
    ($sourceKey): $sourcePage,
    ($utmSourceKey): "terminal_test",
    ($utmMediumKey): "manual",
    ($utmCampaignKey): "kit_setup"
  }')

PAYLOAD=$(jq -n \
  --arg email "$TEST_EMAIL" \
  --arg firstName "$FIRST_NAME" \
  --argjson fields "$FIELDS_JSON" \
  '{
    email_address: $email,
    first_name: $firstName,
    state: "active",
    fields: $fields
  }')

echo ""
echo "Creating/updating Kit subscriber..."
SUBSCRIBER_RESPONSE=$(curl -sS \
  --request POST \
  --url "https://api.kit.com/v4/subscribers" \
  --header "Content-Type: application/json" \
  --header "X-Kit-Api-Key: $KIT_API_KEY" \
  --data "$PAYLOAD")

SUBSCRIBER_ID=$(echo "$SUBSCRIBER_RESPONSE" | jq -r '.subscriber.id // empty')

if [ -z "$SUBSCRIBER_ID" ]; then
  echo "Could not find subscriber ID in Kit response."
  echo "$SUBSCRIBER_RESPONSE" | jq '{errors, message}'
  exit 1
fi

echo ""
echo "Subscriber created/updated. Subscriber ID: $SUBSCRIBER_ID"

if [ -n "${KIT_FORM_ID:-}" ]; then
  echo ""
  echo "Adding subscriber to Kit form $KIT_FORM_ID..."

  REFERRER="https://www.flightschoolfriend.com${RESULT_PATH}?utm_source=terminal_test&utm_medium=manual&utm_campaign=kit_setup"

  FORM_RESPONSE=$(curl -sS \
    --request POST \
    --url "https://api.kit.com/v4/forms/$KIT_FORM_ID/subscribers/$SUBSCRIBER_ID" \
    --header "Content-Type: application/json" \
    --header "X-Kit-Api-Key: $KIT_API_KEY" \
    --data "$(jq -nc --arg referrer "$REFERRER" '{referrer:$referrer}')")

  if echo "$FORM_RESPONSE" | jq -e '.subscriber.id? // .form.id? // .id?' >/dev/null; then
    echo "Added subscriber to form."
  else
    echo "Warning: form add did not return a recognized success payload."
    echo "$FORM_RESPONSE" | jq '{errors, message}'
  fi
else
  echo ""
  echo "Skipping form add because KIT_FORM_ID is not set."
fi

TAG_ENV_NAMES=(
  "KIT_TAG_LEAD_QUIZ_COMPLETED"
  "KIT_TAG_SOURCE_FSF_SITE"
  "KIT_TAG_SOURCE_QUIZ_RESULT_PAGE"
  "$SEGMENT_TAG_ENV"
)

echo ""
echo "Applying tags..."

for ENV_NAME in "${TAG_ENV_NAMES[@]}"; do
  TAG_ID="${!ENV_NAME:-}"

  if [ -z "$TAG_ID" ]; then
    echo "Skipping $ENV_NAME because it is not set."
    continue
  fi

  echo "Applying $ENV_NAME"

  TAG_RESPONSE=$(curl -sS \
    --request POST \
    --url "https://api.kit.com/v4/tags/$TAG_ID/subscribers/$SUBSCRIBER_ID" \
    --header "Content-Type: application/json" \
    --header "X-Kit-Api-Key: $KIT_API_KEY" \
    --data '{}')

  if echo "$TAG_RESPONSE" | jq -e '.subscriber.id? // .tag.id? // .id?' >/dev/null; then
    echo "Applied $ENV_NAME."
  else
    echo "Warning: tag response for $ENV_NAME did not include a recognized success payload."
    echo "$TAG_RESPONSE" | jq '{errors, message}'
  fi
done

echo ""
echo "Done. Check this test subscriber in Kit:"
echo "$TEST_EMAIL"
