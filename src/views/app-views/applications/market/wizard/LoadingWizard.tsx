import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientApi } from "../../../../../api";
import Loading from "../../../../../components/shared-components/Loading";
import { hideLoading, showLoading } from "../../../../../redux/actions/Auth";
import { MarketContext } from "../MarketContext";

const LoadingWizard = () => {
    const { selectedApp, getMarketApps } = useContext(MarketContext);
    const loading = useSelector((state) => state["auth"].loading);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showLoading());
        setTimeout(() => {
            dispatch(hideLoading());
            return new ClientApi().ActivateApp(selectedApp.ID);
        }, 2500);
    }, []);
    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                "You've successfully installed the app. Click the button down below to go to the app!"
            )}
        </div>
    );
};

export default LoadingWizard;
