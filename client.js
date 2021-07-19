import * as alt from "alt-client";
import * as game from "natives";
import { props as PropList } from "./includes/props";
import { vehicles as VehicleList } from "./includes/vehicles";
import { textures as TextureList } from "./includes/textures";
import { peds as PedList } from "./includes/peds";
import Raycast from "./includes/raycast";
import { zones } from "./includes/zones";
let InfoBoxes = [];
let convertToRadiants = false;
let speedInMP = false;
var Alignement;
(function (Alignement) {
  Alignement[(Alignement["Center"] = 0)] = "Center";
  Alignement[(Alignement["Left"] = 1)] = "Left";
  Alignement[(Alignement["Right"] = 2)] = "Right";
  Alignement[(Alignement["VerticalTop"] = 0.1)] = "VerticalTop";
  Alignement[(Alignement["VerticalCenter"] = 0.5)] = "VerticalCenter";
  Alignement[(Alignement["VerticalBottom"] = 0.9)] = "VerticalBottom";
  Alignement[(Alignement["HorizontalLeft"] = 0.001)] = "HorizontalLeft";
  Alignement[(Alignement["HorizontalCenter"] = 0.5)] = "HorizontalCenter";
  Alignement[(Alignement["HorizontalRight"] = 0.9)] = "HorizontalRight";
})(Alignement || (Alignement = {}));
class InfoBox {
  constructor(title, color, align) {
    this.Items = [];
    this.Scale = 0.5;
    this.MarginLeft = Alignement.HorizontalLeft;
    this.MarginTop = Alignement.VerticalTop;
    this.Alignement = 1;
    this.Active = true;
    this.Title = title;
    this.Color = color;
    this.Alignement = align;
    InfoBoxes.push(this);
  }
  draw2d(fontType = 4, useOutline = true, useDropShadow = true, layer = 0) {
    game.beginTextCommandDisplayText("STRING");
    game.addTextComponentSubstringPlayerName(this.Title);
    game.setTextFont(fontType);
    game.setTextScale(1, this.Scale);
    game.setTextWrap(0.0, 1.0);
    game.setTextCentre(true);
    game.setTextColour(this.Color.r, this.Color.g, this.Color.b, this.Color.a);
    game.setTextJustification(this.Alignement);
    if (useOutline) {
      game.setTextOutline();
    }
    if (useDropShadow) {
      game.setTextDropShadow();
    }
    game.endTextCommandDisplayText(
      this.MarginLeft,
      this.MarginTop - this.Scale / 10,
      0
    );
    let j = 0;
    this.Items.forEach((item) => {
      game.beginTextCommandDisplayText("STRING");
      game.addTextComponentSubstringPlayerName(item.Title);
      game.setTextFont(fontType);
      game.setTextScale(1, this.Scale);
      game.setTextWrap(0.0, 1.0);
      game.setTextCentre(true);
      game.setTextColour(
        item.Color.r,
        item.Color.g,
        item.Color.b,
        item.Color.a
      );
      game.setTextJustification(this.Alignement);
      if (useOutline) {
        game.setTextOutline();
      }
      if (useDropShadow) {
        game.setTextDropShadow();
      }
      j++;
      game.endTextCommandDisplayText(
        this.MarginLeft,
        this.MarginTop + j * (this.Scale / 20) - this.Scale / 10,
        0
      );
    });
  }
  draw3d(fontType = 4, useOutline = true, useDropShadow = true, layer = 0) {
    game.setDrawOrigin(
      this.Position.x,
      this.Position.y,
      this.Position.z - this.Scale / 6,
      0
    );
    game.beginTextCommandDisplayText("STRING");
    game.addTextComponentSubstringPlayerName(this.Title);
    game.setTextFont(fontType);
    game.setTextScale(1, this.Scale);
    game.setTextWrap(0.0, 1.0);
    game.setTextCentre(true);
    game.setTextColour(this.Color.r, this.Color.g, this.Color.b, this.Color.a);
    game.setTextJustification(this.Alignement);
    if (useOutline) {
      game.setTextOutline();
    }
    if (useDropShadow) {
      game.setTextDropShadow();
    }
    game.endTextCommandDisplayText(0, 0, 0);
    game.clearDrawOrigin();
    let j = 0;
    this.Items.forEach((item) => {
      game.setDrawOrigin(
        this.Position.x,
        this.Position.y,
        this.Position.z + j * (this.Scale / 3) + this.Scale / 9,
        0
      );
      game.beginTextCommandDisplayText("STRING");
      game.addTextComponentSubstringPlayerName(item.Title);
      game.setTextFont(fontType);
      game.setTextScale(1, this.Scale);
      game.setTextWrap(0.0, 1.0);
      game.setTextCentre(true);
      game.setTextColour(
        item.Color.r,
        item.Color.g,
        item.Color.b,
        item.Color.a
      );
      game.setTextJustification(this.Alignement);
      if (useOutline) {
        game.setTextOutline();
      }
      if (useDropShadow) {
        game.setTextDropShadow();
      }
      j++;
      game.endTextCommandDisplayText(0, 0, 0);
      game.clearDrawOrigin();
    });
  }
}
class InfoItem {
  constructor(parent) {
    this.Parent = parent;
    InfoBoxes.find((ib) => ib === parent).Items.push(this);
  }
}
const rayCastFlags = [
  { Flag: 1, Title: "Ground" },
  { Flag: 2, Title: "Vehicle" },
  { Flag: 4, Title: "Ped" },
  { Flag: 16, Title: "Object" },
];
let choosenFlag = 1;
// Player-Information
let PlayerInfo = new InfoBox(
  "Player",
  { r: 255, g: 0, b: 0, a: 255 },
  Alignement.Left
);
PlayerInfo.MarginLeft = Alignement.HorizontalLeft;
PlayerInfo.MarginTop = Alignement.VerticalCenter;
let Xpos = new InfoItem(PlayerInfo);
let Ypos = new InfoItem(PlayerInfo);
let Zpos = new InfoItem(PlayerInfo);
let Heading = new InfoItem(PlayerInfo);
let Health = new InfoItem(PlayerInfo);
let Speed = new InfoItem(PlayerInfo);
let Armor = new InfoItem(PlayerInfo);
Xpos.Color =
  Ypos.Color =
  Zpos.Color =
  Heading.Color =
  Health.Color =
  Speed.Color =
  Armor.Color =
    { r: 200, g: 200, b: 200, a: 255 };
