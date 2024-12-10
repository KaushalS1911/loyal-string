import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';

import AllReportsBillingPlan from './allreports-billing-plan';
import AllReportsBillingPayment from './allreports-billing-payment';
import AllReportsBillingHistory from './allreports-billing-history';
import AllReportsBillingAddress from './allreports-billing-address';

// ----------------------------------------------------------------------

export default function AccountBilling({ cards, plans, invoices, addressBook }) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <AllReportsBillingPlan plans={plans} cardList={cards} addressBook={addressBook} />

        <AllReportsBillingPayment cards={cards} />

        <AllReportsBillingAddress addressBook={addressBook} />
      </Grid>

      <Grid xs={12} md={4}>
        <AllReportsBillingHistory invoices={invoices} />
      </Grid>
    </Grid>
  );
}

AccountBilling.propTypes = {
  addressBook: PropTypes.array,
  cards: PropTypes.array,
  invoices: PropTypes.array,
  plans: PropTypes.array,
};
