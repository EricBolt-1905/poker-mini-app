import os
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Update
from aiogram.webhook.aiohttp_server import SimpleRequestHandler
from aiohttp import web
import asyncio

BOT_TOKEN = os.environ["BOT_TOKEN"]
MINI_APP_URL = "https://poker-mini-app.vercel.app"  # ваш URL

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message: types.Message):
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
        [types.InlineKeyboardButton(
            text="🃏 Открыть покерный помощник",
            web_app=types.WebAppInfo(url=MINI_APP_URL)
        )]
    ])
    await message.answer(
        "Привет! Я помогу разобраться, как разыгрывать руку на префлопе.",
        reply_markup=keyboard
    )

@dp.message(lambda msg: msg.web_app_data is not None)
async def web_app_data(message: types.Message):
    await message.answer(f"Получено из Mini App: {message.web_app_data.data}")

# --- Vercel требует асинхронную функцию с одним параметром (запрос) ---
# Мы создаём простое aiohttp приложение, которое получает обновления от Telegram

async def handler(request):
    """Главный обработчик запросов от Telegram."""
    if request.method == "POST":
        data = await request.json()
        update = Update.model_validate(data)
        await dp.feed_update(bot, update)
        return web.Response()
    return web.Response(status=200, text="Bot is running")

# Привязываем приложение aiohttp
app = web.Application()
app.router.add_post("/api/webhook", handler)
app.router.add_get("/api/webhook", handler)  # для проверки при установке вебхука

# Для локальной отладки не используется, но на Vercel выполняется при каждом запросе
if __name__ == "__main__":
    web.run_app(app, port=3000)
