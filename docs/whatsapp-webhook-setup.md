# WhatsApp Webhook Setup for FashionShop

This document explains how to set up and configure the WhatsApp webhook for your e-commerce website.

## Prerequisites

Before setting up the WhatsApp webhook, you'll need:

1. A Facebook Developer Account
2. A Meta Business Account
3. A WhatsApp Business Account (WABA)
4. A registered phone number on WhatsApp Business
5. A domain with SSL certificate (required for webhook verification)

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

## Configuration Steps

### 1. Create a Facebook App
- Go to [developers.facebook.com](https://developers.facebook.com)
- Create a new app
- Add the WhatsApp Business Platform product to your app

### 2. Set up Webhook
- In your app dashboard, go to the WhatsApp Business Platform section
- Under Webhooks, click "Add Callback URL"
- Enter your webhook URL: `https://yourdomain.com/api/webhook/whatsapp`
- Enter the Verify Token you set in your environment variables
- Select the subscriptions: `messages` and `messaging_postbacks`

### 3. Configure Phone Number
- In your app dashboard, go to the WhatsApp Business Platform section
- Under WhatsApp Accounts, select your WhatsApp Business Account
- Copy your Phone Number ID and add it to your environment variables

### 4. Generate Access Token
- In your app dashboard, go to the WhatsApp Business Platform section
- Under Tokens, generate a new token for your phone number
- Add this token to your environment variables

## Webhook Functionality

The webhook handles:

1. **Message Events**: Text, image, video, and audio messages
2. **Postback Events**: Button clicks and menu selections
3. **Verification**: Handles the initial webhook verification

## Supported Commands

The bot responds to various user inputs:

- `hello`, `hi`, `hey`: Greeting response
- `help`, `support`: Help information
- `product`, `item`, `catalog`: Product catalog
- `order`, `track`, `status`: Order information
- `hours`, `open`, `close`: Store hours
- `offer`, `discount`, `sale`: Current promotions

## Testing

To test the webhook:

1. Send a message to your WhatsApp Business number
2. Check your server logs for incoming webhook requests
3. Verify that responses are sent back to the user

## Troubleshooting

- Ensure your server supports HTTPS
- Check that environment variables are properly set
- Verify that the webhook URL is accessible
- Monitor server logs for error messages

## Security

- Keep your access tokens secure
- Use strong verify tokens
- Implement rate limiting if needed
- Log all incoming requests for monitoring