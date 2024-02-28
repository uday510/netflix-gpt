import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import React from 'react';
import Header from './Header';
import { useState, useRef } from 'react';
import checkValidData from '../utils/validate';
import { auth } from '../utils/firebase';
import { updateProfile } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { addUser } from "../utils/userSlice";
import { USER_AVATAR, BG_URL } from "../utils/constants";
import Spinner from "./Spinner";
import "../index.css";

const Login = () => {

  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();


  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  }

  const handleButtonClick = () => {
    // validate the form data

    const message = checkValidData(email.current.value, password.current.value);
    setErrMessage(message);

    if (message) return;

    setIsLoading(true);

    // sign in or sign up the user
    if (!isSignInForm) {
      // sign up logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: { USER_AVATAR }
          }).then(() => {
            // dispatch the user to the redux store
            const { uid, email, displayName, photoURL } = auth.currentUser;
            dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL }));
          }).catch((error) => {
            setErrMessage(error.message);
          })
            .finally(() => {
              // set loading state to false
              setIsLoading(false);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrMessage(errorCode + " " + errorMessage);
        })
        .finally(() => {
          // set loading state to false
          setIsLoading(false);
        });
    } else {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then()
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrMessage(errorCode + " " + errorMessage);
        })
        .finally(() => {
          // set loading state to false
          setIsLoading(false);
        });
    }
  }

  return (
    <div>
      <Header />
      <div className="relative w-full">
        <div className="absolute w-full">
          <img className="h-screen w-full object-cover" src={BG_URL} alt="logo" />
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full md:w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80"
      >
        <h1 className="font-bold text-3xl py-4">{isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {
          !isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-4 my-4 w-full bg-gray-700"
            />
          )
        }
        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-4 my-4 w-full bg-gray-700 "
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-4 my-4 w-full bg-gray-700"
        />
        {errMessage && <p className="text-red-500 font-bold text-lg py-2">{errMessage}</p>}
        {isLoading ? <Spinner /> : <button className="p-4 my-4 bg-red-700 w-full rounded-lg" onClick={handleButtonClick}>{isSignInForm ? "Sign In" : "Sign Up"}</button>}
        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>{isSignInForm ? "New to Netflix? Sign Up Now" : "Already registered? Sign In Now."}</p>
      </form>
    </div>
  );
}

export default Login