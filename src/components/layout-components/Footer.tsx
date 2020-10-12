import React from 'react'
import { APP_NAME } from '../../configs/AppConfig';
import IntlMessage from "../util-components/IntlMessage";

export default function Footer() {
	return (
		<footer className="footer">
			<span>Copyright  &copy;  {`${new Date().getFullYear()}`} <span className="font-weight-semibold">{`${APP_NAME}`}</span>{". "}<IntlMessage id={"auth.Rights"}/></span>
			<div>
				<a className="text-gray" href="/#" onClick={e => e.preventDefault()}><IntlMessage id={"auth.Terms&Conditions"}/></a>
				<span className="mx-2 text-muted"> | </span>
				<a className="text-gray" href="/#" onClick={e => e.preventDefault()}><IntlMessage id={"auth.Privacy&Policy"}/></a>
			</div>
		</footer>
	)
}

