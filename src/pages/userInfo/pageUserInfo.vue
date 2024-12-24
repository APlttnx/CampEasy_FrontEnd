<template>
    <div>
        <label for="_role">Rol: </label>
        <input id="_role" v-model="user.role" /><br>

        <label for="_fn">Voornaam: </label>
        <input id="_fn" v-model="user.fn" /><br>

        <label for="_ln">Achternaam: </label>
        <input id="_ln" v-model="user.ln" /><br>

        <label for="_pn">Voorkeursnaam: </label>
        <input id="_pn" v-model="user.pn" /><br>

        <label for="_mail">Emailadres: </label>
        <input id="_mail" v-model="user.email" /><br> <!--niet veranderbaar-->

        <label for="_telnr">Telefoonnummer: </label>
        <input id="_telnr" v-model="user.telnr" /><br>

        <label for="_street">Straat: </label>
        <input id="_street" v-model="user.street" /><br>

        <label for="_streetnr">Nr: </label>
        <input id="_streetnr" v-model="user.streetnr" /><br>

        <label for="_postcode">Postcode: </label>
        <input id="_postcode" v-model="user.postcode" /><br>

        <label for="_town">Gemeente: </label>
        <input id="_town" v-model="user.town" /><br>

        <label for="_country">Land: </label>
        <input id="_country" v-model="user.country" /><br>

        <label for="_emergencyTelnr">Noodgeval nummer: </label>
        <input id="_energencyTelnr" v-model="user.emergencyTelnr" /><br>

        <button v-show="!editMode" @click="activateEditMode()">Aanpassen</button>
        <button v-show="editMode" @click="cancelChanges()">Annuleren</button>
        <button v-show="editMode" @click="saveChanges()">Opslaan</button>
    </div>
</template>
<script>
export default {
    name: 'UserInfoPage',
    data() {
        return {
            editMode: false,
            user: {},
            userBackup: null,
        };
    },
    methods: {
        activateEditMode() {
            this.userBackup = { ...this.user };
            this.editMode = true;
        },
        cancelChanges() {
            this.editMode = false;
            this.user = { ...this.userBackup };
        },
        saveChanges() {
            this.editMode = false;

        },
    },
    computed: {
        fullAddress() {
            return `${this.user.street} | ${this.user.streetnr} | ${this.user.postcode} | ${this.user.town}`;
        },

        userData() {
            return {
                firstName: this.user.fn,
                lastName: this.user.ln,
                preferredName: this.user.pn,
                roleUser: this.user.role,
                email: this.user.email,
                phoneNumber: this.user.phoneNumber,
                address: this.fullAddress,
                country: this.user.country,
                emergencyTel: this.user.emergencyTelnr,
                password: this.user.password,
            };
        },

    },

};
</script>
<style scoped></style>
