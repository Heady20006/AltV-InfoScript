import { Player, Vector3 } from "alt-client";
import * as native from "natives";
class Raycast {
    static line(scale, flags, ignoreEntity) {
        this.rayCastFlag = flags;
        let playerForwardVector = native.getEntityForwardVector(this.player.scriptID);
        playerForwardVector = new Vector3(playerForwardVector.x * scale, playerForwardVector.y * scale, playerForwardVector.z * scale);
        let targetPos = this.getTargetPos(this.player.pos, playerForwardVector);
        native.drawLine(this.player.pos.x, this.player.pos.y, this.player.pos.z, targetPos.x, targetPos.y, targetPos.z - 1.5, 255, 0, 0, 255);
        let ray = native.startExpensiveSynchronousShapeTestLosProbe(this.player.pos.x, this.player.pos.y, this.player.pos.z, targetPos.x, targetPos.y, targetPos.z - 1.5, flags, ignoreEntity, 4);
        return this.result(ray);
    }
    static getTargetPos(entityVector, forwardVector) {
        return new Vector3(entityVector.x + forwardVector.x, entityVector.y + forwardVector.y, entityVector.z + forwardVector.z);
    }
    static result(ray) {
        let result = native.getShapeTestResultIncludingMaterial(ray, undefined, undefined, undefined, undefined, undefined);
        let hitEntity = result[5];
        if (this.rayCastFlag === 1) {
            return {
                isHit: result[1],
                pos: new Vector3(result[2].x, result[2].y, result[2].z),
                hitEntity,
                entityType: native.getEntityType(hitEntity),
                entityHash: result[4],
                entityMaterial: result[4],
            };
        }
        else {
            return {
                isHit: result[1],
                pos: new Vector3(result[2].x, result[2].y, result[2].z),
                hitEntity,
                entityType: native.getEntityType(hitEntity),
                entityHash: native.getEntityModel(hitEntity),
                entityMaterial: result[4],
            };
        }
    }
}
Raycast.player = Player.local;
export default Raycast;
