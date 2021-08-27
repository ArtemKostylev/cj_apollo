import react from "react";
import renderer, { act } from "react-test-renderer";
import EditableCell from "../../components/EditableCell";

test("Drawer opens after click", () => {
  const component = renderer.create(
    <EditableCell value="" row={1} column={1} updateMyData={() => {}} />
  );
  let tree = component.toJSON();

  expect(tree).toMatchSnapshot();

  act(() => tree.props.onClick());
});
