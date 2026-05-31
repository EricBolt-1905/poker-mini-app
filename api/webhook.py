import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Update
from starlette.applications import Starlette
from starlette.responses import Response

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

# Главный обработчик вебхука
async def webhook(request):
    if request.method == "POST":
        data = await request.json()
        update = Update(**data)
        await dp.feed_update(bot, update)
        return Response()
    return Response("Bot is running")

# Приложение Starlette – Vercel подхватит его автоматически
app = Starlette(routes=[
    # Разрешаем GET и POST, чтобы работала установка вебхука и получение обновлений
    ("/api/webhook", webhook, ["GET", "POST"]),
])
