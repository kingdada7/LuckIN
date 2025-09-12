import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfilePhotoUpload from "../../components/ProfilePhotoUpload";
import { useContext, useState } from "react";
import { validateEmail } from "@/utils/helper";
import { Link, useNavigate } from "react-router";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance.js";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadimage.js";
export default function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [fullname, setFullname] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);


  //handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (!fullname) {
      setError("Full name is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    //sign api call
    try {
      //upload profile image
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        name: fullname,
        profileImageUrl,

        adminInviteToken,
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        //redirect base on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Card className=" grid grid-cols-1 gap-4">
        <CardHeader className="text-center">
          <CardTitle>Sign Up for an account</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-6">
            <ProfilePhotoUpload
              image={profilePic}
              setImage={setProfilePic}
              className="p-4"
            />

            {/* Grid layout for inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  value={fullname}
                  type="text"
                  placeholder="John Doe"
                  required
                  onChange={({target}) => setFullname(target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={({target}) => setEmail(target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  value={password}
                  type="password"
                  required
                  onChange={({target}) => setPassword(target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin-token">Admin Invite Token</Label>
                <Input
                  
                  type="text"
                  value={adminInviteToken}
                  placeholder="6-digit token"
                 
                  onChange={({target}) => setAdminInviteToken(target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
          <CardAction className="flex items-center ">
            <p>Already have an account? </p>
            <Button variant="link">
              <Link to="/login"> Login</Link>
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
