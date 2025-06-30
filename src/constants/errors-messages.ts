export const userErrorMessages = {
  ID_NOT_FOUND: 'Пользователь с указанным id не найден',
  ID_BAD_REQUEST: 'Передан некорректный id пользователя',
  EMAIL_CONFLICT: 'Такой email уже существует',
  DATA_BAD_REQUEST: 'Переданы некорректные данные для создания пользователя',
  PROFILE_BAD_REQUEST: 'Переданы некорректные данные для обновления профиля',
  AVATAR_BAD_REQUEST: 'Переданы некорректные данные для обновления аватара',
  LOGIN_UNAUTHORIZED: 'Неверные почта или пароль',
  AUTH_UNAUTHORIZED: 'Требуется авторизация',
};

export const cardErrorMessages = {
  DATA_BAD_REQUEST: 'Переданы некорректные данные для создания карточки',
  ID_NOT_FOUND: 'Карточка с указанным id не найдена',
  DELETION_FORBIDDEN: 'Нет доступа к карточке',
  ID_BAD_REQUEST: 'Передан некорректный id карточки',
  LIKE_BAD_REQUEST: 'Переданы некорректные данные для постановки лайка',
  DISLIKE_BAD_REQUEST: 'Переданы некорректные данные для снятия лайка',
};
