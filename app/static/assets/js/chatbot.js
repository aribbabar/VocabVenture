const defaultResponse = "Oops! I didn't get that. Can you please rephrase?";
const popup = new Popup({
  id: "clear-chat-popup",
  title: "Clear Chat",
  content: `Are you sure you want to clear the chat?
  {btn-popup-button}[Yes]`,
  loadCallback: () => {
    document
      .querySelector(".popup-button")
      .addEventListener("click", function () {
        deleteMessages();
      });
  }
});

document.querySelector("#chat-form").addEventListener("submit", function (e) {
  e.preventDefault();
  handleClick();
});

document.querySelector("#clear-btn").addEventListener("click", function () {
  popup.show();
});

appendOldMessages();

async function appendOldMessages() {
  const res = await fetch("/get_messages");
  const messages = await res.json();
  const userFirstName = await getUserFirstName();

  if (messages["error"]) {
    return;
  }

  for (const message of messages["messages"]) {
    const chatBoxElement = document.querySelector("#chat-box");
    const messageElement = document.createElement("p");

    if (message.sender === "user") {
      messageElement.innerHTML = `<span class="user-span">${userFirstName}:</span> ${message.message}`;
    } else {
      messageElement.innerHTML = `<span class="chatbot-span">Chatbot:</span> ${message.message}`;
    }

    chatBoxElement.appendChild(messageElement);
  }
}

async function handleClick() {
  const userInputElement = document.querySelector("#user-input");
  const chatBoxElement = document.querySelector("#chat-box");
  const userMessageElement = document.createElement("p");
  const chatbotMessageElement = document.createElement("p");
  const userInput = userInputElement.value;
  userInputElement.value = "";

  const isAuthenticated = await checkAuthentication();

  if (isAuthenticated) {
    const userFirstName = await getUserFirstName();

    userMessageElement.innerHTML = `<span class="user-span">${userFirstName}:</span> ${userInput}`;
    await saveMessage(userInput, "user");
  } else {
    userMessageElement.innerHTML = `<span class="user-span">User:</span> ${userInput}`;
  }

  chatBoxElement.appendChild(userMessageElement);

  const { intent, entities } = await getResponse(userInput);

  if (intent.name === "greeting") {
    const chatbotMessage = "Hi! How can I help you today?";
    chatbotMessageElement.innerHTML = `<span class="chatbot-span">Chatbot:</span> ${chatbotMessage}`;
    await saveMessage(chatbotMessage, "chatbot");
  } else if (intent.name === "translation") {
    const translation = await getTranslation(entities);

    chatbotMessageElement.innerHTML = `<span class="chatbot-span">Chatbot:</span> ${translation}`;
    await saveMessage(translation, "chatbot");
  } else {
    chatbotMessageElement.innerHTML = `<span class="chatbot-span">Chatbot:</span> ${defaultResponse}`;
    await saveMessage(defaultResponse, "chatbot");
  }

  chatBoxElement.appendChild(chatbotMessageElement);
}

/**
 *
 * @param {string} userInput
 */
async function getResponse(userInput) {
  const url = `https://api.wit.ai/message?v=20240417&q=${userInput}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer ZQC6XKXB5ZVUM5AD4JOF6RUGZYMKK77X",
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();

  const intent = data.intents[0];
  const entities = data.entities;

  return { intent, entities };
}

async function getTranslation(entities) {
  if (
    "language:language" in entities &&
    "wit$phrase_to_translate:phrase_to_translate" in entities
  ) {
    const targetLanguage = entities["language:language"][0].value;
    const phrase =
      entities["wit$phrase_to_translate:phrase_to_translate"][0].body;

    const languageCode = await getLanguageCode(targetLanguage);

    const translation = await translate(languageCode, phrase);

    return translation;
  }

  return defaultResponse;
}

/**
 *
 * @param {string} targetLanguage
 * @param {string} phrase
 */
async function translate(targetLanguage, phrase) {
  const res = await fetch("https://translate.terraprint.co/translate", {
    method: "POST",
    body: JSON.stringify({
      q: phrase,
      source: "en",
      target: targetLanguage,
      format: "text"
    }),
    headers: { "Content-Type": "application/json" }
  });

  if (res.ok) {
    const data = await res.json();
    const translatedText = data.translatedText;

    return translatedText;
  }

  return defaultResponse;
}

/**
 *
 * @param {string} targetLanguage
 */
async function getLanguageCode(targetLanguage) {
  const res = await fetch("./static/assets/js/languages.json");

  const data = await res.json();

  for (const language of data) {
    const name = language.name;
    const code = language.code;

    if (name.toLowerCase() === targetLanguage.toLowerCase()) {
      return code;
    }
  }

  // by default, return english
  return "en";
}

/**
 *
 * @returns {Promise<boolean>}
 */
async function checkAuthentication() {
  const res = await fetch("/check_authentication");

  if (res.ok) {
    const data = await res.json();

    return data.isAuthenticated;
  }

  return false;
}

async function getUserFirstName() {
  const res = await fetch("/get_user");

  if (res.ok) {
    const data = await res.json();
    return data.first_name;
  }

  return "User";
}

/**
 *
 * @param {string} message - message to save
 * @param {string} sender - sender of the message
 */
async function saveMessage(message, sender) {
  await fetch("/save_message", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message, sender: sender })
  });
}

async function deleteMessages() {
  const chatBoxElement = document.querySelector("#chat-box");

  await fetch("/delete_messages", {
    method: "POST"
  });

  chatBoxElement.innerHTML = "";

  popup.hide();
}
