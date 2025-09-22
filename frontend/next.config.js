const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  rewrites: () => {
    return [
      {
        source: "/api/:path*",
        // Docker 환경에서는 server로 변경 필요
        destination:
          process.env.NODE_ENV === "production"
            ? "http://server:8080/api/:path*"
            : "http://0.0.0.0:8080/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photo-look-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**", // 모든 경로 허용으로 변경
      },
    ],
  },
};

module.exports = nextConfig;
