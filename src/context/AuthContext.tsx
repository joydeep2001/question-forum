import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the context type
interface AuthContextType {
  isLoggedIn: boolean;
  profile: Profile | null
}

type Profile = {
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  sid: string;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile|null>(null);

  useEffect(() => {
    // Function to check auth status by hitting the API
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.status === 200) {
          setIsLoggedIn(true); // User is logged in
          setProfile(await response.json());
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setIsLoggedIn(false); // Handle error as not logged in
      }
    };

    checkAuthStatus(); // Call the function on component mount
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <AuthContext.Provider value={{ isLoggedIn, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
