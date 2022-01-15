import { warn } from '../utils/warn';

// prettier-ignore
const vocabulary = {
  'unsaved_warning': 'Вы действительно хотите покинуть страницу? Все несохраненные изменения будут потеряны.',
  'no_data': 'Здесь пока нет данных'
};

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

  variables.forEach(({ key, value }) => {
    mutatedText = mutatedText.replace(key, value);
  });

  return mutatedText;
};
