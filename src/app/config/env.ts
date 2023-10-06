export const ENV = {
  PROJECT_CODENAME: 'lt-admin',
  PROJECT_NAME: 'LT Admin',

  TOKEN_PREFIX: 'Bearer',
  TOKEN_HEADER_KEY: 'Authorization', // for Spring Boot / PHP back-end
  // const TOKEN_HEADER_KEY = 'x-access-token';    // for Node.js Express back-end

  // LOCAL
  local: {
    API_URL: 'https://fakestoreapi.com'
  },

  // DEVELOPMENT
  dev: {
    API_URL: 'https://fakestoreapi.com'
  },

  // PRODUCTION
  prod: {
    API_URL: 'https://fakestoreapi.com'
  },

  user: {
    EXP_KEY: 'UserExp',
    USER_KEY: 'UserUK', // Current user connected
    TOKEN_KEY: 'UserTK'
  }
};
