import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link,useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Store } from "../store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SigninScreen() {
  const navigate=useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const {state,dispatch:ctxDispatch}=useContext(Store)
    const{userInfo}=state;


  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
      const { data }=await axios.post('/api/users/signin',{
        email,
        password,
      });
      ctxDispatch({type:'USER_SIGNIN',payload:data})
      localStorage.setItem('userInfo',JSON.stringify(data));
      navigate(redirect||'/');
    } catch (err){
      toast.error(getError(err));

    }
  };
  useEffect(()=>{
    if(userInfo){
      navigate(redirect);
    }
  },
  //{navigate,redirect,userInfo}
  )
    return(
    <div className="signin-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler}>
        <lable>Email</lable>
        <input type="email" required onChange={(e)=>setEmail(e.target.value)}/>
        <label>password</label>
        <input type="password" required onChange={(e)=>setPassword(e.target.value)}/>
        <div>
            <button type="submit">SIGN IN</button>
        </div>
        <div>
            New Customer?{' '}
            <Link to={`/signup?resirecct=${redirect}`}>Create Your Account</Link>
        </div>
      </form>
    </div>
  );
}
