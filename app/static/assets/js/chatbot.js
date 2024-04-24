const defaultResponse = "Oops! I didn't get that. Can you please rephrase?";

document.querySelector("#chat-form").addEventListener("submit", function (e) {
  e.preventDefault();
  handleClick();
});

async function handleClick() {
  const userInputElement = document.querySelector("#user-input");
  const chatBoxElement = document.querySelector("#chat-box");
  const userMessageElement = document.createElement("p");
  const chatbotMessageElement = document.createElement("p");
  const userInput = userInputElement.value;

  userInputElement.value = "";
  userMessageElement.innerHTML = `<span class="user-span">User:</span> ${userInput}`;
  chatBoxElement.appendChild(userMessageElement);

  const { intent, entities } = await getResponse(userInput);

  if (intent.name === "greeting") {
    chatbotMessageElement.innerHTML = `<span class="chatbot-span">Chatbot:</span> Hi! How can I help you today?`;
  } else if (intent.name === "translation") {
    const translation = await getTranslation(entities);

    chatbotMessageElement.innerHTML = `<span class="chatbot-span">Chatbot:</span> ${translation}`;
  } else {
    chatbotMessageElement.innerHTML = `<span class="chatbot-span">Chatbot:</span> ${defaultResponse}`;
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
