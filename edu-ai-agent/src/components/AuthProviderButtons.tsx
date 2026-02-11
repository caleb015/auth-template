"use client";

import { FaGoogle, FaFacebook, FaTwitter, FaXTwitter } from "react-icons/fa6";
import { AUTH_PROVIDERS } from "../config/authProviders";

export default function AuthProviderButtons({ className = "" }: { className?: string }) {
  const onClick = (provider: string) => {
    // Placeholder action — real OAuth integration to be implemented later
    // Keeping simple for Phase 1 static prototype
    // eslint-disable-next-line no-console
    console.log(`Auth placeholder clicked: ${provider}`);
    alert(`Auth placeholder: ${provider}`);
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

      {AUTH_PROVIDERS.twitter && (
        <button
          onClick={() => onClick("twitter")}
          className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 font-medium"
        >
          <FaTwitter className="text-lg text-sky-500" />
          Continue with Twitter
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
