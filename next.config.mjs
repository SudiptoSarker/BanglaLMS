import BuilderDevTools from "@builder.io/dev-tools/next";

/** @type {import('next').NextConfig} */
const nextConfig = BuilderDevTools()(
  BuilderDevTools()(
    BuilderDevTools()({
      reactStrictMode: true,
    })
  )
);

export default nextConfig;
