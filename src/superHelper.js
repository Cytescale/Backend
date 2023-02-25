"use strict";
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
      "https://aijtgodqwbhnsezitung.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpanRnb2Rxd2JobnNleml0dW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUwODc4NTMsImV4cCI6MTk5MDY2Mzg1M30.KOQuMklW0aqN_EqOOVppNCldg11TFgu9wd1xYZmPmks"
    );
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

  async createUserDoctor() {}

  async createUserPatient() {}
}

module.exports = { SupaHelper, MRepsonse };
