import React from "react";

function AuthLayout({ children, authentication = true, role = "user" }) {
  return <div>{children}</div>;
}

export default AuthLayout;
