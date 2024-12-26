<template>
    <div>
        <label for="_role">Rol: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_role" v-model="user.role" /><br>

        <label for="_mail">Emailadres: </label>
        <input :readonly="true" class='readonly' id="_mail" v-model="user.email" /><br> 

        <label for="_fn">Voornaam: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_fn" v-model="user.fn" /><br>

        <label for="_ln">Achternaam: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_ln" v-model="user.ln" /><br>

        <label for="_pn">Voorkeursnaam: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_pn" v-model="user.pn" /><br>

        <label for="_telnr">Telefoonnummer: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_telnr" v-model="user.telnr" /><br>

        <label for="_street">Straat: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_street" v-model="user.street" /><br>

        <label for="_streetnr">Nr: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_streetnr" v-model="user.streetnr" /><br>

        <label for="_postcode">Postcode: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_postcode" v-model="user.postcode" /><br>

        <label for="_town">Gemeente: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_town" v-model="user.town" /><br>

        <label for="_country">Land: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_country" v-model="user.country" /><br>

        <label for="_emergencyTelnr">Noodgeval nummer: </label>
        <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_energencyTelnr" v-model="user.emergencyTelnr" /><br>

        <button v-show="!editMode" @click="activateEditMode()">Aanpassen</button>
        <button v-show="editMode" @click="cancelChanges()">Annuleren</button>
        <button v-show="editMode" @click="saveChanges()">Opslaan</button>
    </div>
</template>
<script>
import { useUserStore } from '@/stores/userStore';
export default {
    name: 'UserInfoPage',
    data() {
        return {
            editMode: false,
            user: [],
            userBackup: [],
            userStore: useUserStore(),
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
            //API call --> PUT
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
            };
        },

    },

};
</script>
<style scoped>

input.readonly {
  background-color: #f5f5f5;
  border: 1px solid #eee;
  cursor: not-allowed;

}</style>
