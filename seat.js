(function () {
  var seated = false;
  var seater = 0;
  this.clickDownOnEntity = function (entityID, mouseEvent) {
  	var dist = Vec3.distance(MyAvatar.position, Entities.getEntityProperties(entityID).position);
  	if (dist > 1) return;
  	if (seated != MyAvatar.isSeated() || ((seated && MyAvatar.isSeated()) && seater != MyAvatar.sessionUUID)) return;
    if (seated) {
      Entities.editEntity(entityID, { color: { red: 255, green: 0, blue: 0 } });
      MyAvatar.endSit(
        Entities.localToWorldPosition(this.position, entityID),
        Quat.cancelOutRoll(Quat.getFront(this.orientation))
      );
      seated = false;
      seater = 0;
    } else {
      Entities.editEntity(entityID, { color: { red: 0, green: 255, blue: 0 } });
      MyAvatar.beginSit(
        Entities.localToWorldPosition(this.position, entityID),
        Quat.cancelOutRoll(Quat.getFront(this.orientation))
      );
      seated = true;
      seater = MyAvatar.sessionUUID;
    }
  };
});
