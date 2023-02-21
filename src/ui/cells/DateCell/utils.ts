const DATE_PLACEHOLDER = '.....';

export class LimitException extends Error {
  constructor() {
    super('limiting date was not provided to limited date picker');
  }
}

export const convertDate = (value: string | undefined, full: boolean) => {
  if (!value) return DATE_PLACEHOLDER;

  const [month, day, year] = value.split('/');

  const date = `${day}.${month}`;

  if (full) return date.concat(`.${year}`);

  return date;
};