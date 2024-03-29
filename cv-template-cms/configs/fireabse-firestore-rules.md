```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allow anyone to read the 'data' document
    match /profile/data {
      allow read: if true;

      // Only authenticated users can write to the 'data' document
      allow write: if request.auth != null;

      // Validate the structure of the 'data' document
      allow create, update: if  isValidPersonalInformation() && 
                                isValidEducation() && 
                              	isValidReferences() && 
                                isValidGeneral() && 
                                isValidWorkHistory() && 
                                isValidProjects() && 
                                isValidLanguages() && 
                                isValidAwards() &&
                                isValidSkills();

      // Validate the fields in the 'personalInformation' object
      function isValidPersonalInformation() {
        let pi = request.resource.data.personalInformation;
        return !('personalInformation' in request.resource.data) ||
          (pi is map &&
          ('fullName' in pi && pi.fullName is string) &&
          ('hide' in pi && pi.hide is bool) &&
          ('emailAddress' in pi && pi.emailAddress is string) &&
          ('profileImage' in pi && pi.profileImage is string) &&
          ('address' in pi && pi.address is string) &&
          ('socials' in pi && pi.socials is list) &&
          ('contactNumber' in pi && pi.contactNumber is string) &&
          ('bio' in pi && pi.bio is string));
      }

      // Validate the fields in the 'education' object
      function isValidEducation() {
        let education = request.resource.data.education;
        return !('education' in request.resource.data) ||
          (education is map &&
          ('items' in education && education.items is list));
      }

      // Validate the fields in the 'references' object
      function isValidReferences() {
        let references = request.resource.data.references;
        return !('references' in request.resource.data) ||
          (references is map &&
          ('items' in references && references.items is list));
      }

      // Validate the fields in the 'general' object
      function isValidGeneral() {
        let general = request.resource.data.general;
        return !('general' in request.resource.data) ||
          (general is map &&
          ('favicon' in general && general.favicon is string) &&
          ('pageTitle' in general && general.pageTitle is string) &&
          ('accentColor' in general && general.accentColor is string));
      }

      // Validate the fields in the 'workHistory' object
      function isValidWorkHistory() {
        let workHistory = request.resource.data.workHistory;
        return !('workHistory' in request.resource.data) ||
          (workHistory is map &&
          ('items' in workHistory && workHistory.items is list));
      }

      // Validate the fields in the 'projects' object
      function isValidProjects() {
        let projects = request.resource.data.projects;
        return !('projects' in request.resource.data) ||
          (projects is map &&
          ('items' in projects && projects.items is list));
      }
      
      // Validate the fields in the 'awards' object
      function isValidAwards() {
        let awards = request.resource.data.awards;
        return !('awards' in request.resource.data) ||
          (awards is map &&
          ('items' in awards && awards.items is list));
      }

      // Validate the fields in the 'languages' object
      function isValidLanguages() {
        let languages = request.resource.data.languages;
        return !('languages' in request.resource.data) ||
          (languages is map &&
          ('items' in languages && languages.items is list) &&
          ('hide' in languages && languages.hide is bool));
      }

      // Validate the fields in the 'skills' object
      function isValidSkills() {
        let skills = request.resource.data.skills;
        return !('skills' in request.resource.data) ||
          (skills is map &&
          ('items' in skills && skills.items is list));
      }
    }
  }
}

```