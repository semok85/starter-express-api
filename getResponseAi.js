const axios = require("axios");

const { API_KEY_OPEN_AI } = {
  API_KEY_OPEN_AI: "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",
};

const getKey = (incomingMessage) => {
  return incomingMessage.split(" ")[0].toLowerCase();
};

const corePrompt = (incomingMessage) => {
  console.log(incomingMessage);
  return incomingMessage.split(" ").slice(1).join(" ");
};

const getResponseAi = async (incomingMessage) => {
  const response = await ChatRequest(corePrompt(incomingMessage));
  if (!response.success) {
    return response.message;
  }
  return response.data;
};
const ChatRequest = async (incomingMessage) => {
  //buat tampungan hasil respons dari Open AI
  const result = {
    success: false,
    data: "",
    message: "",
  };
  //request ke server open ai
  return await axios({
    method: "post",
    url: "https://api.openai.com/v1/completions",
    data: {
      model: "text-davinci-003",
      prompt: `Percakapan di bawah ini adalah percakapan dengan bot asisten kesehatan, asisten adalah seorang yang pintar dan memiliki wawasan yang luas, asisten ini hanya menjawab tentang pertanyaan seputar kesehatan, jika pertanyaan di luar kesehatan jawab dengan \"mohon maaf saya hanya menjawab pertanyaan seputar kesehatan\" ${incomingMessage}`,
      max_tokens: 500,
      temperature: 0.15,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      best_of: 1,
    },
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY_OPEN_AI}`,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        const { choices } = response.data;
        if (choices && choices.length) {
          result.success = true;
          result.data = choices[0].text;
        }
      } else {
        result.message = "Failed response";
      }
      return result;
    })
    .catch((error) => {
      result.message =
        "Error : Silahkan coba kembali beberapa saat lagi\n" + error.message;
      return result;
    });
};

// getResponseAi("siapa penemu listrik").then((data) => {
//   console.log(data);
// });

module.exports = { getResponseAi, getKey };
