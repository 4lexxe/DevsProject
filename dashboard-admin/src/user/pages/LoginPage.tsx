import LoginForm from "../components/login/LoginForm";
import { Github, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Login to your account</h2>
          <p className="text-gray-400">Enter your username to login to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
          <LoginForm />
          
          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