// Vehicle-Information
let VehicleInfo = new InfoBox(
  "Vehicle",
  { r: 255, g: 0, b: 0, a: 255 },
  Alignement.Right
);
VehicleInfo.MarginLeft = Alignement.HorizontalRight;
VehicleInfo.MarginTop = Alignement.VerticalCenter;
let vXpos = new InfoItem(VehicleInfo);
let vYpos = new InfoItem(VehicleInfo);
let vZpos = new InfoItem(VehicleInfo);
let vHeading = new InfoItem(VehicleInfo);
let vSpeed = new InfoItem(VehicleInfo);
let vHealth = new InfoItem(VehicleInfo);
let vPetrolHealth = new InfoItem(VehicleInfo);
vXpos.Color =
  vYpos.Color =
  vZpos.Color =
  vHeading.Color =
  vSpeed.Color =
  vHealth.Color =
  vPetrolHealth.Color =
    { r: 200, g: 200, b: 200, a: 255 };
// Raycast-Information
let RaycastModeInfo = new InfoBox(
  "Raycast-Mode",
  { r: 255, g: 0, b: 0, a: 255 },
  Alignement.Center
);
RaycastModeInfo.MarginLeft = Alignement.HorizontalCenter;
RaycastModeInfo.MarginTop = Alignement.VerticalTop;
let RaycastInfo = new InfoBox(
  "Object",
  { r: 255, g: 0, b: 0, a: 255 },
  Alignement.Left
);
RaycastInfo.MarginLeft = Alignement.HorizontalCenter;
RaycastInfo.MarginTop = Alignement.VerticalTop;
let rXpos = new InfoItem(RaycastInfo);
let rYpos = new InfoItem(RaycastInfo);
let rZpos = new InfoItem(RaycastInfo);
let rHeading = new InfoItem(RaycastInfo);
let rHash = new InfoItem(RaycastInfo);
let rModel = new InfoItem(RaycastInfo);
let rDimensionX = new InfoItem(RaycastInfo);
let rDimensionY = new InfoItem(RaycastInfo);
let rDimensionZ = new InfoItem(RaycastInfo);
rXpos.Color =
  rYpos.Color =
  rZpos.Color =
  rHeading.Color =
  rHash.Color =
  rModel.Color =
  rDimensionX.Color =
  rDimensionY.Color =
  rDimensionZ.Color =
    {
      r: 200,
      g: 200,
      b: 200,
      a: 255,
    };
