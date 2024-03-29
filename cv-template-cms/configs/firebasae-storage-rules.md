```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow read access to all users
      allow read;

      // Allow write access only to authenticated users for images and PDFs
      allow write: if request.auth != null &&
        (request.resource.contentType.matches('image/.*') ||
        request.resource.contentType.matches('application/pdf'));
    }
  }
}

```