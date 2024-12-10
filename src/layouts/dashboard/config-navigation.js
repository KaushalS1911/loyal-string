import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  company: <Iconify icon='mdi:company' width={24} />,
  branch: <Iconify icon='proicons:branch' width={24} />,
  counter: <Iconify icon='mdi:counter' width={24} />,
  department: <Iconify icon='mingcute:department-line' width={24} />,
  roles: <Iconify icon='oui:app-users-roles' width={24} />,
  employee: <Iconify icon='clarity:employee-line' width={24} />,
  bankAccount: <Iconify icon='mdi:bank' width={24} />,
  devices: <Iconify icon='material-symbols:devices' width={24} />,
  tax: <Iconify icon='tabler:receipt-tax' width={24} />,
  rateConversion: <Iconify icon='system-uicons:heart-rate' width={24} />,
  category: <Iconify icon='material-symbols:category' width={24} />,
  product: <Iconify icon='carbon:product' width={24} />,
  design: <Iconify icon='mdi:design' width={24} />,
  purity: <Iconify icon='mdi:gold' width={24} />,
  packet: <Iconify icon='mingcute:red-packet-fill' width={24} />,
  box: <Iconify icon='solar:box-bold' width={24} />,
  stone: <Iconify icon='game-icons:stone-pile' width={24} />,
  diamondsizeweightrate: <Iconify icon='material-symbols:diamond' width={24} />,
  sku: <Iconify icon='mingcute:stock-fill' width={24} />,
  rates: <Iconify icon='iconamoon:trend-up' width={24} />,
  collection: <Iconify icon='tdesign:collection' width={24} />,
  occasion: <Iconify icon='ep:opportunity' width={24} />,
  purchaseentry: <Iconify icon='carbon:purchase' width={24} />,
  createpacket: <Iconify icon='arcticons:packeta' width={24} />,
  addbulkstocknew: <Iconify icon='ix:document-bulk' width={24} />,
  addsinglestock: <Iconify icon='material-symbols-light:stockpot-sharp' width={24} />,
  invoice: <Iconify icon='hugeicons:invoice-02' width={24} />,
  makepayments: <Iconify icon='material-symbols:payments-sharp' width={24} />,
  receivepayments: <Iconify icon='hugeicons:dollar-receive-02' width={24} />,
  creditnotesalereturn: <Iconify icon='gridicons:credit-card' width={24} />,
  debitnotesalereturn: <Iconify icon='carbon:sales-ops' width={24} />,
  stocktransfer: <Iconify icon='mdi:transfer' width={24} />,
  vendortounche: <Iconify icon='material-symbols:connect-without-contact' width={24} />,
  customertounche: <Iconify icon='streamline:customer-support-1' width={24} />,
  config: <Iconify icon='icon-park-outline:config' width={24} />,
  print: <Iconify icon='material-symbols:print' width={24} />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      {
        subheader: t('overview'),
        items: [
          {
            title: t('Dashboard'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('Account'),
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
        ],
      },
      {
        subheader: t('user master'),
        items: [
          // {
          //   title: t('Company'),
          //   path: paths.dashboard.company.list,
          //   icon: ICONS.company,
          // },
          {
            title: t('Branch'),
            path: paths.dashboard.branch.list,
            icon: ICONS.branch,
          },
          {
            title: t('Counter'),
            path: paths.dashboard.counter.list,
            icon: ICONS.counter,
          },
          {
            title: t('Department'),
            path: paths.dashboard.department.list,
            icon: ICONS.department,
          },
          {
            title: t('Roles'),
            path: paths.dashboard.roles.list,
            icon: ICONS.roles,
          },
          {
            title: t('Employee'),
            path: paths.dashboard.employee.list,
            icon: ICONS.employee,
          },
          {
            title: t('Bank Account'),
            path: paths.dashboard.bankaccount.list,
            icon: ICONS.bankAccount,
          },
          {
            title: t('Devices'),
            path: paths.dashboard.devices.list,
            icon: ICONS.devices,
          },
          {
            title: t('Tax'),
            path: paths.dashboard.tax.list,
            icon: ICONS.tax,
          },
          // {
          //   title: t('Rate Conversion'),
          //   path: paths.dashboard.rateconversion.list,
          //   icon: ICONS.rateConversion,
          // },
        ],
      },
      {
        subheader: t('Products Master'),
        items: [
          {
            title: t('Category'),
            path: paths.dashboard.category.list,
            icon: ICONS.category,
          },
          {
            title: t('Product'),
            path: paths.dashboard.product.list,
            icon: ICONS.product,
          },
          {
            title: t('Design'),
            path: paths.dashboard.design.list,
            icon: ICONS.design,
          },
          {
            title: t('Purity'),
            path: paths.dashboard.purity.list,
            icon: ICONS.purity,
          },
          {
            title: t('Packet'),
            path: paths.dashboard.packet.list,
            icon: ICONS.packet,
          },
          {
            title: t('Box'),
            path: paths.dashboard.box.list,
            icon: ICONS.box,
          },
          {
            title: t('Stone'),
            path: paths.dashboard.stone.list,
            icon: ICONS.stone,
          },
          {
            title: t('Diamond Size/Weight Rate'),
            path: paths.dashboard.diamondsizeweightrate.list,
            icon: ICONS.diamondsizeweightrate,
          },
          {
            title: t('SKU'),
            path: paths.dashboard.sku.list,
            icon: ICONS.sku,
          },
          {
            title: t('Rates'),
            path: paths.dashboard.rates.list,
            icon: ICONS.rates,
          },
          {
            title: t('Collection'),
            path: paths.dashboard.collection.list,
            icon: ICONS.collection,
          },
          {
            title: t('Occasion'),
            path: paths.dashboard.occasion.list,
            icon: ICONS.occasion,
          },
        ],
      },
      {
        subheader: t('trading'),
        items: [
          {
            title: t('Purchase Entry'),
            path: paths.dashboard.purchaseentry.list,
            icon: ICONS.purchaseentry,
          },
          {
            title: t('Create Packet'),
            path: paths.dashboard.createpacket.list,
            icon: ICONS.createpacket,
          },
          {
            title: t('Add Bulk Stock New'),
            path: paths.dashboard.addbulkstocknew.list,
            icon: ICONS.addbulkstocknew,
          },
          {
            title: t('Add Single Stock'),
            path: paths.dashboard.addsinglestock.list,
            icon: ICONS.addsinglestock,
          },
          {
            title: t('Invoice'),
            path: paths.dashboard.invoice.list,
            icon: ICONS.invoice,
          },
          {
            title: t('Make Payments'),
            path: paths.dashboard.makepayments.list,
            icon: ICONS.makepayments,
          },
          {
            title: t('Receive payments'),
            path: paths.dashboard.receivepayments.list,
            icon: ICONS.receivepayments,
          },
          {
            title: t('Credit Note/Sale Return'),
            path: paths.dashboard.creditnotesalereturn.list,
            icon: ICONS.creditnotesalereturn,
          },
          {
            title: t('Debit Note/Sale Return'),
            path: paths.dashboard.debitnotesalereturn.list,
            icon: ICONS.debitnotesalereturn,
          },
          {
            title: t('Stock Transfer'),
            path: paths.dashboard.stocktransfer.list,
            icon: ICONS.stocktransfer,
          },
        ],
      },
      {
        subheader: t('Reports'),
        items: [
          {
            title: t('all Reports'),
            path: paths.dashboard.allreports,
            icon: ICONS.print,
          },
        ],
      },
      {
        subheader: t('Settings'),
        items: [
          {
            title: t('Vendor Tounche'),
            path: paths.dashboard.vendortounche.list,
            icon: ICONS.vendortounche,
          },
          {
            title: t('Customer Tounche'),
            path: paths.dashboard.customertounche.list,
            icon: ICONS.customertounche,
          },
          {
            title: t('Config'),
            path: paths.dashboard.config,
            icon: ICONS.config,
          },
        ],
      },
    ],
    [t],
  );

  return data;
}
