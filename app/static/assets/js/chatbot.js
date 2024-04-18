document.querySelector("#send-button").addEventListener("click", function () {
  const message = document.querySelector("#user-input").value;
  const userMessage = document.createElement("p");
  userMessage.innerHTML = `<span class="user-span">User:</span> ${message}`;

  // append user message to chat messages box
  document.querySelector(".chat-message-content").appendChild(userMessage);

  const url = `https://api.wit.ai/message?v=20240417&q=${message}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer ZQC6XKXB5ZVUM5AD4JOF6RUGZYMKK77X",
      "Content-Type": "application/json"
    }
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const intent = data.intents[0].name;
      const entities = data.entities;

      if (
        "language:language" in entities &&
        "wit$phrase_to_translate:phrase_to_translate" in entities
      ) {
        const language = entities["language:language"][0].value;
        const phrase =
          entities["wit$phrase_to_translate:phrase_to_translate"][0].body;

        console.log(language, phrase);
      }
    });
});

async function test() {
  const res = await fetch("https://translate.terraprint.co/translate", {
    method: "POST",
    body: JSON.stringify({
      q: "Hello!",
      source: "en",
      target: "es",
      format: "text"
    }),
    headers: { "Content-Type": "application/json" }
  });

  console.log(await res.json());
}

test();
