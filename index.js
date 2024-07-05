require('dotenv').config();
const {
    Bot,
    GrammyError,
    HttpError,
    Keyboard,
    InlineKeyboard
} = require('grammy');
const  { hydrate } = require('@grammyjs/hydrate');

const bot = new  Bot (process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Запуск бота'
    },
    {
        command: 'menu',
        description: 'Запросить Меню',
    },

]);

bot.command('start', async  (ctx) => {
    await ctx.react('👏')
    await ctx.reply('Привет!', {
        reply_parameters: {message_id: ctx.msg.message_id}
    });
});

bot.command('mood', async  (ctx) => {
    //const moodKeyboard = new Keyboard().text('Хорошо').row().text('Нормально').row().text('Плохо').resized().
    // oneTime()

    const  moodLabels = ['Хорошо','Нормально','Плохо']
    const rows = moodLabels.map((label) => {
        return [
            Keyboard.text(label)
        ]
    })
    const moodKeyboard2 = Keyboard.from(rows).resized()
    await ctx.reply('Как твоё настроение', {
        reply_markup: moodKeyboard2
    })
})

bot.command('share', async   (ctx) => {
    const  shareKeyboard = new  Keyboard().requestLocation('Геолокацию').requestContact('Контакт').
    requestPoll('Опрос').placeholder('Выбери...').resized().oneTime()

    await ctx.reply('Чем хочешь поделиться?', {
        reply_markup: shareKeyboard
    })
})



bot.command('inline',async  (ctx) => {



    const inlineKeyboard2 = new InlineKeyboard().url(' Превая ссылка', 'https://www.youtube.com/watch?v=F1YfH9LdCWA&t=302s')
    await ctx.reply('Выберите цифру', {
        reply_markup: inlineKeyboard2,
    });
});

bot.callbackQuery([], async (ctx) => {
   await ctx.answerCallbackQuery()
    await ctx.reply('Вы нажали: ${ctx.callbackQuery.data}')
})

    bot.on('callback_query:data', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('Вы на: ${ctx.callbackQuery.data}');
})


bot.hears('Хорошо', async  (ctx) => {
    await ctx.reply('здорово!', {
        reply_markup: {remove_keyboard: true}
    })
})

bot.hears('Нормально', async  (ctx) => {
    await ctx.reply('У меня тоже нормально', {
        reply_markup: {remove_keyboard: true}
    })
})

bot.hears('Плохо', async  (ctx) => {
    await ctx.reply('А ну быстро испарвляй', {
        reply_markup: {remove_keyboard: true}
    })
})

const menuKeyboard = new InlineKeyboard()
    .text('Узнать статус', 'order-status')
    .text('Обратиться в поддержку', 'supprot');
const  backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back');

bot.command('menu',async  (ctx) => {
    await ctx.reply('Выберите пункт меню', {
        reply_markup: menuKeyboard,
    });
});

bot.callbackQuery('order-status',async  (ctx) => {
    await ctx.callbackQuery.message.editText('Статус заказа в пути', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('supprot',async  (ctx) => {
    await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('back',async  (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите пункт меню', {
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
      console.error("Error in request: e.descriptions");
  } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram", e);
  } else {
      console.error("Unknown error", e);
  }
});

bot.start();
