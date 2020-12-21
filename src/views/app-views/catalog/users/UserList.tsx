import React, { Component } from "react";
import { Card, Table, Tag, message, Button, Modal, Menu, Input } from "antd";
import {
    EyeOutlined,
    ArrowRightOutlined,
    PlusCircleOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import UserView from "./UserView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import "../hand_gesture.scss";
import { connect } from "react-redux";
import { UserModalEdit } from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import "./add_user.scss";
import Utils from "../../../../utils";
import Flex from "../../../../components/shared-components/Flex";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import { ClientApi } from "../../../../api";
import { sendActivationCode } from "../../../../redux/actions/Auth";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import Localization from "../../../../utils/Localization";
import { IState } from "../../../../redux/reducers";
import { IAuth } from "../../../../redux/reducers/Auth";
import { IAccount } from "../../../../redux/reducers/Account";
import { ITheme } from "../../../../redux/reducers/Theme";
import WithStringTranslate from "../../../../utils/translate";

export enum status {
    inactive = 0,
    active = 1,
    disabled = 2,
}

export interface UsersProps {
    CompanyID: number;
    Email: string;
    FirstName: string;
    LastName: string;
    ID: number;
    LastAuthorize: string;
    LastAuthorizeIP: string;
    PhoneNumber: string;
    Photo: string;
    Status: number;
    UiLanguage: number;
}
interface IUserListStoreProps {
    token?: string;
    locale?: string;
    CompanyID?: number;
    ID?: number;
    sendActivationCode: (ID: number) => void;
}

interface UserListStateProps {
    users: UsersProps[];
    usersToSearch: any;
    selectedRows: any;
    selectedKeys: any;
    userProfileVisible: boolean;
    selectedUser: any;
    isHidden: string;
    editModalVisible: boolean;
    newUserModalVisible: boolean;
    registerUserModalVisible: boolean;
    loading: boolean;
}

export class UserList extends Component<IUserListStoreProps> {
    state: UserListStateProps = {
        users: [],
        usersToSearch: [],
        selectedRows: [],
        selectedKeys: [],
        userProfileVisible: false,
        selectedUser: null,
        isHidden: "block",
        editModalVisible: false,
        newUserModalVisible: false,
        registerUserModalVisible: false,
        loading: true,
    };

    getUsersInfo = () => {
        return new ClientApi().GetUserList().then((data) => {
            this.setState({ loading: false });
            if (data) {
                const { ErrorCode } = data;
                if (ErrorCode === 0) {
                    const filteredUsers = data.Users.filter(
                        (user: any) => user.ID !== this.props.ID
                    );
                    const evaluatedArray = Utils.sortData(filteredUsers, "ID");
                    this.setState((prev) => ({
                        ...prev,
                        usersToSearch: [...evaluatedArray],
                    }));
                    this.setState((prev) => ({
                        ...prev,
                        users: [...evaluatedArray],
                    }));
                }
            }
        });
    };

    componentDidMount() {
        this.getUsersInfo();
    }

    showUserProfile = (userInfo: UsersProps) => {
        this.setState({
            userProfileVisible: true,
            selectedUser: userInfo,
        });
    };
    closeUserViewProfile = () => {
        this.setState({
            userProfileVisible: false,
            selectedUser: null,
        });
    };

    showEditModal = (userInfo: UsersProps) => {
        this.setState({
            editModalVisible: true,
            selectedUser: userInfo,
        });
    };
    closeEditModal = () => {
        this.setState({
            editModalVisible: false,
            selectedUser: null,
        });
    };

    showNewUserModal = () => {
        this.setState({
            newUserModalVisible: true,
        });
    };

    closeNewUserModal = () => {
        this.setState({
            newUserModalVisible: false,
        });
    };

    toggleStatusRow = async (row: any, statusNumber: number) => {
        Modal.confirm({
            title: `Are you sure you want to ${
                statusNumber === 0 || statusNumber === 2
                    ? "disable"
                    : "activate"
            } ${row.length} ${row.length > 1 ? "users" : "user"}?`,
            onOk: async () => {
                await Promise.all(
                    row.map(async (elm: any) => {
                        await this.handleUserStatus(elm.ID, statusNumber);
                    })
                );
                this.setState({ selectedRows: [], selectedKeys: [] });
                this.getUsersInfo();
            },
        });
    };

    handleUserStatus = (userId: number, status: number) => {
        return new ClientApi().ChangeUserStatus(userId, status);
    };
    dropdownMenu = (row: any) => (
        <Menu>
            {row.Status === 0 && (
                <Menu.Item
                    onClick={() =>
                        Modal.confirm({
                            title: `Are you sure you want to send an email to ${row.FirstName} ?`,
                            onOk: () => {
                                this.props.sendActivationCode(row.ID);
                            },
                            onCancel: () => {},
                        })
                    }
                >
                    <Flex alignItems="center">
                        <ArrowRightOutlined />
                        <span className="ml-2">
                            <IntlMessage id={"users.SendCode"} />
                        </span>
                    </Flex>
                </Menu.Item>
            )}
            <Menu.Item onClick={() => this.showUserProfile(row)}>
                <Flex alignItems="center">
                    <EyeOutlined />
                    <span className="ml-2">
                        <IntlMessage id={"users.ViewDetails"} />
                    </span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => this.showEditModal(row)}>
                <Flex alignItems="center">
                    <EditOutlined />
                    <span className="ml-2">
                        <IntlMessage id={"users.Edit"} />
                    </span>
                </Flex>
            </Menu.Item>
            {
            row.Status === status.disabled ? (
                <Menu.Item
                    onClick={async () => {
                        Modal.confirm({
                            title: `Are you sure you want to activate this user?`,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.active
                                );
                                await this.getUsersInfo();
                            },
                        });
                    }}
                >
                    <Flex alignItems="center">
                        <CheckCircleOutlined />
                        <span className="ml-2">
                            <IntlMessage id={"users.Activate"} />
                        </span>
                    </Flex>
                </Menu.Item>
            ) : row.Status === status.active ? (
                <Menu.Item
                    onClick={async () => {
                        Modal.confirm({
                            title: <Localization msg={"users.Disable.Title"} />,
                            onOk: async () => {
                                await this.handleUserStatus(
                                    row.ID,
                                    status.disabled
                                );
                                await this.getUsersInfo();
                            },
                        });
                    }}
                >
                    <Flex alignItems="center">
                        <CloseCircleOutlined />
                        <span className="ml-2">
                            <IntlMessage id={"users.Disable"} />
                        </span>
                    </Flex>
                </Menu.Item>
            ): null}
        </Menu>
    );

    onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const searchArray = value ? this.state.users : this.state.usersToSearch;
        const data = Utils.wildCardSearch(searchArray, value);
        this.setState({ users: data });
    };

    render() {
        const { users, userProfileVisible, selectedUser } = this.state;

        const tableColumns = [
            {
                title: <IntlMessage id={"users.table.User"} />,
                dataIndex: "name",
                render: (_: any, record: UsersProps) => (
                    <div className="d-flex">
                        <AvatarStatus
                            src={record.Photo}
                            name={`${record.FirstName} ${record.LastName}`}
                            subTitle={record.Email}
                            icon={<UserOutlined />}
                        />
                    </div>
                ),
                sorter: {
                    compare: (a: any, b: any) => {
                        a = a.FirstName.toLowerCase();
                        b = b.FirstName.toLowerCase();
                        return a > b ? -1 : b > a ? 1 : 0;
                    },
                },
            },
            {
                title: <IntlMessage id={"users.table.Role"} />,
                render: () => "User",
            },
            {
                title: <IntlMessage id={"users.table.LastOnline"} />,
                dataIndex: "LastAuthorize",
                render: (LastAuthorize: any) => (
                    <span>
                        {LastAuthorize
                            ? moment
                                  .unix(LastAuthorize.slice(6, 16))
                                  .format("DD/MM/YYYY")
                            : " "}{" "}
                    </span>
                ),
            },
            {
                title: <IntlMessage id={"users.table.Status"} />,
                dataIndex: "Status",
                render: (Status: number) => (
                    <Tag
                        className="text-capitalize"
                        color={
                            Status === status.active
                                ? "cyan"
                                : Status === status.disabled
                                ? "red"
                                : "orange"
                        }
                    >
                        {Status === 1 ? (
                            <IntlMessage id={"users.status.Active"} />
                        ) : Status === 2 ? (
                            <IntlMessage id={"users.status.Disabled"} />
                        ) : (
                            <IntlMessage id={"users.status.NotActivated"} />
                        )}
                    </Tag>
                ),
                sorter: {
                    compare: (a: any, b: any) => a.Status - b.Status,
                },
            },
            {
                dataIndex: "actions",
                render: (_: any, elm: UsersProps) => (
                    <div className="text-right">
                        <EllipsisDropdown menu={this.dropdownMenu(elm)} />
                    </div>
                ),
            },
        ];
        return (
            <Card>
                <Flex
                    className="mb-1"
                    mobileFlex={false}
                    justifyContent="between"
                >
                    <div className="mr-md-3 mb-3">
                        <Input
                            placeholder={WithStringTranslate("app.Search")}
                            prefix={<SearchOutlined />}
                            onChange={(e) => this.onSearch(e)}
                        />
                    </div>
                    <div>
                        <Flex>
                            {this.state.selectedRows.length > 0 && (
                                <>
                                    <Button
                                        type="primary"
                                        className="mr-3"
                                        onClick={() =>
                                            this.toggleStatusRow(
                                                this.state.selectedRows,
                                                status.active
                                            )
                                        }
                                    >
                                        {this.state.selectedRows.length > 1 ? (
                                            <>
                                                <IntlMessage
                                                    id={"users.Activate"}
                                                />{" "}
                                                (
                                                {this.state.selectedRows.length}
                                                )
                                            </>
                                        ) : (
                                            <IntlMessage id="users.Activate" />
                                        )}
                                    </Button>
                                    <Button
                                        type="ghost"
                                        className="mr-3"
                                        onClick={() =>
                                            this.toggleStatusRow(
                                                this.state.selectedRows,
                                                status.disabled
                                            )
                                        }
                                    >
                                        {this.state.selectedRows.length > 1 ? (
                                            <>
                                                <IntlMessage
                                                    id={"users.Disable"}
                                                />{" "}
                                                (
                                                {this.state.selectedRows.length}
                                                )
                                            </>
                                        ) : (
                                            <IntlMessage id={"users.Disable"} />
                                        )}
                                    </Button>
                                </>
                            )}
                            <Button
                                onClick={this.showNewUserModal}
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                block
                            >
                                {" "}
                                <IntlMessage id={"users.Invite"} />
                            </Button>
                        </Flex>
                    </div>
                </Flex>
                <Table
                    loading={this.state.loading}
                    columns={tableColumns}
                    dataSource={users}
                    rowKey="ID"
                    rowSelection={{
                        onChange: (key, rows) => {
                            this.setState({ selectedKeys: key });
                            this.setState({ selectedRows: rows });
                        },
                        selectedRowKeys: this.state.selectedKeys,
                        type: "checkbox",
                        preserveSelectedRowKeys: false,
                    }}
                />
                <UserView
                    data={selectedUser}
                    visible={userProfileVisible}
                    close={() => {
                        this.closeUserViewProfile();
                    }}
                />
                <UserModalAdd
                    getUsersInfo={this.getUsersInfo}
                    CompanyID={this.props.CompanyID}
                    onCreate={this.showNewUserModal}
                    onCancel={this.closeNewUserModal}
                    visible={this.state.newUserModalVisible}
                />
                <UserModalEdit
                    getUsersInfo={this.getUsersInfo}
                    locale={this.props.locale}
                    data={selectedUser}
                    visible={this.state.editModalVisible}
                    onCancel={() => {
                        this.closeEditModal();
                    }}
                />
            </Card>
        );
    }
}

const mapStateToProps = ({ auth, theme, account }: IState) => {
    const { token } = auth as IAuth;
    const { CompanyID, ID } = account as IAccount;
    const { locale } = theme as ITheme;
    return { token, locale, CompanyID, ID };
};

export default connect(mapStateToProps, { sendActivationCode })(UserList);
