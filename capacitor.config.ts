import { CapacitorConfig } from "@capacitor/cli";

export default {
  appId: "pakut2.loseyourip.com",
  appName: "Closer",
  webDir: "dist/closer",
  server: {
    url: process.env["NG_APP_LOCAL_URL"],
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
} satisfies CapacitorConfig;
