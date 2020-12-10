import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientApi } from "../../../../../api";
import Loading from "../../../../../components/shared-components/Loading";
import { ERROR } from "../../../../../constants/Messages";
import { hideLoading, showLoading } from "../../../../../redux/actions/Auth";
import { IState } from "../../../../../redux/reducers";
import { MarketContext } from "../MarketContext";

const LoadingWizard = () => {
    const { selectedApp, getMarketApps } = useContext(MarketContext);
    const loading = useSelector((state: IState) => state["auth"]!.loading);
    const [serviceMsg, setServiceMsg] = useState<any>();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showLoading());
        setTimeout(() => {
            dispatch(hideLoading());
            return new ClientApi()
                .ActivateApp(selectedApp.ID)
                .then((data: any) => {
                    if (data) {
                        if (data.ErrorCode === 0) {
                            setServiceMsg(
                                "You've successfully installed the app. Click the button down below to go to the app!"
                            );
                        } else {
                            setServiceMsg("Something went wrong, try again!");
                        }
                    }
                });
        }, 2500);
    }, []);
    return <div>{loading ? <Loading /> : serviceMsg}</div>;
};

export default LoadingWizard;
