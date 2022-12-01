(function() {
	var seated = false;
	var seater = Uuid.NULL;

	function sit(entityID) {
		Entities.editEntity(entityID, {
			color: {
				red: 0,
				green: 255,
				blue: 0
			}
		});
		MyAvatar.beginSit(Entities.localToWorldPosition(Vec3.ZERO, entityID), Quat.cancelOutRoll(Quat.getFront(this.orientation)));
		seated = true;
		seater = MyAvatar.sessionUUID;
	};

	function unsit(entityID) {
		Entities.editEntity(entityID, {
			color: {
				red: 255,
				green: 0,
				blue: 0
			}
		});
		MyAvatar.endSit(Entities.localToWorldPosition(Vec3.ZERO, entityID), Quat.cancelOutRoll(Quat.getFront(this.orientation)));
		seated = false;
		seater = Uuid.NULL;
	};

	function trySit(entityID) {
		var dist = Vec3.distance(Vec3.ZERO, Entities.worldToLocalPosition(Entities.localToWorldPosition(Vec3.ZERO, MyAvatar.sessionUUID), entityID));
		if (Entities.getEntityProperties(entityId).color !== {red: 255, green: 0, blue: 0}) return;
		if (dist > 25) return;
		if (seated != MyAvatar.isSeated() || ((seated && MyAvatar.isSeated()) && seater !== MyAvatar.sessionUUID))
			return;

		if (seated) {
			unsit(entityID);
		} else {
			sit(entityID);
		}
	}

	this.preload = function(entityID) {
		seated = false;
		seater = 0;
		Entities.editEntity(entityID, {
			color: {
				red: 255,
				green: 0,
				blue: 0
			}
		});
	};

	this.unload = function(entityID) {
		if (seater === MyAvatar.sessionUUID) {
			unsit(entityID);
			seated = false;
			seater = 0;
		}
		Entities.editEntity(entityID, {
			color: {
				red: 255,
				green: 0,
				blue: 0
			}
		});
	};

	this.mousePressOnEntity = function(entityID, mouseEvent) {
		trySit(entityID);
	};
});