import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { RatesEditView } from '../../../../../sections/rates/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Rates',
};

export default function RatesEditPage({ params }) {
  const { id } = params;

  return <RatesEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

RatesEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
