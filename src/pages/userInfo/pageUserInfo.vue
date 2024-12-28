<template>
    <div>
        <div>
            <label for="_role">Rol: </label>
            <label for="input_user">gebruiker: </label>
            <input type="radio" :readonly="!editMode" :class="{'readonly': !editMode}" id="_role"  v-model="user.role" value="user">
            <label for="input_owner">eigenaar: </label>
            <input type="radio" :readonly="!editMode" :class="{'readonly': !editMode}" id="input_owner" v-model="user.role" value="owner">
        </div>
        <div>
            <label for="_mail">Emailadres: </label>
            <input :readonly="true" class='readonly' id="_mail" v-model="user.email" /><br> 
        </div>
        <div>
            <label for="_fn">Voornaam: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_fn" v-model="user.fn" /><br>
        </div>
        <div>
            <label for="_ln">Achternaam: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_ln" v-model="user.ln" /><br>
        </div>
        <div>
            <label for="_pn">Voorkeursnaam: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_pn" v-model="user.pn" /><br>
        </div>
        <div>
            <label for="_telnr">Telefoonnummer: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_telnr" v-model="user.telnr" /><br>
        </div>
        <div>
            <label for="_street">Straat: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_street" v-model="user.street" /><br>
        </div>
        <div>
            <label for="_streetnr">Nr: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_streetnr" v-model="user.streetnr" /><br>
        </div>
        <div>
            <label for="_postcode">Postcode: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_postcode" v-model="user.postcode" /><br>
        </div>
        <div>
            <label for="_town">Gemeente: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_town" v-model="user.town" /><br>
        </div>
        <div>
            <label for="_country">Land: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_country" v-model="user.country" /><br>
        </div>
        <div>
            <label for="_emergencyTelnr">Noodgeval nummer: </label>
            <input :readonly="!editMode" :class="{'readonly': !editMode}" id="_energencyTelnr" v-model="user.emergencyTelnr" /><br>
        </div>
        <button v-show="!editMode" @click="activateEditMode()">Aanpassen</button>
        <button v-show="editMode" @click="cancelChanges()">Annuleren</button>
        <button v-show="editMode" @click="saveChanges()">Opslaan</button>
    </div>
</template>
<script>
import { useUserStore } from '@/stores/userStore';

export default {
    name: 'UserInfoPage',
    mounted() {
        this.initialiseUserData();
    },
    data() {
        return {
            editMode: false,
            user: {},
            userBackup: {},
        };
    },
    methods: {
        async initialiseUserData() {
            const store = useUserStore();
            await store.fetchUserData();
            const userStoreData = store.getUserData;
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
            const store = useUserStore();
            store.updateUserData(this.userData)
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
                this.error = store.error || 'Failed to update user';
            });
        },
    },
    computed: {
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
