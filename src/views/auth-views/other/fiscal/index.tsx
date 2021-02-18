import { Button, Card, Divider, Result, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";
import { AUTH_PREFIX_PATH } from "../../../../configs/AppConfig";
import { SIGNOUT } from "../../../../redux/constants/Auth";
const bonJson = {
  Company: "Tirex Petrol",
  IDNO: 100360000008275,
  Address1: "raionul Soroca, com. Varancau",
  Address2: "nedentificata 8/2 ap.54",
  DCPE: "Inr. Nr: DCPE-0001-00014",
  BonNumber: "00165",
  BonID: "01",
  Location: "PECO Singera 1",
  Admins: "IS Support",
  Liters: 18.05,
  PricePerLiter: 18.85,
  TotalPrice: 340.25,
  TotalPriceNet: "250.00",
  FuelType: "A95",
  Discount: 90.25,
  TVAPercent: "20.00%",
  TVA: 41.67,
  Card: "2975/Universal 1",
  ArticolNumber: "00001",
  Date: "12.02.2021",
  Time: "16:38:35",
};

const { Text } = Typography;
const Fiscal = ({ match, history }: RouteComponentProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if ("fiscID" in match.params) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);
  if (loading) return <Loading />;
  if (!hasAccess)
    return (
      <Result
        status="403"
        title="Incorrect ID"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary">
            <Link to={AUTH_PREFIX_PATH}>
              <span>Find your way</span>
            </Link>
          </Button>
        }
      />
    );
  return (
    <div
      className="h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/img/others/img-17.jpg)`,
      }}
    >
      <Card style={{ width: 350, maxWidth: "100%" }}>
        <Flex alignItems="center" flexDirection="column">
          <Text>"{bonJson.Company}"</Text>
          <Text>IDNO: {bonJson.IDNO}</Text>
          <Text>{bonJson.Address1}</Text>
          <Text>{bonJson.Address2}</Text>
          <Text>{bonJson.DCPE}</Text>
          <span>***</span>
        </Flex>
        <Flex justifyContent="between">
          <div>
            <Text>{bonJson.BonNumber}</Text>
            <br />
            <Text>#-{bonJson.Location}</Text>
            <br />
            <Text>#-{bonJson.Admins}</Text>
          </div>
          <Text>{bonJson.BonID} #</Text>
        </Flex>
        <Flex justifyContent="between" className="mt-2">
          <div>
            <div>&nbsp;</div>
            <Text>{bonJson.FuelType}</Text>
          </div>
          <div className="text-right">
            <Text style={{ letterSpacing: 2 }}>
              {bonJson.Liters} Litri x {bonJson.PricePerLiter}
            </Text>
            <br />
            <Text>{bonJson.TotalPrice}</Text>
          </div>
        </Flex>
        <Divider dashed />
        <Flex justifyContent="between">
          <div>
            <Text className="h4">TOTAL</Text>
            <br />
            <Text>Reducere:</Text>
          </div>
          <div className="text-right">
            <Text className="h3">{bonJson.TotalPriceNet}</Text>
            <br />
            <Text>{bonJson.Discount}</Text>
          </div>
        </Flex>
        <Flex justifyContent="between" className="my-3">
          <div>
            <Text>TVA A={bonJson.TVAPercent}</Text>
            <br />
            <Text>Cont client</Text>
          </div>
          <div className="text-right">
            <Text>{bonJson.TVA}</Text>
            <br />
            <Text>{bonJson.TotalPriceNet}</Text>
          </div>
        </Flex>
        <Text>#Card: &nbsp;&nbsp;{bonJson.Card}</Text>
        <Flex justifyContent="center" className="my-3 text-center">
          <div>
            <Text style={{ textTransform: "uppercase", letterSpacing: 10 }}>
              Va multumim!
            </Text>
            <br />
            <div>
              <Text>1 ARTICOL</Text>
            </div>
          </div>
        </Flex>
        <Flex justifyContent="between">
          <div>
            <Text>{bonJson.ArticolNumber}</Text>
          </div>
          <div className="text-right">
            <Text>{bonJson.Date}</Text>
            <br />
            <Text>{bonJson.Time}</Text>
          </div>
        </Flex>
        <Flex
          alignItems="center"
          flexDirection="column"
          className="text-center"
        >
          <Text className="text-uppercase h3">Bon fiscal!</Text>
          <div>IntelectSoft S.R.L</div>
        </Flex>
      </Card>
    </div>
  );
};

export default Fiscal;
