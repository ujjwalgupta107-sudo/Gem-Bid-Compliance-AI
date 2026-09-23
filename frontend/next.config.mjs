/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In production (single-container deploy), the backend runs on an internal
    // port that isn't publicly exposed. The browser calls same-origin `/api/*`
    // and Next.js proxies it server-side to FastAPI on localhost.
    // Must match the Dockerfile's BACKEND_PORT exactly.
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8811/:path*",
      },
    ];
  },
};

export default nextConfig;
