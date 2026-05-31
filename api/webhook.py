import os
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Update
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import PlainTextResponse, Response
from starlette.routing import Route

# Логирование, чтобы видеть ошибки в Vercel
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.environ.get("BOT_TOKEN")
MINI_APP_URL = "https://poker-mini-app.vercel.app"  # ваш URL

if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не задан в переменных окружения Vercel")

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

# Основной обработчик вебхука
async def webhook_handler(request: Request):
    if request.method == "POST":
        try:
            body = await request.json()
            logger.info(f"Received update: {body}")
            update = Update(**body)
            await dp.feed_update(bot, update)
            return Response(status_code=200)
        except Exception as e:
            logger.error(f"Error processing update: {e}")
            return Response(status_code=500)
    else:
        # GET-запрос — для проверки работоспособности
        return PlainTextResponse("Bot is running")

app = Starlette(routes=[
    Route("/api/webhook", webhook_handler, methods=["GET", "
