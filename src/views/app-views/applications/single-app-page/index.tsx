import React, { SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Button, Card, Empty, Menu } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Flex from "../../../../components/shared-components/Flex";
import Avatar from "antd/lib/avatar/avatar";
import {
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import Description from "./Description";
import Licenses from "./Licenses/Licenses";
import Packages from "./Packages";
import Devices from "./Devices";
import InnerAppLayout from "../../../../layouts/inner-app-layout";
import { AppService } from "../../../../api/app";
import News from "./news";
import Loading from "../../../../components/shared-components/Loading";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";
import { APP_NAME } from "../../../../configs/AppConfig";
import { ILocale, IMarketAppList } from "../../../../api/app/types";
import SmsCampaign from "./SMS/campaign";
import Integration from "./Integration";
import CampaignDetails from "./SMS/campaign/CampaignDetails";
import Invoice from "./ExchangeOfInvoice/invoice";
import SmsDashboard from "./SMS/dashboard";
import InvoiceDashboard from "./ExchangeOfInvoice/dashboard";
import OrderDashboard from "./ExchangeOfOrder/dashboard";
import Order from "./ExchangeOfOrder/order";
import DiscountDashboard from "./MyDiscount/dashboard";
import Utils from "../../../../utils";
import InvoiceLines from "./ExchangeOfInvoice/invoice/InvoiceLines";
import OrderLines from "./ExchangeOfOrder/order/OrderLines";
import Templates from "./Mail/templates";
import Dashboard from "../../dashboard";
import { TOGGLE_COLLAPSED_NAV } from "../../../../redux/constants/Theme";

export enum EnStatusApp {
  DISABLED = 0,
  ACTIVE = 1,
}
export enum EnApp {
  Retail = 10,
  CashSalesExpertMobile = 11,
  Agent = 20,
  Expert = 30,
  MyDiscount = 60,
  StockManager = 21,
  WaiterAssistant = 31,
  KitchetAssistant = 32,
  Qiwi = 100,
  SMS = 50,
  ExchangeOfInvoice = 41,
  ExchangeOfOrder = 40,
  PetrolExpert = 130,
  MobilePetrolExpertCash = 131,
  MailService = 140,
}
interface IOptions extends RouteComponentProps {
  AppType: number;
  moduleSettings: IMarketAppList["ModuleSettings"];
  AppName: string;
}
const Options = ({
  AppType,
  AppName,
  location,
  match,
  moduleSettings,
}: IOptions) => {
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[`${match.url}/:appId/`]}
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key={`${match.url}/dashboard`}>
        <span>
          <IntlMessage id="app.Dashboard" />
        </span>
        <Link to={match.url + "/dashboard"} />
      </Menu.Item>
      <Menu.Item
        key={`${match.url}/templates`}
        className={AppType === EnApp.MailService ? "" : "d-none"}
      >
        <span>Templates</span>
        <Link to={match.url + "/templates"} />
      </Menu.Item>
      <Menu.Item
        key={`${match.url}/invoice`}
        className={AppType === EnApp.ExchangeOfInvoice ? "" : "d-none"}
      >
        <span>
          <IntlMessage id="app.Invoice" />
        </span>
        <Link to={match.url + "/templates"} />
      </Menu.Item>
      <Menu.Item
        key={`${match.url}/order`}
        className={AppType === EnApp.ExchangeOfOrder ? "" : "d-none"}
      >
        <span>
          <IntlMessage id="app.Order" />
        </span>
        <Link to={match.url + "/order"} />
      </Menu.Item>
      <Menu.Item
        key={`${match.url}/campaign`}
        className={AppType === EnApp.SMS ? "" : "d-none"}
      >
        <span>
          <IntlMessage id="app.Campaign" />
        </span>
        <Link to={match.url + "/campaign"} />
      </Menu.Item>
      <Menu.Item
        key={`${match.url}/news`}
        className={AppType === EnApp.MyDiscount ? "" : "d-none"}
      >
        <span>
          <IntlMessage id="app.News" />
        </span>
        <Link to={match.url + "/news"} />
      </Menu.Item>
      <Menu.Item
        key={`${match.url}/licenses`}
        className={moduleSettings.License ? "" : "d-none"}
      >
        <span>
          <IntlMessage id="app.Licenses" />
        </span>
        <Link to={match.url + "/licenses"} />
      </Menu.Item>
      <Menu.Item
        key={`${match.url}/devices`}
        className={moduleSettings.License ? "" : "d-none"}
      >
        <span>
          <IntlMessage id="app.Devices" />
        </span>
        <Link to={match.url + "/devices"} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/integration`}>
        <span>
          <IntlMessage id="app.Integration" />
        </span>
        <Link to={match.url + "/integration"} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/packages`}>
        <span>
          <IntlMessage id="app.Packages" />
        </span>
        <Link to={match.url + "/packages"} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/description`}>
        <span>
          <IntlMessage id="app.Description" />
        </span>
        <Link to={match.url + "/description"} />
      </Menu.Item>
    </Menu>
  );
};
const AppOption = (props: any) => {
  return <Options {...props} />;
};
interface IAppRoute {
  match: RouteComponentProps["match"];
  location: RouteComponentProps["location"];
  app: any;
}
const AppRoute = ({ match, app, location }: IAppRoute) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/dashboard`} />
      <Route
        path={`${match.url}/description`}
        exact
        render={(props) => (
          <Description {...props} LongDescription={app.LongDescription ?? ""} />
        )}
      />
      <Route
        path={`${match.url}/licenses`}
        exact
        render={(props) => <Licenses {...props} AppType={app.AppType ?? 0} />}
      />
      <Route
        path={`${match.url}/packages`}
        exact
        render={(props) => <Packages {...props} currentApp={app} />}
      />
      <Route
        path={`${match.url}/devices`}
        exact
        render={(props) => <Devices {...props} AppType={app.AppType ?? 0} />}
      />
      <Route
        path={`${match.url}/news`}
        exact
        render={(props) => <News {...props} AppType={app.AppType ?? 0} />}
      />
      <Route
        path={`${match.url}/campaign`}
        render={(props) => <SmsCampaign {...props} />}
      />
      <Route
        path={`${match.url}/integration`}
        exact
        render={() => <Integration currentApp={app} />}
      />
      <Route
        path={`${match.url}/campaign_details=:ID`}
        exact
        render={(props) => <CampaignDetails {...props} />}
      />
      <Route
        path={`${match.url}/invoice`}
        render={(props) => {
          if (props.location.search) {
            return <InvoiceLines {...props} APIKey={app.ApyKey} />;
          }
          return <Invoice {...props} APIKey={app.ApyKey} />;
        }}
      />
      <Route
        exact
        path={`${match.url}/order`}
        render={(props) => {
          if (props.location.search) {
            return <OrderLines {...props} APIKey={app.ApyKey} />;
          }
          return <Order {...props} APIKey={app.ApyKey} />;
        }}
      />
      <Route
        path={`${match.url}/dashboard`}
        render={(props) => {
          if (app.AppType === EnApp.SMS)
            return <SmsDashboard {...props} APIKey={app.ApyKey} />;
          else if (app.AppType === EnApp.ExchangeOfInvoice)
            return <InvoiceDashboard />;
          else if (app.AppType === EnApp.ExchangeOfOrder)
            return <OrderDashboard />;
          else if (app.AppType === EnApp.MyDiscount)
            return <DiscountDashboard {...props} APIKey={app.ApyKey} />;
        }}
      />
      <Route
        exact
        path={`${match.url}/templates`}
        render={(props) => {
          return <Templates APIKey={app.ApyKey} {...props} />;
        }}
      />
      <Route
        path="*"
        render={({ location }) => (
          <div>
            No match for <code>{location.pathname}</code>
          </div>
        )}
      />
    </Switch>
  );
};

