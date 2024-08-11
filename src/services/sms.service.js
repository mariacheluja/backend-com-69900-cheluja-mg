import twilio from "twilio";
import { config } from "../config/config.js";

class SmsService {
  constructor() {
    this.client = twilio(config.sms.accountSid, config.sms.authToken);
  }

  async sendSms(to, message) {
    const info = await this.client.messages.create({
      from: config.sms.phoneNumber,
      to,
      body: message,
    });

    console.log(info);
  }
}

export const smsService = new SmsService();
