(function () {
  angular.module('ShopSphereApp').service('StudioService', ['StateService', function (StateService) {
    var LOOKS_KEY = 'shopsphere_saved_looks';
    var DRAFT_KEY = 'shopsphere_studio_draft';
    var service = this;

    service.getDraft = function () {
      return StateService.get(DRAFT_KEY, {
        title: 'Untitled Look',
        mood: 'Street Luxe',
        background: 'sunset-grid',
        items: []
      });
    };

    service.saveDraft = function (draft) {
      StateService.set(DRAFT_KEY, draft);
      return draft;
    };

    service.getSavedLooks = function () {
      return StateService.get(LOOKS_KEY, []);
    };

    service.saveLook = function (draft) {
      var looks = service.getSavedLooks();
      looks.unshift({
        id: Date.now(),
        title: draft.title,
        mood: draft.mood,
        background: draft.background,
        items: angular.copy(draft.items),
        created_at: new Date().toISOString()
      });
      StateService.set(LOOKS_KEY, looks.slice(0, 12));
      return looks;
    };

    service.deleteLook = function (lookId) {
      var looks = service.getSavedLooks().filter(function (look) {
        return look.id !== lookId;
      });
      StateService.set(LOOKS_KEY, looks);
      return looks;
    };
  }]);
}());
