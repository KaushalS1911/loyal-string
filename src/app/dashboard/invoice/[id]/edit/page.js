import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { InvoiceEditView } from '../../../../../sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Invoice',
};

export default function InvoiceEditPage({ params }) {
  const { id } = params;

  return <InvoiceEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

InvoiceEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
