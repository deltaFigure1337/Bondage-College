"use strict";
var CollegeDetentionBackground = "CollegeDetention";
var CollegeDetentionYuki = null;
var CollegeDetentionYukiLove = 0;

// Returns TRUE if the dialog option should be shown
function CollegeDetentionCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }
function CollegeDetentionYukiLoveIs(LoveLevel) { return (CollegeDetentionYukiLove >= parseInt(LoveLevel)) }

// Fully dress-up Yuki
function CollegeDetentionYukiClothes() {
	CharacterNaked(CollegeDetentionYuki);
	InventoryWear(CollegeDetentionYuki, "TeacherOutfit1", "Cloth", "Default");
	InventoryWear(CollegeDetentionYuki, "PussyDark3", "Pussy", "#333333");
	InventoryWear(CollegeDetentionYuki, "Eyes3", "Eyes", "#f85e27");
	InventoryWear(CollegeDetentionYuki, "Mouth1", "Mouth", "Default");
	InventoryWear(CollegeDetentionYuki, "H0920", "Height", "Default");
	InventoryWear(CollegeDetentionYuki, "Small", "BodyUpper", "Asian");
	InventoryWear(CollegeDetentionYuki, "Small", "BodyLower", "Asian");
	InventoryWear(CollegeDetentionYuki, "Default", "Hands", "Asian");
	InventoryWear(CollegeDetentionYuki, "HairBack5", "HairBack", "#333333");
	InventoryWear(CollegeDetentionYuki, "HairFront6", "HairFront", "#333333");
	InventoryWear(CollegeDetentionYuki, "OuvertPerl1", "Bra", "#BB0000");
	InventoryWear(CollegeDetentionYuki, "Panties11", "Panties", "#BB0000");
	InventoryWear(CollegeDetentionYuki, "Socks3", "Socks", "#555555");
	InventoryWear(CollegeDetentionYuki, "Shoes2", "Shoes", "Default");
}

// Generates Yuki
function CollegeDetentionLoad() {

	// Generates a full Yuki model based on the Bondage College template
	if (CollegeDetentionYuki == null) {

		// Do not generate her if she's already in the private room
		if (PrivateCharacter.length > 1)
			for (var P = 1; P < PrivateCharacter.length; P++)
				if (PrivateCharacter[P].Name == "Yuki")
					return;
		
		// Generates the model
		CollegeDetentionYuki = CharacterLoadNPC("NPC_CollegeDetention_Yuki");
		CollegeDetentionYuki.AllowItem = false;
		CollegeDetentionYuki.Name = "Yuki";
		CollegeDetentionYuki.GoneAway = false;
		CollegeDetentionYukiClothes();
		CharacterRefresh(CollegeDetentionYuki);

	}

}

// Runs the room (shows the player and Yuki)
function CollegeDetentionRun() {
	DrawCharacter(Player, 500, 0, 1);
	if ((CollegeDetentionYuki != null) && !CollegeDetentionYuki.GoneAway) DrawCharacter(CollegeDetentionYuki, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

// When the user clicks in the room
function CollegeDetentionClick() {
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (CollegeDetentionYuki != null) && !CollegeDetentionYuki.GoneAway) CharacterSetCurrent(CollegeDetentionYuki);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// When Yuki love towards the player changes, it can also trigger an event.  When a good or bad move is done, her expression will change quickly.
function CollegeDetentionYukiLoveChange(LoveChange, Event) {
	if (LoveChange != null) CollegeDetentionYukiLove = CollegeDetentionYukiLove + parseInt(LoveChange);
	if ((LoveChange != null) && (parseInt(LoveChange) < 0)) {
		CharacterSetFacialExpression(CollegeDetentionYuki, "Eyes", "Dazed");
		TimerInventoryRemoveSet(CollegeDetentionYuki, "Eyes", 2);
		if (CollegeDetentionYukiLove <= -5) {
			CollegeDetentionYuki.Stage = "1000";
			CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "YukiHadEnough");
		}
	}
	if ((LoveChange != null) && (parseInt(LoveChange) > 0)) {
		CharacterSetFacialExpression(CollegeDetentionYuki, "Eyebrows", "Raised");
		TimerInventoryRemoveSet(CollegeDetentionYuki, "Eyebrows", 2);
		if (CollegeDetentionYukiLove >= 10) {
			CollegeDetentionYuki.Stage = "2000";
			CollegeDetentionYuki.CurrentDialog = DialogFind(CollegeDetentionYuki, "YukiPropose");
		}
	}
}

// Dress back the player and Yuki
function CollegeDetentionDressBack() {
	CharacterRelease(Player);
	CharacterRelease(CollegeDetentionYuki);
	CollegeEntranceWearStudentClothes(Player);
	CollegeDetentionYukiClothes();
}

// When the plater invites Yuki to her room
function CollegeDetentionInviteToPrivateRoom() {
	CollegeDetentionDressBack();
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeDetentionYuki, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Dominant", 20);
	NPCTraitSet(C, "Horny", 80);
	NPCTraitSet(C, "Rude", 60);
	NPCTraitSet(C, "Serious", 40);
	C.Love = 20;
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();
	CollegeDetentionYuki.GoneAway = true;
}