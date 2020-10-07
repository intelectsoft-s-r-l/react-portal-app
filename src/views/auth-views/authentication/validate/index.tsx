import React, { useState } from "react";
import { Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { API_IS_AUTH_SERVICE } from "../../../../constants/ApiConstant";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {connect} from "react-redux";
const backgroundStyle = {
  backgroundImage: `url(${process.env.PUBLIC_URL}/img/others/img-17.jpg)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const Validate = ({ RegistrationToken }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onSend = ({ Code }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      axios
        .get(`${API_IS_AUTH_SERVICE}/ActivateUser`, {
          params: {
            Token: RegistrationToken, Code
          }
        })
        .then(response => {
          console.log(response.data);
        })
    }, 1500);
  };

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={9}>
            <Card>
              <div className="my-2">
                <div className="text-center">
                  <img className="img-fluid" src={process.env.PUBLIC_URL + '/img/is-logo-dark.png'} alt="" />
                  <h3 className="mt-3 font-weight-bold">Confirm registration</h3>
                  <p className="mb-4">Enter the confirmation code from your email</p>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <Form
                      form={form}
                      layout="vertical"
                      name="forget-password"
                      onFinish={onSend}
                    >
                      <Form.Item
                        name="Code"
                        rules={[
                          {
                            required: true,
                            message: "Please input your code",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Confirmation code"
                          prefix={<MailOutlined className="text-primary" />}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          loading={loading}
                          type="primary"
                          htmlType="submit"
                          block
                        >
                          {loading ? "Sending" : "Send"}
                        </Button>
                      </Form.Item>
                      <NavLink to={"auth/login"}>Go back</NavLink>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { RegistrationToken } = auth;
  return { RegistrationToken };
}

export default connect(mapStateToProps, null)(Validate)
