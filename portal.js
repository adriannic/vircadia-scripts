(function() {
    var TELEPORT_SOUND_VOLUME = 0.40;

    var teleportSound;
    var portalDestination;
    var position;
    var canTeleport;

    function playSound(entityID) {
        if (teleportSound.downloaded) {
            if (!position) {
                getProps(entityID);
            }
            Audio.playSound(teleportSound, { position: position, volume: TELEPORT_SOUND_VOLUME, localOnly: true });
        }
    }

    function getProps(entityID) {
        var properties = Entities.getEntityProperties(entityID);
        if (properties) {
            position = properties.position;
            portalDestination = properties.userData;
        }
    }

    function isPositionInsideBox(position, boxProperties) {
        var localPosition = Vec3.multiplyQbyV(Quat.inverse(boxProperties.rotation),
            Vec3.subtract(MyAvatar.position, boxProperties.position));
        var halfDimensions = Vec3.multiply(boxProperties.dimensions, 0.5);
        return -halfDimensions.x <= localPosition.x &&
            halfDimensions.x >= localPosition.x &&
            -halfDimensions.y <= localPosition.y &&
            halfDimensions.y >= localPosition.y &&
            -halfDimensions.z <= localPosition.z &&
            halfDimensions.z >= localPosition.z;
    }

    this.preload = function(entityID) {
        print("loading teleport script");
        teleportSound = SoundCache.getSound("http://s3.amazonaws.com/hifi-public/birarda/teleport.raw");
        getProps(entityID);
        // check if we are already in the object
        canTeleport = !isPositionInsideBox(MyAvatar.position, Entities.getEntityProperties(entityID));
    };

    this.enterEntity = function(entityID) {
    	print("Entity entered portal")
        // check if we should teleport
        if (canTeleport === false) {
            // if we have not passed enough time, do not teleport the user
            return;
        }
        // get latest props in case we changed the destination
        getProps(entityID);

        if (portalDestination.length > 0) {
        	print("Teleporting!");
            playSound(entityID);
            Window.location = portalDestination;
        }

    };

    this.leaveEntity = function(entityID) {
    	print("Entity left portal");
        // we can set canTeleport to true since they are not in the teleporter anymore
        canTeleport = true;
    };
});
