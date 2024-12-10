import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { OccasionEditView } from '../../../../../sections/occasion/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Occasion',
};

export default function OccasionEditPage({ params }) {
  const { id } = params;

  return <OccasionEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

OccasionEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
