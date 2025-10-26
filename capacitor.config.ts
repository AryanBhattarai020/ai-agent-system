import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ai.agent',
  appName: 'AI Agent',
  webDir: 'public',
  server: {
    androidScheme: 'http',
    allowNavigation: ['*'],
    cleartext: true,
    // For connecting to your local backend during development
    // Change this to your computer's local IP address
    url: undefined // Set to 'http://YOUR_LOCAL_IP:3000' for dev testing
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0b0f14',
      showSpinner: false
    }
  }
};

export default config;
