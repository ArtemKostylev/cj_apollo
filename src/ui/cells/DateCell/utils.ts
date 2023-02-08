const DATE_PLACEHOLDER = '.....';

export class EmptyYearException extends Error {
  constructor() {
    super('year was not provided to limited date picker');
  }
}

export const convertDate = (value: string | undefined, full: boolean) => {
  if (!value) return DATE_PLACEHOLDER;

  const [month, day, year] = value.split('/');

  const date = `${day}.${month}`;

  if (full) return date.concat(`.${year}`);

  return date;
};