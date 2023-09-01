import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password!==confirmPassword){
        toast.error('password do not match');
        return;
    }
    try {
      const { data } = await axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(
    () => {
      if (userInfo) {
        navigate(redirect);
      }
    },
    //{ navigate, redirect, userInfo }
  );
  return (
    <div className="signin-container">
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      <h1>Sign up</h1>
      <form onSubmit={submitHandler}>
        <lable>Name</lable>
        <input
          type="text"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <lable>Email</lable>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>password</label>
        <input
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <lable>ConfirmPassword</lable>
        <input
          type="password"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div>
          <button type="submit">SIGN UP</button>
        </div>
        <div>
          Already have an account?{" "}
          <Link to={`/signin?resirecct=${redirect}`}>signin</Link>
        </div>
      </form>
    </div>
  );
}
