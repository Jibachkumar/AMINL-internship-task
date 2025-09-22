import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login as authLogin, logout } from "../store/authSlice.js";

export function AuthInitializer({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/users/current-user`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data?.user) {
            dispatch(authLogin({ userData: data?.user }));
          } else {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.log(error.message);
        dispatch(logout());
      } finally {
        setInitialized(true); // ✅ mark initialization done
      }
    };
    fetchAuthUser();
  }, [dispatch]);

  if (!initialized) return;

  return children;
}
