interface Props {
  onClick: () => void;
  active: boolean;
  teacherName: string;
}

export const TeacherListItem = (props: Props) => {
  const { onClick, active, teacherName } = props;
  return (
    <li tabIndex={0} onClick={onClick} className={active ? "active" : ""}>
      <p>{teacherName}</p>
    </li>
  );
};
