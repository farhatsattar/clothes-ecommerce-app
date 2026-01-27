import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // Check if the mode and token match our expected values
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return NextResponse.json(parseInt(challenge!), { status: 200 });
  } else {
    console.error('Failed to verify webhook');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

// Handle POST requests for incoming messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received webhook payload:', JSON.stringify(body, null, 2));

    // Extract messaging events
    const messagingEvents = body.entry?.[0]?.messaging;

    if (!messagingEvents || !Array.isArray(messagingEvents) || messagingEvents.length === 0) {
      console.log('No messaging events found');
      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    // Process each messaging event
    for (const event of messagingEvents) {
      // Check if it's a message event
      if (event.message) {
        await processMessage(event);
      } else if (event.postback) {
        await processPostback(event);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Process incoming messages
async function processMessage(event: any) {
  const senderId = event.sender.id;
  const message = event.message;

  console.log(`Received message from ${senderId}:`, message);

  // Determine the type of message
  if (message.text) {
    await handleMessageText(senderId, message.text.body);
  } else if (message.image) {
    await handleMessageImage(senderId, message.image);
  } else if (message.video) {
    await handleMessageVideo(senderId, message.video);
  } else if (message.audio) {
    await handleMessageAudio(senderId, message.audio);
  } else {
    console.log('Unsupported message type:', Object.keys(message));
  }
}

// Process postback events
async function processPostback(event: any) {
  const senderId = event.sender.id;
  const postback = event.postback;

  console.log(`Received postback from ${senderId}:`, postback);
  await handlePostback(senderId, postback.payload);
}

// Handle text messages
async function handleMessageText(senderId: string, text: string) {
  console.log(`Processing text message from ${senderId}: ${text}`);

  // Normalize the text for easier matching
  const normalizedText = text.trim().toLowerCase();

  // Determine the appropriate response based on the message content
  let responseText = '';

  if (normalizedText.includes('hello') || normalizedText.includes('hi') || normalizedText.includes('hey')) {
    responseText = 'Hello! 👋 Welcome to FashionShop! How can I assist you today?\n\nYou can ask me about:\n• Our products\n• Order status\n• Store hours\n• Special offers';
  } else if (normalizedText.includes('help') || normalizedText.includes('support')) {
    responseText = 'I\'m here to help! 🤝 You can ask me about:\n\n• Product information\n• Order tracking\n• Store hours\n• Return policy\n• Special offers\n\nWhat would you like to know?';
  } else if (normalizedText.includes('product') || normalizedText.includes('item') || normalizedText.includes('catalog')) {
    responseText = 'Our latest collection includes:\n\n👕 Premium Cotton T-Shirts - $29.99\n👗 Summer Floral Dresses - $49.99\n👖 Denim Jackets - $79.99\n👟 Athletic Sneakers - $89.99\n\nVisit our website to browse the full catalog!';
  } else if (normalizedText.includes('order') || normalizedText.includes('track') || normalizedText.includes('status')) {
    responseText = 'To check your order status, please provide your order number. You can also visit our website and log into your account to track your order.';
  } else if (normalizedText.includes('hours') || normalizedText.includes('open') || normalizedText.includes('close')) {
    responseText = 'Our online store is available 24/7! 🌐\nFor customer support, we are available Monday-Friday, 9am-6pm EST.';
  } else if (normalizedText.includes('offer') || normalizedText.includes('discount') || normalizedText.includes('sale') || normalizedText.includes('promo')) {
    responseText = 'Check out our current offers:\n\n🎉 New customer discount: 10% off first order\n🔥 Seasonal sale: Up to 30% off selected items\n✨ Loyalty program: Earn points with every purchase\n\nVisit our website for more details!';
  } else if (normalizedText.includes('thank') || normalizedText.includes('thanks')) {
    responseText = 'You\'re welcome! 😊 Is there anything else I can help you with?';
  } else {
    responseText = 'Thank you for reaching out to FashionShop! 🛍️\n\nI\'m your virtual assistant. You can ask me about our products, order status, store hours, or special offers.\n\nOr visit our website for more information!';
  }

  // Send the response back to the user
  await sendWhatsAppMessage(senderId, responseText);
}

// Handle image messages
async function handleMessageImage(senderId: string, image: any) {
  console.log(`Processing image message from ${senderId}`);
  await sendWhatsAppMessage(senderId, 'Thank you for sharing an image! Our team will review it and get back to you shortly.');
}

// Handle video messages
async function handleMessageVideo(senderId: string, video: any) {
  console.log(`Processing video message from ${senderId}`);
  await sendWhatsAppMessage(senderId, 'Thank you for sharing a video! Our team will review it and get back to you shortly.');
}

// Handle audio messages
async function handleMessageAudio(senderId: string, audio: any) {
  console.log(`Processing audio message from ${senderId}`);
  await sendWhatsAppMessage(senderId, 'Thank you for sending an audio message! Our team will listen and get back to you shortly.');
}

// Handle postback events
async function handlePostback(senderId: string, payload: string) {
  console.log(`Processing postback from ${senderId} with payload: ${payload}`);

  let responseText = '';
  switch (payload) {
    case 'GET_STARTED':
      responseText = 'Welcome to FashionShop! 👋 How can I assist you today?';
      break;
    case 'SHOW_PRODUCTS':
      responseText = 'Check out our latest products:\n\n👕 Premium Cotton T-Shirts - $29.99\n👗 Summer Floral Dresses - $49.99\n👖 Denim Jackets - $79.99\n\nVisit our website to browse more!';
      break;
    default:
      responseText = 'Thank you for interacting with FashionShop! How else can I assist you?';
  }

  await sendWhatsAppMessage(senderId, responseText);
}

// Send a message back to WhatsApp
async function sendWhatsAppMessage(recipientId: string, message: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.error('Missing WhatsApp API credentials');
    return;
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const requestBody = {
    messaging_product: 'whatsapp',
    to: recipientId,
    type: 'text',
    text: {
      body: message
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to send message: ${response.status} ${errorData}`);
    } else {
      console.log('Message sent successfully to', recipientId);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}