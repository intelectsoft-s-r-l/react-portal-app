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

enum status {
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
interface ReduxStoreProps {
    token: string;
    locale: string;
    ID: number;
    CompanyID: number;
    sendActivationCode: any;
}

export class UserList extends Component<ReduxStoreProps> {
    /* MAKE THIS FROM API CALL */
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
        loading: false,
    };

    sortData = (arr) => {
        return arr.slice().sort((a, b) => a.ID - b.ID);
    };

    getUsersInfo = () => {
        return new ClientApi().GetUserList().then((data: any) => {
            if (data) {
                const { ErrorCode } = data;
                if (ErrorCode === 0) {
                    const filteredUsers = data.Users.filter(
                        (user) => user.ID !== this.props.ID
                    );
                    const evaluatedArray = this.sortData(filteredUsers);
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

    toggleStatusRow = async (row, statusNumber) => {
        Modal.confirm({
            title: `Are you sure you want to ${
                statusNumber === 0 || statusNumber === 2
                    ? "disable"
                    : "activate"
            } ${row.length} ${row.length > 1 ? "users" : "user"}?`,
            onOk: async () => {
                await Promise.all(
                    row.map(async (elm) => {
                        await this.handleUserStatus(elm.ID, statusNumber);
                    })
                );
                this.setState({ selectedRows: [], selectedKeys: [] });
                this.getUsersInfo();
            },
        });
    };

    // deleteRow = (row) => {
    //     const objKey = "ID";
    //     let data = this.state.users;
    //     Modal.confirm({
    //         title: `Are you sure you want to delete ${
    //             this.state.selectedRows.length
    //         } ${this.state.selectedRows.length > 1 ? "users" : "user"}?`,
    //         onOk: () => {
    //             if (this.state.selectedRows.length > 1) {
    //                 this.state.selectedRows.forEach((elm) => {
    //                     this.handleUserStatus(elm.ID, status.deleted);
    //                     data = Utils.deleteArrayRow(data, objKey, elm.ID);
    //                     this.setState({ users: data });
    //                     this.setState({ selectedRows: [] });
    //                 });
    //             } else {
    //                 for (const elm of row) {
    //                     data = Utils.deleteArrayRow(data, objKey, elm.ID);
    //                     this.setState({ selectedRows: [], selectedKeys: [] });
    //                     this.setState({ users: data });
    //                     this.handleUserStatus(elm.ID, status.deleted);
    //                 }
    //             }
    //         },
    //     });
    // };

    handleUserStatus = (userId: number, status: number) => {
        return new ClientApi().ChangeUserStatus(userId, status);
    };
    dropdownMenu = (row) => (
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
                        <span className="ml-2">Send activation code</span>
                    </Flex>
                </Menu.Item>
            )}
            <Menu.Item onClick={() => this.showUserProfile(row)}>
                <Flex alignItems="center">
                    <EyeOutlined />
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => this.showEditModal(row)}>
                <Flex alignItems="center">
                    <EditOutlined />
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            {row.Status === status.inactive ||
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
                        <span className="ml-2">Activate</span>
                    </Flex>
                </Menu.Item>
            ) : (
                <Menu.Item
                    onClick={async () => {
                        Modal.confirm({
                            title: `Are you sure you want to disable this user?`,
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
                        <span className="ml-2">Disable</span>
                    </Flex>
                </Menu.Item>
            )}
            {/* <Menu.Item
                onClick={async () => {
                    Modal.confirm({
                        title: `Are you sure you want to delete this user?`,
                        onOk: async () => {
                            await this.handleUserStatus(row.ID, status.deleted);
                            await this.getUsersInfo();
                        },
                    });
                }}
            >
                <Flex alignItems="center">
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item> */}
        </Menu>
    );

    onSearch = (e) => {
        const value = e.currentTarget.value;
        const searchArray = value ? this.state.users : this.state.usersToSearch;
        const data = Utils.wildCardSearch(searchArray, value);
        this.setState({ users: data });
    };

    render() {
        const { users, userProfileVisible, selectedUser } = this.state;

        const tableColumns = [
            // {
            //     title: "ID",
            //     dataIndex: "ID",
            //     sorter: { compare: (a, b) => a.ID - b.ID },
            //     defaultSortOrder: "ascend" as SortOrder,
            // },
            {
                title: "User",
                dataIndex: "name",
                render: (_, record: UsersProps) => (
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
                    compare: (a, b) => {
                        a = a.FirstName.toLowerCase();
                        b = b.FirstName.toLowerCase();
                        return a > b ? -1 : b > a ? 1 : 0;
                    },
                },
            },
            {
                title: "Role",
                render: () => "User",
            },
            {
                title: "Last online",
                dataIndex: "LastAuthorize",
                render: (LastAuthorize) => (
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
                title: "Status",
                dataIndex: "Status",
                render: (Status) => (
                    <Tag
                        className="text-capitalize"
                        color={
                            Status === 1
                                ? "cyan"
                                : Status === 2
                                ? "red"
                                : "orange"
                        }
                    >
                        {Status === 1
                            ? "Active"
                            : Status === 2
                            ? "Disabled"
                            : "Not Activated"}
                    </Tag>
                ),
                sorter: {
                    compare: (a, b) => a.Status - b.Status,
                },
            },
            {
                dataIndex: "actions",
                render: (_, elm: UsersProps) => (
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
                            placeholder="Search"
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
                                        {this.state.selectedRows.length > 1
                                            ? `Activate (${this.state.selectedRows.length})`
                                            : "Activate"}
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
                                        {this.state.selectedRows.length > 1
                                            ? `Disable (${this.state.selectedRows.length})`
                                            : "Disable"}
                                    </Button>
                                    {/* <Tooltip
                                        title={`${
                                            this.state.selectedRows.length > 1
                                                ? `Delete (${this.state.selectedRows.length})`
                                                : "Delete"
                                        }`}
                                    >
                                        <Button
                                            className="mr-3"
                                            danger
                                            onClick={() =>
                                                this.deleteRow(
                                                    this.state.selectedRows
                                                )
                                            }
                                        >
                                            <DeleteOutlined />
                                        </Button>
                                    </Tooltip> */}
                                </>
                            )}
                            <Button
                                onClick={this.showNewUserModal}
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                block
                            >
                                Invite user
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

const mapStateToProps = ({ auth, theme, account }) => {
    const { token } = auth;
    const { CompanyID, ID } = account;
    const { locale } = theme;
    return { token, locale, CompanyID, ID };
};

export default connect(mapStateToProps, { sendActivationCode })(UserList);
