const { Telegraf } = require("telegraf");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const NewsAPI = require("newsapi");
require("dotenv").config();
require("./index");

// Import file yang ingin diuji
const { getLatestNews, generateRandomPassword } = require("./index"); // Pastikan mengganti "./index" dengan jalur file yang benar

// Unit test untuk getLatestNews
test("getLatestNews function should send a reply with latest news", async () => {
  // Membuat mock context
  const ctx = {
    reply: jest.fn(), // Mock function untuk memeriksa apakah reply telah dipanggil dengan benar
  };

  // Mock response dari API berita
  const response = {
    data: {
      articles: [{ title: "News 1" }, { title: "News 2" }, { title: "News 3" }],
    },
  };

  // Mock axios.get untuk mengembalikan response yang telah diatur sebelumnya
  axios.get = jest.fn().mockResolvedValue(response);

  // Menjalankan fungsi yang ingin diuji
  await getLatestNews(ctx);

  // Memeriksa apakah reply telah dipanggil dengan benar
  expect(ctx.reply).toHaveBeenCalledWith(
    "Berikut adalah berita terbaru dari Indonesia:\n\n1. News 1\n\n2. News 2\n\n3. News 3\n"
  );
});

// Unit test untuk generateRandomPassword
test("generateRandomPassword function should generate a random password with the specified length", () => {
  // Memanggil fungsi yang ingin diuji
  const password = generateRandomPassword(10);

  // Memeriksa apakah panjang password sesuai dengan yang diharapkan
  expect(password.length).toBe(10);
});
