import React from "react";
import RegisterForm from "../../components/RegisterForm";
import { Card, Row, Col } from "antd";
import { NavLink } from "react-router-dom";

const backgroundStyle = {
  backgroundImage: `url(${process.env.PUBLIC_URL}/img/others/img-17.jpg)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  minHeight: "100vh",
};

// const RegisterOne = (props) => {
//   return (
//     <div className="" style={backgroundStyle}>
//       <div className="container d-flex flex-column justify-content-center h-100">
//         <Row justify="center">
//           <Col xs={20} sm={20} md={20} lg={7}>
//             <Card>
//               <div className="my-2">
//                 <div className="text-center">
//                   <img
//                     className="img-fluid"
//                     src="/img/is-logo-dark.png"
//                     alt=""
//                   />
//                   <p className="text-muted">Create a new account</p>
//                 </div>
//                 <Row justify="center">
//                   <Col xs={24} sm={24} md={20} lg={20}>
//                     <RegisterForm {...props} />
//                   </Col>
//                   <p>
//                     Do you have an account already?{" "}
//                     <NavLink to="/auth/login">Sign In</NavLink>
//                   </p>
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
// export default RegisterOne;


const RegisterTwo = props => {
  return (
    <div className="bg-white">
      <Row justify="center" className="align-items-stretch h-100">
        <Col xs={20} sm={20} md={24} lg={14} style={{padding: "20px 0"}}>
          <div className="container d-flex flex-column justify-content-center h-100">
            <Row justify="center">
              <Col xs={24} sm={24} md={20} lg={12} xl={8}>
                <h1>Sign Up</h1>
                <p>Already have an account? <NavLink to="/auth/login">Sign In</NavLink></p>
                <div className="mt-4">
                  <RegisterForm {...props} />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={10}>
          <div className="d-flex flex-column justify-content-between h-100 px-4 position-fixed" style={backgroundStyle}>
            <div className="text-right">
              <img className={"mt-2"} src={process.env.PUBLIC_URL + "/img/rsz_is_logo-efactura.png"} alt="logo"/>
            </div>
            <Row justify="center">
              <Col xs={0} sm={0} md={0} lg={20}>
                <img className="img-fluid mb-5" src={process.env.PUBLIC_URL + "/img/others/img-19.png"} alt=""/>
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

export default RegisterTwo


/*
<div className="bg-white">
  <Row justify="center" className="align-items-stretch h-100">
  <Col xs={20} sm={20} md={24} lg={16} style={{padding: "20px 0"}}>
<div className="container d-flex flex-column justify-content-center h-100">
  <Row justify="center">
  <Col xs={24} sm={24} md={20} lg={12} xl={8}>
  <h1>Sign Up</h1>
<p>Already have an account? <NavLink to="/auth/login">Sign In</NavLink></p>
  <div className="mt-4">
  <RegisterForm {...props} />
</div>
</Col>
</Row>
</div>
</Col>
<Col xs={0} sm={0} md={0} lg={8}>
<div className="d-flex flex-column justify-content-between h-100 px-4 position-fixed" style={backgroundStyle}>
<div className="text-right">
<img className={"mt-2"} src={process.env.PUBLIC_URL + "/img/rsz_is_logo-efactura.png"} alt="logo"/>
</div>
<Row justify="center">
<Col xs={0} sm={0} md={0} lg={20}>
<img className="img-fluid mb-5" src={process.env.PUBLIC_URL + "/img/others/img-19.png"} alt=""/>
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
</div>*/
