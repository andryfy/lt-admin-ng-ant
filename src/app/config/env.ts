export const ENV = {
  PROJECT_CODENAME: 'lt-admin',
  PROJECT_NAME: 'LT Admin',

  // LOCAL
  local: {
    API_URL: 'http://localhost:3000/v1'
  },

  // DEVELOPMENT
  dev: {
    API_URL: 'http://localhost:3000/v1'
  },

  // PRODUCTION
  prod: {
    API_URL: 'http://localhost:3000/v1'
  },

  TOKEN_HEADER_KEY: 'x-access-token' // for Node.js Express back-end
  // TOKEN_HEADER_KEY: 'Authorization', // for Spring Boot / PHP back-end
};
