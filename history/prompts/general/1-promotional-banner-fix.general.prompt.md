---
id: 1
title: "Promotional Banner Display Fix"
stage: "general"
date_iso: "2026-01-22"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "Farhat"
command: "fix promotional banner not displaying on homepage"
labels: ["ui", "banner", "display", "homepage"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "E:/ecommerce/app/page.tsx"
tests_yaml: []
---

# Promotional Banner Display Fix

## Summary
Fixed an issue where the promotional banner on the homepage was not displaying properly due to incorrect Tailwind CSS height classes.

## Details
The promotional banner section on the homepage (app/page.tsx) was not displaying correctly because it had an invalid Tailwind class `lg:h-full` which doesn't properly define a height for the video/image container on larger screens. Changed this to `lg:h-96` to ensure consistent height across screen sizes.

## Changes Made
1. Updated the promotional banner container height classes from `h-96 lg:h-full` to `h-96 lg:h-96` in app/page.tsx
2. Maintained proper video and image fallback handling for the banner section

## Files Modified
- E:/ecommerce/app/page.tsx:302 - Changed div className from `relative h-96 lg:h-full` to `relative h-96 lg:h-96`

## Outcome
The promotional banner now displays properly on all screen sizes with consistent height for the video/image section alongside the gradient text section.

## Prompt Text
```
in homepage promotional banner is not displaying
```

## Response Text
Fixed the promotional banner display issue by correcting the Tailwind CSS height classes in the banner section to ensure consistent height across screen sizes.