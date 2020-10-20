import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button, Modal } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  CheckOutlined,
  PlusOutlined,
  UserOutlined,
  FrownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import UserView from "./UserView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import userData from "../../../../assets/data/user-list.data.json";
import "../hand_gesture.scss";
import {
  API_IS_AUTH_SERVICE,
  API_IS_CLIENT_SERVICE,
} from "../../../../constants/ApiConstant";
import axios from "axios";
import { connect } from "react-redux";
import { signOut } from "../../../../redux/actions/Auth";
import { UserModalEdit } from "./UserModalEdit";
import { UserModalAdd } from "./UserModalAdd";
import "./add_user.scss";

interface IUserListState {
  users: any[];
  userProfileVisible: boolean;
  selectedUser: any;
  isHidden: string;
  editModalVisible: boolean;
  newUserModalVisible: boolean;
  registerUserModalVisible: boolean;
  loading: boolean;
}

export class UserList extends Component<{ [key: string]: any }> {
  /* MAKE THIS FROM API CALL */
  state = {
    users: [],
    userProfileVisible: false,
    selectedUser: null,
    isHidden: "block",
    editModalVisible: false,
    newUserModalVisible: false,
    registerUserModalVisible: false,
    loading: false,
  } as IUserListState;

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(`${API_IS_CLIENT_SERVICE}/GetUsersInfo`, {
        params: {
          Token: this.props.token,
        },
      })
      .then((res) => {
        this.setState({ loading: false });
        console.log(res.data);
        if (res.data.ErrorCode === 0) {
          this.setState({ users: [...res.data.Users] });
        } else if (res.data.ErrorCode === 118) {
          message.loading(
            "Time has expired. Redirecting you to login page...",
            2
          );
          setTimeout(() => {
            this.props.signOut();
          }, 2000);
        }
      });
  }

  deleteUser = (userId) => {
    this.setState({
      users: this.state.users.filter((item) => item["id"] !== userId),
    });
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  showUserProfile = (userInfo) => {
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

  showEditModal = (userInfo) => {
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

  showConfirmRegistrationModal = (UserID) => {
    const Token = this.props.token;
    Modal.confirm({
      title: "User registration confirmation",
      content: "Press OK if you want us to send a new activation message",
      onOk() {
        axios
          .get(`${API_IS_AUTH_SERVICE}/SendActivationCode`, {
            params: {
              Token,
              UserID,
            },
          })
          .then((res) => {
            console.log(res.data);
          });
      },
      onCancel() {},
    });
  };

  render() {
    const { users, userProfileVisible, selectedUser } = this.state;

    const tableColumns = [
      {
        title: "User",
        dataIndex: "name",
        render: (_, record) => (
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
        /*         dataIndex: "role",
        sorter: {
          compare: (a, b) => a.role.length - b.role.length,
        }, */
      },
      {
        title: "Last online",
        dataIndex: "LastAuthorize",
        render: (LastAuthorize) => (
          <span>
            {LastAuthorize
              ? moment.unix(LastAuthorize.slice(6, 16)).format("DD/MM/YYYY")
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
            color={Status === 1 ? "cyan" : Status === 2 ? "red" : "orange"}
            onClick={() =>
              Status === 0 &&
              Modal.confirm({
                title: "Send a new activation code?",
                content: "Hello",
              })
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
        title: "",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right">
            {elm.Status === 0 && (
              <Tooltip title="Activate">
                <Button
                  icon={<UserAddOutlined />}
                  className="mr-2"
                  size="small"
                  onClick={() => this.showConfirmRegistrationModal(elm.ID)}
                />
              </Tooltip>
            )}
            <Tooltip title="Edit">
              <Button
                type="dashed"
                icon={<EditOutlined />}
                className="mr-2"
                size="small"
                onClick={() => this.showEditModal(elm)}
              />
            </Tooltip>
            <Tooltip title="View">
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                onClick={() => {
                  this.showUserProfile(elm);
                }}
                size="small"
              />
            </Tooltip>
            {/* <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteUser(elm.id);
                }}
                size="small"
              />
            </Tooltip> */}
          </div>
        ),
      },
    ];
    return (
      <Card bodyStyle={{ padding: "0px", position: "relative" }}>
        <Table
          loading={this.state.loading}
          columns={tableColumns}
          dataSource={users}
          rowKey="ID"
          style={{ position: "relative" }}
          locale={{
            emptyText: <FrownOutlined style={{ fontSize: "30px" }} />,
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
          CompanyID={this.props.CompanyID}
          onCreate={this.showNewUserModal}
          onCancel={this.closeNewUserModal}
          visible={this.state.newUserModalVisible}
          token={this.props.token}
        />
        <UserModalEdit
          locale={this.props.locale}
          data={selectedUser}
          visible={this.state.editModalVisible}
          onCancel={() => {
            this.closeEditModal();
          }}
          token={this.props.token}
        />
        {this.state.users && !this.state.loading && (
          <Tooltip title="Register user">
            <PlusOutlined
              onClick={this.showNewUserModal}
              className="add_user"
              style={{ position: "absolute", bottom: "15px", left: "15px" }}
            />
          </Tooltip>
        )}
        {/* Continue coding here... */}
        {/* Choose between Cascadia Code and MonoLisa fonts for VSCode */}
      </Card>
    );
  }
}

const mapStateToProps = ({ auth, theme, account }) => {
  const { token } = auth;
  const { CompanyID } = account;
  const { locale } = theme;
  return { token, locale, CompanyID };
};

export default connect(mapStateToProps, { signOut })(UserList);
