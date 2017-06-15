{
  type: "service_account",
  project_id: "political-post-analysis",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: `-----BEGIN PRIVATE KEY-----\n${ process.env.FIREBASE_PRIVATE_KEY }\n-----END PRIVATE KEY-----\n`,
  client_email: "firebase-adminsdk-rdi0e@political-post-analysis.iam.gserviceaccount.com",
  client_id: "116840941950157463704",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://accounts.google.com/o/oauth2/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rdi0e%40political-post-analysis.iam.gserviceaccount.com"
}
