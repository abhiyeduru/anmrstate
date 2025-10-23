/**
 * Usage:
 *  node scripts/set-admin-claim.js <uid> [true|false]
 *
 * Requires a Firebase service account JSON file pointed at by GOOGLE_APPLICATION_CREDENTIALS
 * or set the path below.
 *
 * This script sets the custom claim `admin: true` (or false) on the specified user.
 */

const admin = require('firebase-admin');
const uid = process.argv[2];
const flag = process.argv[3] || 'true';

if (!uid) {
  console.error('Usage: node scripts/set-admin-claim.js <uid> [true|false]');
  process.exit(1);
}

if (!admin.apps.length) {
  // Initialize using GOOGLE_APPLICATION_CREDENTIALS env var or default application creds
  try {
    admin.initializeApp();
  } catch (e) {
    console.error('Failed to initialize firebase-admin. Make sure GOOGLE_APPLICATION_CREDENTIALS is set to a service account JSON file.');
    console.error(e);
    process.exit(1);
  }
}

const isAdmin = flag === 'true' || flag === '1' || flag === 'yes';

admin.auth().setCustomUserClaims(uid, { admin: isAdmin })
  .then(() => {
    console.log(`Set admin=${isAdmin} for uid=${uid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to set custom claim:', err);
    process.exit(1);
  });
