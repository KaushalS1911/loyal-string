import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { RateConversionEditView } from '../../../../../sections/rate-conversion/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Rate Conversion',
};

export default function RateConversionEditPage({ params }) {
  const { id } = params;

  return <RateConversionEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

RateConversionEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
