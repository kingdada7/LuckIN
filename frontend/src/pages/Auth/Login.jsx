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
import { useState,useContext } from "react";
import { Link, useNavigate, } from "react-router";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { UserContext } from "../../context/userContext.jsx";


// import { validateEmail } from "../../utils/helper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
 
const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  //handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    // login api call
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login API response:", response.data);
      
      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        // update user context
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
      <Card className="w-full  max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Login to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="min. 6 characters"
                  onChange={({ target }) => setPassword(target.value)}
                  value={password}
                  required
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full mt-4">
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>

        <div className="flex justify-center">
          <CardAction className="flex items-center ">
            <p>Don't have an account? </p>
            <Button variant="link">
              <Link to="/signup"> Sign Up</Link>
            </Button>
          </CardAction>
        </div>
      </Card>
    </div>
  );
}
