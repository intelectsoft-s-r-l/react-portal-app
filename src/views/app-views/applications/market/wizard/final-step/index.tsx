import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { ClientApi } from "../../../../../../api";
import Loading from "../../../../../../components/shared-components/Loading";
import { hideLoading, showLoading } from "../../../../../../redux/actions/Auth";
import { IState } from "../../../../../../redux/reducers";
import { MarketContext } from "../../MarketContext";
import FinalWizard from "./AppInstalled";

const FinalStep = () => {
    const { selectedApp, getMarketApps } = useContext(MarketContext);
    const loading = useSelector((state: IState) => state["auth"]!.loading);
    const [isInstalled, setIsInstalled] = useState<boolean>(true);
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        dispatch(showLoading());
        setTimeout(() => {
            dispatch(hideLoading());
            return new ClientApi()
                .ActivateApp(selectedApp.ID)
                .then((data: any) => {
                    if (data) {
                        if (data.ErrorCode === 0) {
                            setIsInstalled(true);
                        } else {
                            setIsInstalled(false);
                        }
                    }
                });
        }, 2500);
    }, []);
    return (
        <>{loading ? <Loading /> : <FinalWizard isInstalled={isInstalled} />}</>
    );
};

export default FinalStep;
