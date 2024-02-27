import React, { useEffect } from 'react'
import { LOGO } from '../utils/constants';
import { USER_AVATAR, SUPPORTED_LANGUAGES } from '../utils/constants';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { toggleGptSearchView } from '../utils/gptSlice';
import { changeLanguage } from '../utils/configSlice';

const Header = () => {
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  const handleSignOut = () => {
    signOut(auth).then(() => {
    }).catch((error) => {
      navigate("/error")
    });
  }

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  }

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL })
        );
        navigate('/browse');
      } else {
        dispatch(removeUser());
        navigate('/');
      }
    });

    return (() => unsubscribe());
  }, [])

  return (
    <div className="absolute w-full px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
      <img
        className="w-44 hover:cursor-pointer"
        src={LOGO}
        alt="logo"
      />
      {
        user &&
        <div
          className='flex p-2'>
          {
            showGptSearch && <>
              <select className='p-2 m-2 bg-gray-900 text-white' onChange={handleLanguageChange}>
                {
                  SUPPORTED_LANGUAGES.map((language, index) => {
                    return (
                      <option key={index} value={language.identifier}>{language.name}</option>
                    )
                  })
                }
              </select>
            </>
          }
          <button className='py-2 px-4 mx-4 my-2 bg-purple-800 text-white rounded-lg'
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "Homepage" : "GPT Search"}
          </button>
          <img
            className='w-12 h-12'
            alt="user-avatar"
            src={USER_AVATAR || user?.photoURL}
          />
          <button onClick={handleSignOut} className='font-bold text-white'> (Sign out)</button>
        </div>
      }
    </div>
  )
}

export default Header