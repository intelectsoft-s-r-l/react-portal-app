import {
    DashboardOutlined,
    AppstoreAddOutlined,
    AppstoreOutlined,
    UserOutlined,
    AuditOutlined,
    ApartmentOutlined,
    UsergroupAddOutlined,
    HistoryOutlined,
    InteractionOutlined,
    InfoCircleOutlined,
    SnippetsOutlined,
    BookOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";

export interface INavTree {
    key: string;
    path: string;
    title: string;
    icon: any;
    breadcrumb: boolean;
    submenu: INavTree[];
}

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
        key: "applications",
        path: "/app/applications",
        title: "sidenav.applications",
        icon: AppstoreOutlined,
        breadcrumb: true,
        submenu: [
            {
                key: "my-applications",
                path: "/app/my-applications",
                title: "sidenav.my-applications",
                icon: AppstoreOutlined,
                breadcrumb: true,
                submenu: [],
            },
            {
                key: "market",
                path: "/app/applications/market",
                title: "sidenav.market",
                icon: AppstoreAddOutlined,
                breadcrumb: true,
                submenu: [],
            },
        ],
    },
    {
        key: "catalog",
        path: "/app/catalog",
        title: "sidenav.catalog",
        icon: ApartmentOutlined,
        breadcrumb: true,
        submenu: [
            {
                key: "company",
                path: "/app/catalog/company",
                title: "sidenav.catalog.company",
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
        title: "sidenav.other",
        icon: ApartmentOutlined,
        breadcrumb: false,
        submenu: [
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
                path: "/app/payments",
                title: "sidenav.payment",
                icon: CreditCardOutlined,
                breadcrumb: true,
                submenu: [],
            },
        ],
    },
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
