import { PROGRAMS } from '~/constants/programs';

interface Props {
    group: string;
}

export const StudentGroup = (props: Props) => {
    const { group } = props;
    const [classVal, programVal] = group.split('-');

    return <div>{`Класс: ${classVal} Программа: ${PROGRAMS[programVal]}`}</div>;
};
