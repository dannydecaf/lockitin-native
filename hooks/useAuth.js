import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { createContext, useContext, useEffect, useState } from 'react';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoadingInitial(false);
    })
  }, [])

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '367382106570-ekh9rif5d6hacl7gruusjlcs8icnhhb7.apps.googleusercontent.com',
    expoClientId: '367382106570-ekh9rif5d6hacl7gruusjlcs8icnhhb7.apps.googleusercontent.com',
    androidClientId: '367382106570-uqcbvm5jfcddk75990hb3av8i5dluap5.apps.googleusercontent.com',
    iosClientId: '367382106570-gfcgfuf29dffkdgem3m9d6aqf3hbr0aj.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [response])

  const signInWithGoogle = async () => {
    setLoading(true);
    promptAsync({ useProxy: false, showInRecents: true });
  };

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
      }}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}