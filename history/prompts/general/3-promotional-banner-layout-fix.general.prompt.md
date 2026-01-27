---
id: 3
title: "Promotional Banner Layout Fix"
stage: "general"
date_iso: "2026-01-22"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "Farhat"
command: "fix promotional banner layout to show both text and video content"
labels: ["ui", "banner", "layout", "homepage"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "E:/ecommerce/app/page.tsx"
tests_yaml: []
---

# Promotional Banner Layout Fix

## Summary
Fixed an issue where the promotional banner was not properly displaying both text content and video content.

## Details
The promotional banner on the homepage was not properly showing the text content on the left side along with the video content on the right side. The layout was adjusted to ensure both sides of the banner display correctly.

## Changes Made
1. Removed overflow-hidden class from the main promotional banner section
2. Simplified z-index positioning for the text content area
3. Maintained proper video and image fallback handling for the banner section

## Files Modified
- E:/ecommerce/app/page.tsx:268-340 - Updated promotional banner section layout classes

## Outcome
The promotional banner now properly displays both the text content (left side) with the loyalty program information and the video/image content (right side).

## Prompt Text
```
banner is only showing video and signup button
```

## Response Text
Fixed the promotional banner layout by adjusting the CSS classes to ensure both the text content and video content display properly on the homepage.