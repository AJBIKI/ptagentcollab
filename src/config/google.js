import { google } from "googleapis";
import env from "./env.js";

const oauth2Client = new google.auth.OAuth2(
  env.google.clientId,
  env.google.clientSecret,
  env.google.redirectUri
);

oauth2Client.setCredentials({ refresh_token: env.google.refreshToken });

export default oauth2Client;
