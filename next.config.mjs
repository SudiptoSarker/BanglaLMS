import BuilderDevTools from "@builder.io/dev-tools/next";

/** @type {import('next').NextConfig} */
const nextConfig = BuilderDevTools()(
  BuilderDevTools()(
    BuilderDevTools()({
      reactStrictMode: true,
      async redirects() {
        return [
          {
            source: "/planner",
            destination: "/planner/login",
            permanent: true,
          },
          {
            // this will match `/english(default)/something` being requested
            source: "/mopita/register",
            destination: "/api/mopita/register",
            permanent: true,
          },
        ];
      },
    })
  )
);

export default nextConfig;
