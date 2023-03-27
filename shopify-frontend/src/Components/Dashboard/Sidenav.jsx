import {Frame, Navigation} from '@shopify/polaris';
import {HomeMinor, OrdersMinor, ProductsMinor , CustomersMajor} from '@shopify/polaris-icons';
import React from 'react';

function Sidenavbar() {
  return (
      <Navigation location="/">
        <Navigation.Section
          items={[
            {
              url: '/home',
              label: 'Home',
              icon: HomeMinor,
            },
            {
              url: '/customer',
              excludePaths: ['#'],
              label: 'Customers',
              icon: CustomersMajor,
            },
            {
              url: '/product',
              excludePaths: ['#'],
              label: 'Products',
              icon: ProductsMinor,
            },
          ]}
        />
      </Navigation>
  );
}

export default Sidenavbar;