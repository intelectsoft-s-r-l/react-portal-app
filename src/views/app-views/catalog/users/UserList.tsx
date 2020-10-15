import React, { Component } from "react";
import { Card, Table, Tag, Tooltip, message, Button } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import UserView from "./UserView";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import userData from "../../../../assets/data/user-list.data.json";
import "../hand_gesture.scss";

export class UserList extends Component {
  /* MAKE THIS FROM API CALL */
  state = {
    users: userData,
    userProfileVisible: false,
    selectedUser: null,
    isHidden: "block",
  };

  deleteUser = (userId) => {
    this.setState({
      users: this.state.users.filter((item) => item.id !== userId),
    });
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  showUserProfile = (userInfo) => {
    this.setState({
      userProfileVisible: true,
      selectedUser: userInfo,
    });
  };

  closeUserProfile = () => {
    this.setState({
      userProfileVisible: false,
      selectedUser: null,
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
              src={process.env.PUBLIC_URL + record.img}
              name={record.name}
              subTitle={record.email}
            />
          </div>
        ),
        sorter: {
          compare: (a, b) => {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: "Role",
        dataIndex: "role",
        sorter: {
          compare: (a, b) => a.role.length - b.role.length,
        },
      },
      {
        title: "Last online",
        dataIndex: "lastOnline",
        render: (date) => (
          <span>{moment.unix(date).format("MM/DD/YYYY")} </span>
        ),
        sorter: (a, b) =>
          moment(a.lastOnline).unix() - moment(b.lastOnline).unix(),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status) => (
          <Tag
            className="text-capitalize"
            color={status === "active" ? "cyan" : "red"}
          >
            {status}
          </Tag>
        ),
        sorter: {
          compare: (a, b) => a.status.length - b.status.length,
        },
      },
      {
        title: "",
        dataIndex: "actions",
        render: (_, elm) => (
          <div className="text-right">
            <Tooltip title="Edit">
              <Button
                type="dashed"
                icon={<EditOutlined />}
                className="mr-2"
                size="small"
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
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteUser(elm.id);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    return (
      <Card bodyStyle={{ padding: "0px", position: "relative" }}>
        {/* <img
          style={{ display: this.state.isHidden }}
          onAnimationEnd={() => this.setState({ isHidden: "none" })}
          alt="Hand gesture"
          className="hand-gesture__svg"
          src={process.env.PUBLIC_URL + "/img/icons/horizontal-scroll.svg"}
        /> */}
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
        <UserView
          data={selectedUser}
          visible={userProfileVisible}
          close={() => {
            this.closeUserProfile();
          }}
        />
      </Card>
    );
  }
}

export default UserList;
