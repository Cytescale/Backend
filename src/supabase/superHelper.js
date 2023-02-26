"use strict";
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

function MRepsonse(responseData, errorBool, errorMessage) {
  if (errorBool) {
    return {
      errorBool: errorBool,
      errorMessage: errorMessage,
      response: null,
    };
  } else {
    return {
      errorBool: false,
      errorMessage: null,
      response: responseData,
    };
  }
}

class SupaHelper {
  constructor() {
    this.client = createClient(
      process.env.SUPABASE_CLIENT,
      process.env.SUPABASE_API_KEY
    );
    if (this.client) {
      console.log("✔️ Supabase client initialised");
    }
  }

  getClient() {
    return this.client;
  }

  async signInFunc(email, pass) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email,
        password: pass,
      });
      if (error) throw error;
      return MRepsonse(data, false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async signUpFunc(email, pass) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: email,
        password: pass,
      });
      if (error) throw error;
      return MRepsonse(data, false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

}

module.exports = { SupaHelper, MRepsonse };
