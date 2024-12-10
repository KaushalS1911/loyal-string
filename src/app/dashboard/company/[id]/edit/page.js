import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CompanyEditView } from '../../../../../sections/company/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Company Edit',
};

export default function CompanyEditPage({ params }) {
  const { id } = params;

  return <CompanyEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CompanyEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
