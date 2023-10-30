import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorAlertWithMessage } from "../helper/alerts";
import { logout } from "../reducers/userSlice";

export default function ProtectedPageSuperAdmin({
  children,
  adminOnly = false,
  needLogin = false,
}) {
  const user = useSelector((state) => state.user);
  // console.log("ini user", user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (adminOnly && !(user?.role === "Super Admin")) {
      errorAlertWithMessage("You are not allowed to access this page");
      dispatch(logout());
      localStorage.removeItem("token");
      return navigate("/");
    } else if (needLogin && !user?.id) {
      return navigate("/login");
    }
  });

  return children;
}
