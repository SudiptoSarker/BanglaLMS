import BuilderDevTools from "@builder.io/dev-tools/next";

/** @type {import('next').NextConfig} */
const nextConfig = BuilderDevTools()(
  BuilderDevTools()(
    BuilderDevTools()({
      reactStrictMode: true,
      async redirects() {
        return [
          {
            source: "/mopita/register",
            destination: "/api/mopita/register",
            permanent: true,
          },
          {
            source: "/mopita/release",
            destination: "/api/mopita/release",
            permanent: true,
          },
        ];
      },
    })
  )
);

export default nextConfig;
