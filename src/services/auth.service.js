"use strict";

class AuthService {
  static login = async (test) => {
    return {
      user: test,
    };
  };
}

export default AuthService;
