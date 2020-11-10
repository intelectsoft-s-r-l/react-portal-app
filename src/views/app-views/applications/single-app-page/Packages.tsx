import { Card, Col, Empty, Row, Tag } from "antd";
import React, { useEffect } from "react";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../components/shared-components/Flex";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const ItemHeader = ({ packages }) => (
    <>
        <Flex>
            <h4 className="mb-0">{packages.Name}</h4>
            <Tag
                className="text-capitalize ml-2"
                color={packages.Status === 1 ? "cyan" : "red"}
            >
                {packages.Status === 1 ? (
                    <CheckCircleOutlined />
                ) : (
                    <ClockCircleOutlined />
                )}
                <span className="ml-2 font-weight-semibold">
                    {packages.Status === 1 ? "Active" : "Not Active"}
                </span>
            </Tag>
        </Flex>
    </>
);

const ItemFooter = ({ packages }) => (
    <div>
        <h5>Pricing</h5>
        <Flex justifyContent="center">
            <Card className="mt-3">
                <div>
                    From {packages.MinValue} to {packages.MaxValue} for{" "}
                    {packages.Price} MDL
                </div>
            </Card>
        </Flex>
    </div>
);
const CardItem = ({ packages }) => {
    return (
        <Card>
            <ItemHeader packages={packages} />
            <div className="mt-2">
                <ItemFooter packages={packages} />
            </div>
        </Card>
    );
};
const Packages = ({ packages }: any) => {
    useEffect(() => {
        console.log(packages);
    }, []);
    return (
        <>
            <h2 className="mb-4">Packages</h2>
            <div className="my-4 container-fluid">
                <Row gutter={16}>
                    {packages.length > 0 ? (
                        packages.map((elm) => (
                            <Col
                                xs={24}
                                sm={24}
                                lg={8}
                                xl={8}
                                xxl={6}
                                key={elm["ID"]}
                            >
                                <CardItem packages={elm} />
                            </Col>
                        ))
                    ) : (
                        <Flex className="w-100" justifyContent="center">
                            <Empty />
                        </Flex>
                    )}
                </Row>
            </div>
        </>
    );
};
export default Packages;