// Raycast-Information (Ground)
let RaycastInfoGround = new InfoBox(
  "Ground",
  { r: 0, g: 150, b: 150, a: 255 },
  Alignement.Left
);
RaycastInfoGround.MarginLeft = Alignement.HorizontalCenter;
RaycastInfoGround.MarginTop = Alignement.VerticalTop;
let rGroundName = new InfoItem(RaycastInfoGround);
let rGroundHash = new InfoItem(RaycastInfoGround);
rGroundName.Color = rGroundHash.Color = { r: 200, g: 200, b: 200, a: 255 };
// Street-Information
let StreetInfo = new InfoBox(
  "Street",
  { r: 255, g: 0, b: 0, a: 255 },
  Alignement.Center
);
StreetInfo.MarginLeft = Alignement.HorizontalCenter;
StreetInfo.MarginTop = Alignement.VerticalBottom;
let streetZone = new InfoItem(StreetInfo);
let streetName = new InfoItem(StreetInfo);
streetName.Color = streetZone.Color = { r: 200, g: 200, b: 200, a: 255 };
alt.everyTick(() => {
  // Player-Information
  Xpos.Title = `X: ${alt.Player.local.pos.x.toFixed(2)}`;
  Ypos.Title = `Y: ${alt.Player.local.pos.y.toFixed(2)}`;
  Zpos.Title = `Z: ${alt.Player.local.pos.z.toFixed(2)}`;
  let rot = game.getEntityHeading(alt.Player.local.scriptID);
  if (convertToRadiants) {
    rot = convertDegToRad(rot);
    Heading.Title = `Heading(R): ${rot.toFixed(2)}`;
  } else {
    Heading.Title = `Heading(D): ${rot.toFixed(2)}`;
  }
  Health.Title = `Health: ${game.getEntityHealth(alt.Player.local.scriptID)}`;
  if (speedInMP) {
    Speed.Title = `Speed(MP/H): ${(
      game.getEntitySpeed(alt.Player.local.scriptID) * 2.236936
    ).toFixed(2)}`;
  } else {
    Speed.Title = `Speed(KM/H): ${(
      game.getEntitySpeed(alt.Player.local.scriptID) * 3.6
    ).toFixed(2)}`;
  }
  Armor.Title = `Armor: ${game.getPedArmour(alt.Player.local.scriptID)}`;
  PlayerInfo.draw2d();
  // Vehicle-Information
  if (alt.Player.local.vehicle) {
    let o = VehicleList.find(
      (p) => p.Hash == game.getEntityModel(alt.Player.local.vehicle.scriptID)
    );
    VehicleInfo.Title = "Vehicle " + o.DisplayName;
    vXpos.Title = `X: ${alt.Player.local.vehicle.pos.x.toFixed(2)}`;
    vYpos.Title = `Y: ${alt.Player.local.vehicle.pos.y.toFixed(2)}`;
    vZpos.Title = `Z: ${alt.Player.local.vehicle.pos.z.toFixed(2)}`;
    let rot = game.getEntityHeading(alt.Player.local.vehicle.scriptID);
    if (convertToRadiants) {
      rot = convertDegToRad(rot);
      vHeading.Title = `Heading(R): ${rot.toFixed(2)}`;
    } else {
      vHeading.Title = `Heading(D): ${rot.toFixed(2)}`;
    }
    if (speedInMP) {
      vSpeed.Title = `Speed(MP/H): ${(
        game.getEntitySpeed(alt.Player.local.vehicle.scriptID) * 2.236936
      ).toFixed(2)}`;
    } else {
      vSpeed.Title = `Speed(KM/H): ${(
        game.getEntitySpeed(alt.Player.local.vehicle.scriptID) * 3.6
      ).toFixed(2)}`;
    }
    vHealth.Title = `EngineHealth: ${game
      .getVehicleEngineHealth(alt.Player.local.vehicle.scriptID)
      .toFixed(2)}`;
    vPetrolHealth.Title = `PetrolHealth: ${game
      .getVehiclePetrolTankHealth(alt.Player.local.vehicle.scriptID)
      .toFixed(2)}`;
    VehicleInfo.draw2d();
  }
  let modeTitle = rayCastFlags.find((f) => f.Flag === choosenFlag).Title;
  if (choosenFlag === 1) {
    RaycastModeInfo.Title = `Raycast-Mode:~n~ ~g~${modeTitle}~s~ ${rayCastFlags[1].Title} ${rayCastFlags[2].Title} ${rayCastFlags[3].Title}`;
  } else if (choosenFlag === 2) {
    RaycastModeInfo.Title = `Raycast-Mode:~n~ ~s~${rayCastFlags[0].Title} ~g~${modeTitle}~s~ ${rayCastFlags[2].Title} ${rayCastFlags[3].Title}`;
  } else if (choosenFlag === 4) {
    RaycastModeInfo.Title = `Raycast-Mode:~n~ ~s~${rayCastFlags[0].Title} ${rayCastFlags[1].Title} ~g~${modeTitle}~s~ ${rayCastFlags[3].Title}`;
  } else if (choosenFlag === 16) {
    RaycastModeInfo.Title = `Raycast-Mode:~n~ ~s~${rayCastFlags[0].Title} ${rayCastFlags[1].Title} ${rayCastFlags[2].Title} ~g~${modeTitle}~s~`;
  }
  RaycastModeInfo.draw2d();
  let result = Raycast.line(2, choosenFlag, alt.Player.local.scriptID);
  if (choosenFlag !== 1) {
    if (result.isHit) {
      rXpos.Title = `X: ${result.pos.x.toFixed(2)}`;
      rYpos.Title = `Y: ${result.pos.y.toFixed(2)}`;
      rZpos.Title = `Z: ${result.pos.z.toFixed(2)}`;
      let rot = game.getEntityHeading(result.hitEntity);
      if (convertToRadiants) {
        rot = convertDegToRad(rot);
        rHeading.Title = `Heading(R): ${rot.toFixed(2)}`;
      } else {
        rHeading.Title = `Heading(D): ${rot.toFixed(2)}`;
      }
      rHash.Title = `Hash: ${result.entityHash}`;
      if (choosenFlag == 2) {
        let o = VehicleList.find((p) => p.Hash == result.entityHash);
        o
          ? (rModel.Title = `Model: ${o.DisplayName}`)
          : (rModel.Title = `Model: unknown`);
      }
      if (choosenFlag == 16 || choosenFlag == 256) {
        let o = PropList.find((p) => p.Hash == result.entityHash);
        o
          ? (rModel.Title = `Model: ${o.Name}`)
          : (rModel.Title = `Model: unknown`);
      }
      if (choosenFlag == 4 || choosenFlag == 8) {
        let o = PedList.find((p) => p.Hash == result.entityHash);
        o
          ? (rModel.Title = `Model: ${o.Name}`)
          : (rModel.Title = `Model: unknown`);
      }
      let dimensionArray = game.getModelDimensions(
        result.entityHash,
        null,
        null
      );
      let dimension = dimensionArray[2].sub(dimensionArray[1]);
      rDimensionX.Title = `Width: ${dimension.x}`;
      rDimensionY.Title = `Length: ${dimension.y}`;
      rDimensionZ.Title = `Height: ${dimension.z}`;
      RaycastInfo.Position = {
        x: result.pos.x,
        y: result.pos.y,
        z: result.pos.z + 1,
      };
      RaycastInfo.draw3d();
    }
  } else {
    let result = Raycast.line(1, 1, alt.Player.local.scriptID);
    if (result.isHit) {
      rGroundName.Title = `Hash: ${result.entityMaterial}`;
      rGroundHash.Title = `Name: ${
        TextureList.find((t) => t.Hash == result.entityMaterial).Name
      }`;
      RaycastInfoGround.Position = {
        x: result.pos.x,
        y: result.pos.y,
        z: result.pos.z + 1,
      };
      RaycastInfoGround.draw3d();
    }
  }
  //Street-Information
  let pos = alt.Player.local.pos;
  let streetHash = game.getStreetNameAtCoord(
    pos.x,
    pos.y,
    pos.z,
    null,
    null
  )[1];
  let streetZoneDisplay = zones.find(
    (x) => x.Name == game.getNameOfZone(pos.x, pos.y, pos.z)
  ).DisplayName;
  let streetNameDisplay = game.getStreetNameFromHashKey(streetHash);
  streetZone.Title = "Zone: " + streetZoneDisplay;
  streetName.Title = "Name: " + streetNameDisplay;
  StreetInfo.draw2d();
});
alt.on("keyup", (key) => {
  switch (key) {
    //Arrow-Up
    case 0x26:
      changeRaycastFlag();
      break;
    //Arrow-Right
    case 0x27:
      convertToRadiants = !convertToRadiants;
      break;
    //Arrow-Left
    case 0x25:
      speedInMP = !speedInMP;
      break;
    default:
      break;
  }
});
function changeRaycastFlag() {
  let newFlag = choosenFlag;
  let choosenFlagIndex = rayCastFlags.indexOf(
    rayCastFlags.find((f) => f.Flag == choosenFlag)
  );
  if (choosenFlagIndex < rayCastFlags.length - 1) {
    newFlag = rayCastFlags[choosenFlagIndex + 1].Flag;
    alt.log(`Changed RayCast-Flag from ${choosenFlag} to ${newFlag}`);
    choosenFlag = newFlag;
  } else {
    newFlag = 1;
    alt.log(`Changed RayCast-Flag from ${choosenFlag} to ${newFlag}`);
    choosenFlag = newFlag;
  }
}
function convertDegToRad(degrees) {
  return (degrees * Math.PI) / 180;
}
