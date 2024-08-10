import axios from "axios";

export const tgBot = (text, mode) => {
  const token = "6478130941:AAGNn5K2mO4-1OFMaTjpOh41z1jmJHjAC60";
  axios
    .get(`https://api.telegram.org/bot${token}/getUpdates`)
    .then((updates) => {
      const id = updates.data.result[0].message.from.id;
      axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: id,
        text,
        parse_mode: mode,
      });
    });
};
