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

echo ""
echo "Listing Kit forms..."
echo ""

curl -sS \
  --request GET \
  --url "https://api.kit.com/v4/forms" \
  --header "X-Kit-Api-Key: $KIT_API_KEY" \
  | jq -r '
      if (.forms | length) == 0 then
        "No forms found. Create one in Kit named: FSF Quiz Result Email Capture"
      else
        .forms[] | "Form: \(.name)\nKIT_FORM_ID=\(.id)\nType: \(.type // "unknown")\nSubscribers: \(.subscriber_count // 0)\n"
      end
    '

echo ""
echo "Copy the correct KIT_FORM_ID into email/.env.local"
