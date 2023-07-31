import { CapacitorConfig } from "@capacitor/cli";

export default {
  appId: "pakut2.loseyourip.com",
  appName: "Closer",
  webDir: "dist/closer",
  server: {
    url: process.env["ANGULAR_APP_LOCAL_URL"],
    cleartext: true
  }
} satisfies CapacitorConfig;
