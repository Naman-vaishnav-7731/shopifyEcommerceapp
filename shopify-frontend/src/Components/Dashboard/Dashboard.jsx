import Header from "./Header";
import { Frame , Loading } from "@shopify/polaris";
import Sidenavbar from "./Sidenav";
import Routers from "../Routes/Routes";

const logo = {
  width: 124,
  topBarSource:
    'https://cdn.redstagfulfillment.com/wp-content/uploads/shopify-logo.jpg',
  contextualSaveBarSource:
    'https://cdn.redstagfulfillment.com/wp-content/uploads/shopify-logo.jpg',
  url: '#',
  accessibilityLabel: 'Shopify',
};

const Dashboard = () => {
  return (
    <div style={{ height: "250px" }}>
      <Frame logo={logo} topBar={<Header />} navigation={<Sidenavbar />} >
         <Routers />,
      </Frame>
    </div>
  );
};

export default Dashboard;
