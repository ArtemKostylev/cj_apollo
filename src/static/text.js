import { warn } from '../utils/warn';

// prettier-ignore
const vocabulary = {
  'unsaved_warning': 'Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны.',
  'no_data': 'Здесь пока нет данных',
  'empty_date': 'Пожалуйста, заполните дату',
  'list_loading': 'Загрузка списка {} из файла',
  'close': 'Закрыть',
  'PP_5': '(5)ПП',
  'PP_8': '(8)ПП',
  'OP': 'ОП',
  'class_is_number': 'Класс должен быть числом!',
  'name': 'Имя',
  'surname': 'Фамилия',
  'famname': 'Отчество',
  'class': 'Класс',
  'program': 'Программа',
  'title': 'Название',
  'group': 'Групповой',
  'save': 'Сохранить',
  'cancel': 'Отмена'
};

/* 
  @key - String
  @variables - array
 */

export const t = (key, variables) => {
  const rawText = vocabulary[key];

  if (!rawText) {
    warn(
      `No static text with key "${key}" was found. Please, add it to vocabulary`
    );
    return '';
  }

  if (!variables) {
    return rawText;
  }

  let mutatedText = rawText;

  variables.forEach((value) => {
    mutatedText = mutatedText.replace('{}', value);
  });

  return mutatedText;
};
