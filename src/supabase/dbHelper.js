require("dotenv").config();
const { MRepsonse } = require("./superHelper");
const {
  setRecord,
  recordDataByTxn,
} = require("../blockchain/transactionHelper");
const USER_TABLE = "user_table";
const RECORD_TABLE = "user_records_table";
const RELATION_TABLE = "relation_table";

class DBHelper {
  constructor(supaClient) {
    if (!supaClient) {
      console.error("No Supa client for dbhelper");
    }
    this.supaClient = supaClient;
  }

  async getRecordbyRID(rid) {
    try {
      if (!rid) throw "RID is not provided";
      const { data, error } = await this.supaClient
        .from(RECORD_TABLE)
        .select()
        .eq("id", rid);
      if (error || !data) throw error ? error : "Some error occurred";
      if (data.length == 0) throw "No such records found";
      const chain_record_data = await recordDataByTxn(data.txn_hash);
      if (chain_record_data.errorBool) throw chain_record_data.errorMessage;
      return MRepsonse(chain_record_data.response, false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async getBaseRecord(rid) {
    try {
      if (!rid) throw "RID is not provided";
      const { data, error } = await this.supaClient
        .from(RECORD_TABLE)
        .select()
        .eq("id", rid);
      if (error || !data) throw error ? error : "Some error occurred";
      if (data.length == 0) throw "No such records found";
      if (data) return MRepsonse(data[0], false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async createBaseRecord(
    creator_uid,
    patient_uid,
    treat_id,
    med_arr,
    share_arr
  ) {
    try {
      if (!creator_uid || !patient_uid || !treat_id || !med_arr || !share_arr)
        throw "Insufficient data";
      const txn_rcpt = await setRecord(
        creator_uid,
        patient_uid,
        treat_id,
        med_arr
      );
      if (txn_rcpt.errorBool) throw txn_rcpt.errorMessage;
      if (!txn_rcpt.response.hash)
        throw "Error occurred on blockchain while creating transaction";
      const txn_hash = txn_rcpt.response.hash;
      const record_id = Math.floor(Math.random() * 10000000000);
      const { data, error } = await this.supaClient
        .from(RECORD_TABLE)
        .insert({
          id: record_id,
          creator_uid: creator_uid,
          patient_uid: patient_uid,
          treat_id: treat_id,
          med_arr: med_arr,
          txn_hash: txn_hash,
        })
        .select();
      if (error || !data) throw error ? error : "Some error occurred";
      if (data) return MRepsonse(data[0], false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async getUserData(uid) {
    try {
      if (!uid) throw "UID absent";
      const { data, error } = await this.supaClient
        .from(USER_TABLE)
        .select()
        .eq("uid", uid);
      if (error || !data) throw error ? error : "Some error occurred";
      if (data.length == 0) throw "No such records found";
      if (data) return MRepsonse(data[0], false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async updateUser(
    uid,
    fname,
    lname,
    account_type,
    profile_photo_url,
    initiated
  ) {
    try {
      if (!uid) throw "Insufficient Data";
      let update_object = {};
      if (fname) Object.assign(update_object, { fname: fname });
      if (lname) Object.assign(update_object, { lname: lname });
      if (initiated) Object.assign(update_object, { initiated: initiated });
      if (account_type)
        Object.assign(update_object, { account_type: account_type });
      if (profile_photo_url)
        Object.assign(update_object, { profile_photo_url: profile_photo_url });
      if (Object.keys(update_object).length < 1) throw "Not enough arguments";

      const { data, error } = await this.supaClient
        .from(USER_TABLE)
        .update(update_object)
        .eq("uid", uid)
        .select();
      if (error || !data) throw error ? error : "Some error occurred";
      if (data) return MRepsonse(data[0], false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async ifUserExist(uid) {
    try {
      if (!uid) throw "Insufficient Data";
      const { data, error } = await this.supaClient
        .from(USER_TABLE)
        .select()
        .eq("uid", uid);
      if (error || !data) throw error ? error : "Some error occurred";
      if (data.length == 0) return MRepsonse(false, false, null);
      if (data.length > 0) return MRepsonse(true, false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async createBaseUser(uid, account_type) {
    try {
      if (!uid || !Number.isInteger(account_type))
        throw "Insufficient Data for user creation";
      const exist_bool = await this.ifUserExist(uid);
      if (exist_bool.errorBool) throw res.errorMessage;
      if (exist_bool.response == true) throw "User Already exist";
      const now = new Date();
      const { data, error } = await this.supaClient
        .from(USER_TABLE)
        .insert({
          uid: uid,
          account_type: account_type,
          initiated: false,
          updated_at: now,
        })
        .select();
      if (error || !data) throw error ? error : "Some error occurred";
      if (data) return MRepsonse(data[0], false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async getRecordsbyPID(uid) {
    try {
      if (!uid) throw "Insufficient patient id";
      const { data, error } = await this.supaClient
        .from(RECORD_TABLE)
        .select()
        .eq("patient_uid", uid);
      if (error || !data) throw error ? error : "Some error occurred";
      if (data.length == 0) throw "No such records found";
      if (data) return MRepsonse(data, false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async ifRelationExist(did, pid) {
    try {
      if (!pid || !did) throw "Insufficient data";
      const { data, error } = await this.supaClient
        .from(RELATION_TABLE)
        .select()
        .match({ doctor_uid: did, patient_uid: pid });
      if (error || !data) throw error ? error : "Some error occurred";
      if (data.length == 0) return MRepsonse(false, false, null);
      if (data.length > 0) return MRepsonse(true, false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async createRelation(pid, did) {
    try {
      if (!pid || !did) throw "Insufficient data";
      const res = await this.ifRelationExist(did, pid);
      if (res.errorBool) throw res.errorMessage;
      if (res.response == true) throw "Already exist";
      const { data, error } = await this.supaClient
        .from(RELATION_TABLE)
        .insert({
          doctor_uid: did,
          patient_uid: pid,
        })
        .select();
      if (error || !data) throw error ? error : "Some error occurred";
      if (data) return MRepsonse(data[0], false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }

  async getRelationsByDid(did) {
    try {
      if (!did) throw "Insufficient data";
      const { data, error } = await this.supaClient
        .from(RELATION_TABLE)
        .select()
        .eq("doctor_uid", did);
      if (error || !data) throw error ? error : "Some error occurred";
      if (data.length < 1) throw "No records found";
      if (data) return MRepsonse(data, false, null);
    } catch (e) {
      return MRepsonse(null, true, e);
    }
  }
}

module.exports = { DBHelper };
