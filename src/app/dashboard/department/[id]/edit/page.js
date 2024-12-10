import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { DepartmentEditView } from '../../../../../sections/department/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Department Edit',
};

export default function DepartmentEditPage({ params }) {
  const { id } = params;

  return <DepartmentEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

DepartmentEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
