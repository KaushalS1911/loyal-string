import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { TaxEditView } from '../../../../../sections/tax/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Tax',
};

export default function TaxEditPage({ params }) {
  const { id } = params;

  return <TaxEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

TaxEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
