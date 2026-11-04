# Jayaxis Company Ltd website 

## Grant admin access

The admin page requires the Firebase custom claim `admin: true`. First create `jayaxiscompany@gmail.com` in Firebase Authentication with Email/Password enabled. Download a service-account key from Firebase Console **Project settings > Service accounts** and store it outside this repository.

Set `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in `.env.local`, then run this in PowerShell, replacing the path with the secure location of the downloaded key:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\secure\firebase-admin.json"
npm run admin:set-claim
```

The command preserves existing custom claims and grants `admin: true` to `jayaxiscompany@gmail.com`. Never commit or share the service-account key. The administrator must sign out and sign back in to refresh the Firebase ID token.

## Firebase image uploads

Product, project, and news images are uploaded to Firebase Storage. The Storage rules make those images publicly readable by the website, while uploads and deletion require the `admin: true` claim. Deploy the rules after selecting the Firebase project:

```powershell
firebase deploy --only storage --project jay-axis
```

Uploads accept JPEG, PNG, WebP, GIF, and AVIF files up to 10 MB. Each new image URL is saved with the product, project, or news record when its form is submitted.


