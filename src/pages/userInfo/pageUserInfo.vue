<template>
    <form>
        <div>
            <label for="_role">Rol: </label>
            <p>{{ user.role == "owner" ? 'Eigenaar' : user.role == "user" ? 'Gebruiker' : "UNDEFINED"}}</p>
        </div>
        <div>
            <label for="_mail">Emailadres: </label>
            <p>{{ user.email }}</p>
        </div>
        <div>
            <label for="_fn">Voornaam: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_fn" v-model="user.fn" /><br>
        </div>

        <div>
            <label for="_ln">Achternaam: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_ln" v-model="user.ln" /><br>
        </div>
        <div>
            <label for="_pn">Voorkeursnaam: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_pn" v-model="user.pn" /><br>
        </div>
        <div>
            <label for="_telnr">Telefoonnummer: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_telnr" v-model="user.telnr" /><br>
        </div>
        <div class="inlineGroup">
            <div class="large">
                <label for="_street">Straat: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_street" v-model="user.street" /><br>
            </div>
            <div class="small">
                <label for="_streetnr">Nr: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_streetnr" v-model="user.streetnr" /><br>
            </div>
        </div>
        <div class="inlineGroup">
            <div class="small">
                <label for="_postcode">Postcode: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_postcode" v-model="user.postcode" /><br>
            </div>
            <div class="large">
                <label for="_town">Gemeente: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_town" v-model="user.town" /><br>
            </div>
        </div>
        <div>
            <label for="_country">Land: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_country" v-model="user.country" /><br>
        </div>
        <div>
            <label for="_emergencyTelnr">Noodgeval nummer: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_emergencyTelnr" v-model="user.emergencyTelnr" /><br>
        </div>
        <div class="inlineGroup">
            <button v-show="!editMode" @click="activateEditMode()">Aanpassen</button>
            <button v-show="editMode" @click="cancelChanges()">Annuleren</button>
            <button v-show="editMode" @click="saveChanges()">Opslaan</button>
        </div>
    </form>
</template>
<script>
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/userStore';

export default {
    name: 'UserInfoPage',
    created() {
        this.initializeUserData();
    },
    data() {
        return {
            editMode: false,
            user: {},
            userBackup: {},
        };
    },
    methods: {
        
        async initializeUserData() {
            await this.userStore.fetchUserData();
            const userStoreData = this.userStore.getUserData;
            if (userStoreData) {
                this.user = { ...userStoreData };
            }
        },
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
            this.userStore.updateUserData(this.userData)
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
                this.error = this.userStore.error || 'Failed to update user';
            });
        },
    },
    computed: {
        ...mapStores(useUserStore),
        userData() {
            return {
                firstName: this.user.fn,
                lastName: this.user.ln,
                preferredName: this.user.pn,
                roleUser: this.user.role,
                email: this.user.email,
                phoneNumber: this.user.telnr,
                address: `${this.user.street} | ${this.user.streetnr} | ${this.user.postcode} | ${this.user.town}`,
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
