import React from 'react'
import {Col, Row} from "antd";
import { NavLink } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
const backgroundStyle = {
	backgroundImage: `url(${process.env.PUBLIC_URL}/img/others/img-17.jpg)`,
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
};
// Use LoginOne if it's Admin Portal App

// const LoginOne = (props) => {
//   return (
//     <div className="h-100" style={backgroundStyle}>
//       <div className="container d-flex flex-column justify-content-center h-100">
//         <Row justify="center">
//           <Col xs={20} sm={20} md={20} lg={7}>
//             <Card>
//               <div className="my-4">
//                 <div className="text-center">
//                   <img
//                     className="img-fluid"
//                     src="/img/is-logo-dark.png"
//                     alt=""
//                   />
//                   <p>
//                     Don't have an account yet?{" "}
//                     <NavLink to="/auth/register">Sign Up</NavLink>
//                   </p>
//                 </div>
//                 <Row justify="center">
//                   <Col xs={24} sm={24} md={20} lg={20}>
//                     <LoginForm {...props} />
//                   </Col>
//                 </Row>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };
//
// export default LoginOne;



const LoginTwo = props => {


	return (
		<div className="h-100 bg-white">
			<Row justify="center" className="align-items-stretch h-100">
				<Col xs={20} sm={20} md={24} lg={16}>
					<div className="container d-flex flex-column justify-content-center h-100">
						<Row justify="center">
							<Col xs={24} sm={24} md={20} lg={12} xl={8}>
								<h1>Sign In</h1>
								<p>Don't have an account yet? <NavLink to="/auth/register">Sign Up</NavLink></p>
								<div className="mt-4">
									<LoginForm {...props}/>
								</div>

							</Col>
						</Row>
					</div>
				</Col>
				<Col xs={0} sm={0} md={0} lg={8}>
					<div className="d-flex flex-column justify-content-between h-100 px-4" style={backgroundStyle}>
						<div className="text-right">
							<img className={"mt-2"} src={process.env.PUBLIC_URL + "/img/rsz_is_logo-efactura.png"} alt="logo"/>
						</div>
						<Row justify="center">
							<Col xs={0} sm={0} md={0} lg={20}>
								<img className="img-fluid mb-5" src={process.env.PUBLIC_URL + "/img/others/img-18.png"} alt=""/>
								<h1 className="text-white">Welcome to IntelectSoft</h1>
								<p className="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper nisl erat, vel convallis elit fermentum pellentesque.</p>
							</Col>
						</Row>
						<div className="d-flex justify-content-end pb-4">
							<div>
								<a className="text-white" href="/#" onClick={e => e.preventDefault()}>Term & Conditions</a>
								<span className="mx-2 text-white"> | </span>
								<a className="text-white" href="/#" onClick={e => e.preventDefault()}>Privacy & Policy</a>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default LoginTwo
