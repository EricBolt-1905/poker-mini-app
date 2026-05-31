import asyncio
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

BOT_TOKEN = os.environ["BOT_TOKEN"]  # переменная окружения
MINI_APP_URL = "https://poker-mini-app.vercel.app"  # ваш URL Mini App

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

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
