import React, { Component } from "react";
import { Avatar, Drawer, Divider } from "antd";
import {
  MobileOutlined,
  MailOutlined,
  UserOutlined,
  CompassOutlined,
  CalendarOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  GlobalOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

interface UserViewProps {
  data: any;
  visible: boolean;
  close: any;
}

export class UserView extends Component<UserViewProps> {
  render() {
    const { data, visible, close } = this.props;
    return (
      <Drawer
        width={300}
        placement="right"
        onClose={close}
        closable={false}
        visible={visible}
      >
        <div className="text-center mt-3">
          <Avatar size={80} src={process.env.PUBLIC_URL + data?.Photo} />
          <h3 className="mt-2 mb-0">
            {data?.FirstName && data?.LastName
              ? data?.FirstName + " " + data?.LastName
              : " "}
          </h3>
          <span className="text-muted">
            {/* {data?.personalInfo.title} */}User
          </span>
        </div>
        <Divider dashed />
        <div className="">
          <h6 className="text-muted text-uppercase mb-3">Account details</h6>
          <p>
            <UserOutlined />
            <span className="ml-3 text-dark">Personal ID: {data?.ID}</span>
          </p>
          <p>
            <ApartmentOutlined />
            <span className="ml-3 text-dark">
              Company ID: {data?.CompanyID}
            </span>
          </p>
          {/* <p>
            <CalendarOutlined />
            <span className="ml-3 text-dark">
              Born in {data?.personalInfo.birthday}
            </span>
          </p> */}
        </div>
        <div className="mt-5">
          <h6 className="text-muted text-uppercase mb-3">CONTACT</h6>
          <p>
            <MobileOutlined />
            <span className="ml-3 text-dark">{data?.PhoneNumber}</span>
          </p>
          <p>
            <MailOutlined />
            <span className="ml-3 text-dark">
              {data?.Email ? data?.Email : "-"}
            </span>
          </p>
          {/* <p>
            <CompassOutlined />
            <span className="ml-3 text-dark">
              {data?.personalInfo.location}
            </span>
          </p> */}
        </div>
        {/* <div className="mt-5">
          <h6 className="text-muted text-uppercase mb-3">Social profiles</h6>
          <p>
            <FacebookOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.facebook ? data?.personalInfo.facebook : "-"}
            </a>
          </p>
          <p>
            <TwitterOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.twitter ? data?.personalInfo.twitter : "-"}
            </a>
          </p>
          <p>
            <InstagramOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.instagram
                ? data?.personalInfo.instagram
                : "-"}
            </a>
          </p>
          <p>
            <GlobalOutlined />
            <a href="/#" className="ml-3 text-dark">
              {data?.personalInfo.site ? data?.personalInfo.site : "-"}
            </a>
          </p>
        </div> */}
      </Drawer>
    );
  }
}

export default UserView;
