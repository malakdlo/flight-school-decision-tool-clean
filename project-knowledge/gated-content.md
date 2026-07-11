# Gated Content

## Current Setup

Lead magnet PDFs currently live in:

```text
public/hosted-content/
```

Astro copies files from `public/` directly into the deployed static site. After deploy, these files are reachable at:

```text
https://www.flightschoolfriend.com/hosted-content/{filename}
```

Current 28-day plan links:

```text
https://www.flightschoolfriend.com/hosted-content/28-day-flight-school-plan.pdf
https://www.flightschoolfriend.com/hosted-content/28-day-flight-school-plan-v1.pdf
```

Recommended Kit email link:

```text
https://www.flightschoolfriend.com/hosted-content/28-day-flight-school-plan.pdf
```

Use the unversioned URL in emails so the email automation does not need to change when the PDF is updated. Keep versioned files as archives.

## Important Limitation

Anything inside `public/` is public.

That means files in `/hosted-content/` are not truly gated. They are only unlisted. If someone knows or guesses the exact URL, they can download the file.

Cloudflare Pages should not expose a browsable folder index by default, so people likely cannot visit:

```text
https://www.flightschoolfriend.com/hosted-content/
```

and see a list of files. But exact file URLs are still public.

## MVP Strategy

For early lead magnets, use lightweight access control:

1. Store files in `public/hosted-content/`.
2. Do not link the files from public pages.
3. Put download links only inside Kit emails.
4. Use clear but not overly guessable filenames.
5. Add `Disallow: /hosted-content/` to `robots.txt`.
6. Add noindex headers for `/hosted-content/*` if Cloudflare/static headers are configured later.

This is enough for low-risk free PDFs while traffic is small.

## Naming Guidance

Use a stable public link for automations:

```text
28-day-flight-school-plan.pdf
```

Use versioned archive names for source/history:

```text
28-day-flight-school-plan-v1.pdf
28-day-flight-school-plan-v2.pdf
```

If content becomes more sensitive or valuable, use less guessable filenames:

```text
fsf-28day-plan-v1-a8f3c9.pdf
```

Avoid spaces, underscores, and mixed casing in public URLs. Prefer lowercase kebab-case.

## Search Engine Controls

Robots rules can discourage indexing:

```text
User-agent: *
Disallow: /hosted-content/
```

But `robots.txt` is advisory. It does not prevent direct access.

Noindex headers are stronger for search indexing, but still do not prevent direct access:

```text
X-Robots-Tag: noindex, nofollow
```

For Cloudflare Pages, this could be added later with a `public/_headers` file if needed.

Example:

```text
/hosted-content/*
  X-Robots-Tag: noindex, nofollow
```

## What This Does Not Protect Against

The current static approach does not prevent:

- Someone forwarding the email link.
- Someone guessing a file URL.
- Someone sharing the PDF publicly.
- A crawler ignoring `robots.txt`.
- A browser or tool downloading the file directly.

## Stronger Future Options

### Option 1: Kit-Hosted File Delivery

If Kit supports hosting or attachment-style delivery for lead magnets, use Kit to deliver the file directly.

Pros:

- Simple.
- Keeps gated content out of the public repo.
- Less infrastructure.

Cons:

- Less control over URLs and access behavior.
- Depends on Kit feature set.

### Option 2: Cloudflare R2 Private Bucket With Signed URLs

Store PDFs in a private R2 bucket and generate signed download URLs.

Pros:

- Real access control.
- URLs can expire.
- Files are not publicly browsable.
- Good fit for higher-value gated content.

Cons:

- Requires a server/Worker or backend flow.
- More setup and maintenance.
- More moving parts than static hosting.

### Option 3: Cloudflare Worker Download Endpoint

Email links point to a Worker route that checks a token, then serves the PDF.

Example:

```text
https://www.flightschoolfriend.com/download/28-day-plan?token=...
```

Pros:

- More control over access.
- Can log downloads.
- Can expire or revoke links.

Cons:

- Reintroduces server/runtime complexity.
- Needs token generation and validation.

### Option 4: Cloudflare Access

Protect content behind Cloudflare Access login.

Pros:

- Strong protection.
- Good for internal/private assets.

Cons:

- Too heavy for simple public lead magnets.
- Adds friction for subscribers.

## Recommendation

Use the lightweight static approach for now:

- `/public/hosted-content/`
- unlisted links in Kit emails
- no public links from the site
- `robots.txt` disallow
- optional `X-Robots-Tag` headers later

Move to private R2 plus signed URLs only if the PDFs become paid, sensitive, or valuable enough that link sharing matters.