const AboutItem = ({ appData }: any) => {
  const { Photo, Status, Name, ShortDescription, LongDescription } = appData;
  const locale = useSelector((state: IState) => state["theme"]!.locale) ?? "en";
  return (
    <Card className="mb-5">
      <Flex>
        <div className="mr-3">
          <Avatar
            src={Photo}
            icon={<ExperimentOutlined />}
            shape="square"
            size={80}
          />
        </div>
        <Flex flexDirection="column">
          <Flex flexDirection="row">
            <h2 className="mr-3">{Name} </h2>
          </Flex>
          <div>
            <span className="text-muted ">
              {Utils.decodeBase64Locale(ShortDescription)[locale] ?? ""}
            </span>
            {Status === EnStatusApp.DISABLED && (
              <p
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html:
                    Utils.decodeBase64Locale(LongDescription)[locale] ?? "",
                }}
              ></p>
            )}
          </div>
        </Flex>
      </Flex>
    </Card>
  );
};

interface ISingleAppPage extends RouteComponentProps<{ appID: string }> {}
const SingleAppPage = ({ match, location }: ISingleAppPage) => {
  const { appID } = match.params;
  const instance = new AppService();
  const [app, setApp] = useState<Partial<IMarketAppList>>();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    instance.GetMarketAppList().then(async (data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        const currentApp = data.MarketAppList.find(
          (app) => app.AppType === +appID
        );
        document.title = `${currentApp!.Name} | ${APP_NAME}`;
        // TODO: replace this with a useReducer function
        setApp(currentApp);
      }
    });
    return () => instance._source.cancel();
  }, [appID]);

  useEffect(() => {
    // Temporary fix
    dispatch({ type: TOGGLE_COLLAPSED_NAV, navCollapsed: true });
  }, [location.pathname]);

  if (loading) return <Loading />;
  if (!app) {
    return <Empty />;
  }

  return (
    <>
      <AboutItem appData={app} />
      {app.Status === EnStatusApp.ACTIVE && (
        <InnerAppLayout
          sideContent={
            <AppOption
              location={location}
              match={match}
              AppType={app!.AppType}
              moduleSettings={app!.ModuleSettings}
              AppName={app!.Name}
            />
          }
          mainContent={<AppRoute match={match} app={app} location={location} />}
        />
      )}
    </>
  );
};
export default withRouter(SingleAppPage);
