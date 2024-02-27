import React from 'react'
import { LOGO } from '../utils/constants';
import { USER_AVATAR } from '../utils/constants';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Error from './Error';

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/");
    }).catch((error) => {
      // An error happened.
      navigate("/error")
    });
  }

  return (
    <div className="absolute w-full px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
      <img
        className="w-44"
        src={LOGO}
        alt="logo"
      />
      {
        user &&
        <div
          className='flex p-2'>
          <img
            className='w-12 h-12'
            alt="user-avatar"
              src={USER_AVATAR || user?.photoURL}
          />
            <button onClick={handleSignOut} className='font-bold text-white'>(Sign out)</button>
        </div>
      }
    </div>
  )
}

export default Header