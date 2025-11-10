import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone output for Docker
  // Add your other config here
}

module.exports = nextConfig

export default nextConfig;
