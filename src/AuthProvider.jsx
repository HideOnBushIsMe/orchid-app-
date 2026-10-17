import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

// List of Admin emails or roles
const ADMIN_EMAILS = ["admin@orchid.com", "admin@gmail.com", "bangnmse123456@fpt.edu.vn"];

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user_session") || localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Google Login implementation
  // Supports login as Member or Admin (convenient for student grading & testing)
  const loginWithGoogle = (type = "member") => {
    let mockProfile;
    if (type === "admin") {
      mockProfile = {
        id: "admin_01",
        name: "Admin Manager",
        email: "admin@orchid.com",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin",
        role: "admin",
        phone: "0909999888",
        bio: "System Administrator - Orchid Management"
      };
    } else {
      mockProfile = {
        id: "student_01",
        name: "Minh Bằng",
        email: "student@gmail.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinhBang",
        role: "member",
        phone: "0912345678",
        bio: "QA Fresher & Orchid Enthusiast"
      };
    }

    setUser(mockProfile);
    localStorage.setItem("user_session", JSON.stringify(mockProfile));
    toast.success(`Signed in as ${mockProfile.name} (${mockProfile.role.toUpperCase()})`);
  };

  // Allow members to edit their own profile
  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("user_session", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully!");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_session");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, updateProfile, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}
