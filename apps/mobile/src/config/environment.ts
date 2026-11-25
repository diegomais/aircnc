import * as Updates from 'expo-updates';

const herokuURL = 'https://diegomais-aircnc.herokuapp.com';

const ENV = {
  dev: { envName: 'DEVELOPMENT', apiURL: 'http://localhost:3333' },
  prod: { envName: 'PRODUCTION', apiURL: herokuURL },
  staging: { envName: 'STAGING', apiURL: herokuURL },
};

export function getConfig() {
  const channel = Updates.channel;

  if (__DEV__ || channel == null) {
    return ENV.dev;
  }

  if (channel.startsWith('staging')) {
    return ENV.staging;
  }

  return ENV.prod;
}
