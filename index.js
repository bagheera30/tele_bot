const { Telegraf } = require("telegraf");
const axios = require("axios");
const NewsAPI = require("newsapi");
require("dotenv").config();

// Membaca token API bot Telegram dari variabel lingkungan
const bot = new Telegraf(process.env.BOT_TOKEN);

// Menambahkan handler untuk perintah /start
bot.start((ctx) => {
  ctx.telegram.sendChatAction(ctx.chat.id, "read");
  ctx.reply(
    "Selamat datang di bot helldut. Untuk commandnya:\n/password [panjang karakter]"
  );
});

const getLatestNews = async (ctx) => {
  ctx.telegram.sendChatAction(ctx.chat.id, "read");
  const API_KEY = process.env.NEWS_API_KEY;

  try {
    // Mengirim permintaan ke API berita
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=id&apiKey=${API_KEY}`
    );

    // Mengambil data berita dari response
    const newsData = response.data;

    // Memeriksa apakah ada berita
    if (newsData.articles && newsData.articles.length > 0) {
      const articles = newsData.articles.slice(0, 10);

      // Mengirim balasan ke pengguna dengan daftar judul berita
      let reply = "Berikut adalah berita terbaru dari Indonesia:\n";
      for (let i = 0; i < articles.length; i++) {
        reply += `\n${i + 1}. ${articles[i].title}\n`;
      }
      ctx.reply(reply);
    } else {
      // Jika tidak ada berita, mengirim pesan bahwa tidak ada berita yang ditemukan
      ctx.reply("Tidak ada berita terbaru yang ditemukan.");
    }
  } catch (error) {
    console.error("Error:", error);
    ctx.reply(
      "Terjadi kesalahan dalam mengambil berita terbaru. Mohon coba lagi nanti."
    );
  }
};

// Menambahkan handler untuk perintah /news
bot.command("news", getLatestNews);

// Menambahkan handler untuk perintah /password
bot.command("password", async (ctx) => {
  ctx.telegram.sendChatAction(ctx.chat.id, "read");
  try {
    const passwordLength = parseInt(ctx.message.text.split(" ")[1]);

    if (isNaN(passwordLength) || passwordLength <= 0 || passwordLength > 128) {
      ctx.reply("Mohon berikan panjang karakter yang valid (1-128).");
      return;
    }

    const password = generateRandomPassword(passwordLength);

    ctx.reply(`Kata Sandi Acak: ${password}`);

    // Membebaskan memori variabel password
    delete password;
  } catch (err) {
    console.error("Error:", err);
    ctx.reply("Terjadi kesalahan. Mohon coba lagi nanti.");
  }
});
// Menambahkan handler untuk perintah /email
bot.command("email", async (ctx) => {
  ctx.telegram.sendChatAction(ctx.chat.id, "read");
  try {
    const emailPasswordPair = generateEmailAndPassword();

    ctx.reply(
      `Email: ${emailPasswordPair.email}\nPassword: ${emailPasswordPair.password}`
    );

    // Mengaktifkan email secara otomatis
    activateEmail(emailPasswordPair.email, emailPasswordPair.password);
  } catch (err) {
    console.error("Error:", err);
    ctx.reply("Terjadi kesalahan. Mohon coba lagi nanti.");
  }
});

// Memulai bot
bot
  .launch()
  .then(() => {
    console.log("Bot telah berhasil berjalan");
  })
  .catch((err) => {
    console.error("Terjadi kesalahan saat memulai bot:", err);
  });

// Fungsi untuk membangkitkan kata sandi acak
function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
