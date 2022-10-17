import {useAuth} from '../../../hooks/useAuth';
import '../../../styles/Notes.css';
import Controls from '../../../shared/ui/Controls';
import {PageWrapper} from '../../../shared/ui/PageWrapper';
import {useEffect, useState} from 'react';
import {NetworkStatus, useMutation, useQuery} from '@apollo/client';
import {FETCH_NOTES_QUERY} from '../../../graphql/queries/fetchNotes';
import {UPDATE_NOTE_MUTATION} from '../../../graphql/mutations/updateNotes';
import moment from 'moment';
import {YEARS} from '../../../shared/ui/TableControls';

export const Notes = (props) => {
    const auth = useAuth();

    const [currentYear, setCurrentYear] = useState(`${moment().year()}`);
    const [course, setCourse] = useState(0);

    const onYearChange = (e) => {
        setCurrentYear(e.target.getAttribute("data-index"));
    }

    const getCourse = (e) => {
        setCourse(e.target.getAttribute('data-index'));
        setValue('');
        refetch();
    };

    const [update] = useMutation(UPDATE_NOTE_MUTATION);

    const save = async (e) => {
        await update({
            variables: {
                data: {
                    id: data.fetchNotes ? data.fetchNotes.id : 0,
                    text: value,
                    teacherId: props.location.state?.versions[currentYear].id || auth.user.versions[currentYear].id,
                    courseId:
                        props.location.state?.versions[currentYear].courses[course].id ||
                        auth.user.versions[currentYear].courses[course].id,
                    year: parseInt(currentYear),
                },
            },
        });
        refetch();
    };

    const {loading, data, error, refetch, networkStatus} = useQuery(
        FETCH_NOTES_QUERY,
        {
            variables: {
                teacherId: props.location.state?.versions[currentYear].id || auth.user?.versions[currentYear].id,
                courseId:
                    props.location.state?.versions[currentYear]?.courses[course]?.id ||
                    auth.user.versions[currentYear]?.courses[course]?.id,
                year: parseInt(currentYear),
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only',
            onCompleted: data => setValue(data?.fetchNotes?.text)
        }
    );

    const [value, setValue] = useState('');

    const items = [
        {
            type: 'dropdown',
            data:
                props.location.state?.versions[currentYear].courses.map((course) => course.name) ||
                auth.user.versions[currentYear].courses.map((course) => course.name),
            label: 'Предмет :',
            text:
                props.location.state?.versions[currentYear].courses[course].name ||
                auth.user.versions[currentYear].courses[course].name,
            onClick: getCourse,
        },
        {
            type: "dropdown",
            data: YEARS,
            label: "Год :",
            text: currentYear,
            onClick: onYearChange,
        },
        {
            type: 'button',
            text: 'Сохранить',
            onClick: save,
        },
    ];

    const spinner = <div>Загрузка</div>;

    if (loading) return spinner;
    if (networkStatus === NetworkStatus.refetch) return spinner;

    if (error) throw new Error(503);

    if (value === '' && data.fetchNotes && data.fetchNotes.text !== '') setValue(data.fetchNotes.text);

    const change = (e) => {
        setValue(e.target.value);
    };

    return (
        <PageWrapper>
            <Controls items={items}/>
            <textarea
                placeholder='Это - место для заметок...'
                value={value}
                onChange={change}
            />
        </PageWrapper>
    );
};
