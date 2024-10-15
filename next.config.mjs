import BuilderDevTools from "@builder.io/dev-tools/next";

/** @type {import('next').NextConfig} */
const nextConfig = BuilderDevTools()(
  BuilderDevTools()(
    BuilderDevTools()({
      reactStrictMode: true,
       async redirects() {
        return [
          {
              // this will match `/english(default)/something` being requested
              source: '/mopita/register',
              destination: '/api/mopita/register',
              permanent: true,
            },
            {
              // this will match `/english(default)/something` being requested
              source: '/mopita/release',
              destination: '/api/mopita/release',
              permanent: true,
            },
        ];
      },
    })
  )
);

export default nextConfig;
