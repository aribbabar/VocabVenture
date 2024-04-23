document.querySelector("#chat-form").addEventListener("submit", function (e) {
  e.preventDefault();
  handleClick();
});

async function handleClick() {
  const message = document.querySelector("#user-input").value;
  const userMessage = document.createElement("p");
  userMessage.innerHTML = `<span class="user-span">User:</span> ${message}`;

  // append user message to chat messages box
  document.querySelector(".chat-message-content").appendChild(userMessage);

  const url = `https://api.wit.ai/message?v=20240417&q=${message}`;

  const translation = await getTranslation(url);
  const chatbotMessage = document.createElement("p");
  chatbotMessage.innerHTML = `<span class="chatbot-span">Chatbot:</span> ${translation}`;

  // append chatbot message to chat messages box
  document.querySelector(".chat-message-content").appendChild(chatbotMessage);

  // clear user input
  document.querySelector("#user-input").value = "";
}

async function getTranslation(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer ZQC6XKXB5ZVUM5AD4JOF6RUGZYMKK77X",
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();

  const intent = data.intents[0].name;
  const entities = data.entities;

  if (
    "language:language" in entities &&
    "wit$phrase_to_translate:phrase_to_translate" in entities
  ) {
    const targetLanguage = entities["language:language"][0].value;
    const phrase =
      entities["wit$phrase_to_translate:phrase_to_translate"][0].body;

    const languageCode = await getLanguageCode(targetLanguage);

    const translation = translate(languageCode, phrase);

    return translation;
  }

  return "Error";
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

  return "Error";
}

// test();

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

    if (name.toUpperCase() === targetLanguage.toUpperCase()) {
      return code;
    }
  }

  // by default, return english
  return "en";
}
