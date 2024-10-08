# Решение

## Задание 1

Решение первого задания находится в папке mfrontend

### Уровень 1. Проектирование

Для реализации задания выбран фреймворк Module Federation. Выбор обоснован тем, что с ним есть небольшой практический
опыт (на основе задания курса). Также в силу того, что мы делим монолит на микрофронтенды, которые будут написаны с
использованием одной и той же библиотеки - react, целесообразно выбрать именно этот фреймворк.

### Уровень 2. Планирование изменений

**Анализ бэкенда**

Было проанализировано, что код бэкенда условно разделен на такие компоненты, как:

- карточки (фотографии) - cards
- пользователи - users

Таким образом логично рассмотреть выделение как минимум таких микрофронтендов.

**Анализ фронтэнда**

Анализ фронтенда показал, что, руководствуясь принципами DDD, действительно, можно выделить следующие микрофронтенды:

- карточки (фотографии) - cards
- пользователи - users

Также было принято решение добавить еще один микрофронтенд:

- авторизации - auth

в силу того, что авторизацию можно явно выделить как отдельный процесс на монолите.

**Особенности Module Federation**

Для реализации через Module Federation нужен еще один микрофронтенд:

- хост - host

**Реализованные микрофронтенды и их особенности**

Итого получается 4 микрофронтенда:

- cards
- users
- host
- auth

В каждом микрофронтенде были выделены следующие типы исходных подкаталогов:

- blocks (стили)
- images (изображения)
- components (контролы)

Из основного монолитного приложения они разделены на соответствующие микрофронтенды

Контролы:

Найденные зависимости микрофронтендов друг от друга и их решение:

1) auth

- внешних зависимостей нет

2) cards

- внутри контрола Card.js есть зависимость от микрофронтенда пользователей: CurrentUserContext. Решаем этот вопрос через
  импорт соответствующего контекста из микрофронтенда пользователей

3) users

- внешних зависимостей нет

4) host

- внутри App.jsx есть множество зависимостей от всех микрофронтендов. Контролы ProtectedRoute, CurrentUserContext,
  InfoTooltip, EditProfilePopup, EditAvatarPopup, AddPlacePopup, Login, Register, PopupWithForm, ImagePopup. Решаем этот
  вопрос через импорт соответствующего контекста/контрола из микрофронтендов
- также внутри App.js монолита есть вызовы апи сервисов. Все, кроме методов, указанных в следующем пункте, реализованы в
  App.jsx через механизм подписки на событие (как было разобрано в примере к этому спринту)
- внутри App.js монолита еcть два действия, которые невозможно реализовать через события. Эти действия происходят при
  старте приложения: обращение к авторизации с целью проверить и провалидировать токен, а также обращение к карточкам и
  пользователям для получения данных по всем карточкам и обновлениям пользователя. Предполагаемое решение (! не
  реализовано за отсутствием навыков, опишу только здесь): предлагаю опубликовать событие наподобие "запустилось
  приложение"
  из хоста, его подхватят соответствующие сервисы, запустят нужные обработчики, и опубликуют по событию с ответом, на
  которое подпишется хост и обработает. В данный момент я попыталась условно реализовать на хосте обработчики этих
  событий от сервисов - их три: handleUserDataUpdate, handleCardDataUpdate, handleCheckToken
- внутри контрола Main.js есть две зависимости: от контрола карточек Card и от контекста пользователя
  CurrentUserContext. Вопрос решен через импорт соответствующего контекста/контрола из микрофронтендов

**Запуск**

Чтобы запустить настроенные микрофронтенды, необходимо вначале запустить через команду
`npm start`все микрофронтенды кроме host.
Затем повторить это же для host. Основное приложение будет развернуто на порту хоста

### Уровень 3. Запуск готового кода

НЕ РЕАЛИЗОВАН. Нет достаточных компетенций во frontend.

## Задание 2

https://drive.google.com/file/d/15DZwSeyegfnrSMIG3DyjypWMzxi0zJLM/view?usp=sharing
Реализация задания.

Было решено разбить монолит на несколько сервисов:

1. Сервис обработки заявок. Сервис занимается всем, что касается заявок. С ним взаимодействует пользователь через
   портал - он может создать заявку на аукцион, поднять ставку, создать обращение в поддержку. Также с сервисом
   взаимодействует администратор - он валидирует аукциона и ставки, обрабатывает заявки
2. Сервис обработки аукционов. Сервис занимается созданием аукционов, выбором победителя (когда аукцион окончится),
   генерацией события о победителе аукциона.Напрямую с сервисом взаимодействует администратор только чтобы обновить
   аукцион (в случае ошибки, например).
3. Сервис торговых площадок. Сервис с данными о текущих доступных торговых площадках и клиентах, которые на них
   зарегистрированы. Создавать и редактировать площадки может менеджер торговых площадок. А пользователь может через
   портал зарегистрироваться на площадке.
4. Сервис отчетов. Создает отчеты по продажам, активности пользователей. Помогает менеджеру или аналитику узнать
   статистику.
5. Сервис поиска. Помогает пользователю удобно искать товары и услуги по ключевым словам.
6. Сервис ETL. Сервис перекачки данных о товарах и услугах из соответствующих сервисов в сервис поиска.
7. Сервис товаров. Сервис хранения товаров пользователей.
8. Сервис услуг. Сервис хранения услуг пользователей.
9. Сервис профиля пользователя. Сервис, на котором хранятся все дополнительные данные пользователя.
10. Сервис авторизации. Сервис хранения данных всех пользователей, также позволяет другим сервисам осуществить проверку
    токена пользователя.
11. Сервис заказов. Сервис, хранящий заказы пользователей.
12. Сервис нотификации. Занимается прослушкой событий и отправкой данных на почту пользователей.
13. Сервис биллинга. Помогает пользователю провести оплату заказа.

Фронтенд был также разнесен на микрофронтенды:

1. Портал торговой площадки
2. Портал заявок
3. Портал услуг
4. Портал товаров
5. Портал профиля пользователя
6. Портал авторизации
7. Портал заказов

Все разделения обоснованы тем, что система становится очень большой, ее трудно, долго и дорого обслуживать и
поддерживать. Предполагается,что каждый микросервис и микрофронтенд обоснован тем, что имеет достаточно сложную логику
для отделения, которая в будущем предполагает добавление функционала. Все разбиение создавалось на основе принципов DDD.

В системе также появился брокер сообщений, который слушает события и помогает сервисам взаимодействовать между собой при
создании ключевых событий системы.

Извне появилась почта для оповещения пользователя.