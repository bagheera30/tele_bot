const { Telegraf } = require("telegraf");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const NewsAPI = require("newsapi");
require("dotenv").config();

// Membaca token API bot Telegram dari variabel lingkungan
const bot = new Telegraf(process.env.BOT_TOKEN);

// Menambahkan handler untuk perintah /start
bot.start((ctx) => {
  ctx.reply(
    "selamat datang di bot helldut\n untuk commandnya\n/password(masukan panjang karakternya)     "
  );
});

const getLatestNews = async (ctx) => {
  const API_KEY = process.env.NEWS_API_KEY; // Ganti YOUR_API_KEY dengan kunci API NewsAPI Anda yang valid

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
    // Menangani kesalahan jika terjadi kesalahan dalam mengambil berita
    console.error("Error:", error);
    ctx.reply(
      "Terjadi kesalahan dalam mengambil berita terbaru. Mohon coba lagi nanti."
    );
  }
};

// Menambahkan handler untuk perintah /removebg
bot.command("news", getLatestNews);

// Menambahkan handler untuk perintah /generatepassword
bot.command("password", async (ctx) => {
  try {
    // Mendapatkan panjang karakter yang diinput oleh pengguna
    const passwordLength = parseInt(ctx.message.text.split(" ")[1]);

    // Memeriksa apakah panjang karakter valid
    if (isNaN(passwordLength) || passwordLength <= 0 || passwordLength > 128) {
      ctx.reply("Mohon berikan panjang karakter yang valid (1-128).");
      return;
    }

    // Membangkitkan kata sandi acak dengan panjang karakter yang diinput
    const password = generateRandomPassword(passwordLength);

    // Mengirim kata sandi yang dibangkitkan kepada pengguna
    ctx.reply(`Kata Sandi Acak: ${password}`);
  } catch (err) {
    console.error("Error:", err);
    ctx.reply("Terjadi kesalahan. Mohon coba lagi nanti.");
  }
});

// Memulai bot
bot
  .launch()
  .then(() => {
    console.log("Bot telah berhasil berjalan"); // Menampilkan pesan konfirmasi ke console
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
