function getToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is missing");
  }

  return token;
}

async function telegramRequest(token, method, payload) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Telegram API failed: ${error}`);
  }

  return response.json();
}

export async function sendMessage(chatId, message) {
  if (!chatId) {
    throw new Error("chat_id is missing");
  }

  return telegramRequest(getToken(), "sendMessage", {
    chat_id: chatId,
    text: message,
  });
}

export async function sendTelegramMessage(message) {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID is missing");
  }

  return sendMessage(chatId, message);
}

export async function getUpdates(offset = 0, timeout = 30) {
  const token = getToken();

  const response = await fetch(
    `https://api.telegram.org/bot${token}/getUpdates` +
      `?offset=${offset}&timeout=${timeout}`,
    {
      signal: AbortSignal.timeout((timeout + 15) * 1000),
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Telegram API failed: ${error}`);
  }

  return response.json();
}
