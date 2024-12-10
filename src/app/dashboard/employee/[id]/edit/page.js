import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { EmployeeEditView } from '../../../../../sections/employee/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Employee Edit',
};

export default function EmployeeEditPage({ params }) {
  const { id } = params;

  return <EmployeeEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

EmployeeEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
