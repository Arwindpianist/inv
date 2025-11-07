/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mycelium-inv/ui", "@mycelium-inv/styles", "@mycelium-inv/db", "@mycelium-inv/utils"],
};

module.exports = nextConfig;

