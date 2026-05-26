"use client";

import { FaGoogle, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AUTH_PROVIDERS } from "../config/authProviders";
import { appConfig } from "@/config/app";

export default function AuthProviderButtons({ className = "" }: { className?: string }) {
  const onClick = (provider: string) => {
    if (!AUTH_PROVIDERS[provider as keyof typeof AUTH_PROVIDERS]) {
      alert('Provider disabled');
      return;
    }
    window.location.href = `${appConfig.apiUrl}/auth/oauth/${provider}`;
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {AUTH_PROVIDERS.google && (
        <button
          onClick={() => onClick("google")}
          className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium"
        >
          <FaGoogle className="text-lg" />
          Continue with Google
        </button>
      )}

      {AUTH_PROVIDERS.facebook && (
        <button
          onClick={() => onClick("facebook")}
          className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium"
        >
          <FaFacebook className="text-lg text-blue-600" />
          Continue with Facebook
        </button>
      )}

      {AUTH_PROVIDERS.x && (
        <button
          onClick={() => onClick("x")}
          className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium"
        >
          <FaXTwitter className="text-lg text-black" />
          Continue with X
        </button>
      )}
    </div>
  );
}
