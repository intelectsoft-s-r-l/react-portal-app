import {
  DashboardOutlined,
  UserOutlined,
  AuditOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
  HistoryOutlined,
  InteractionOutlined,
  InfoCircleOutlined,
  SnippetsOutlined,
  BookOutlined,
  CreditCardOutlined
} from "@ant-design/icons";

const dashBoardNavTree = [

  {
    key: "dashboard",
    path: "/app/dashboard",
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: true,
    submenu: [],
  },
  {
    key: "catalog",
    path: "/app/catalog",
    title: "sidenav.catalog",
    icon: ApartmentOutlined,
    breadcrumb: true,
    submenu: [
      {
        key: "companies",
        path: "/app/catalog/companies",
        title: "sidenav.catalog.companies",
        icon: ApartmentOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "users",
        path: "/app/catalog/users",
        title: "sidenav.catalog.users",
        icon: UserOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "group",
        path: "/app/catalog/group",
        title: "sidenav.catalog.group",
        icon: UsergroupAddOutlined,
        breadcrumb: true,
        submenu: [],
      },
    ],
  },
  {
    key: "audit",
    path: "/app/audit",
    title: "sidenav.audit",
    icon: AuditOutlined,
    breadcrumb: true,
    submenu: [
      {
        key: "auditAll",
        path: "/app/audit",
        title: "sidenav.audit.All",
        icon: AuditOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "loginHistory",
        path: "/app/audit/history",
        title: "sidenav.audit.loginHistory",
        icon: HistoryOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "actions",
        path: "/app/audit/actions",
        title: "sidenav.audit.actions",
        icon: InteractionOutlined,
        breadcrumb: true,
        submenu: [],
      },
    ],
  },
  {
    key: "other",
    path: "/",
    title: "Other",
    icon: ApartmentOutlined,
    breadcrumb: false,
    submenu:[
      {
        key: "reports",
        path: "/app/reports",
        title: "sidenav.reports",
        icon: BookOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "payment",
        path: "/app/account-settings/billing",
        title: "sidenav.payment",
        icon: CreditCardOutlined,
        breadcrumb: true,
        submenu: [],
      },
    ]
  }


];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
