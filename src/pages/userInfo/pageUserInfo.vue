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
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_fn" v-model="user.fn" />
        </div>

        <div>
            <label for="_ln">Achternaam: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_ln" v-model="user.ln" />
        </div>
        <div>
            <label for="_pn">Voorkeursnaam: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_pn" v-model="user.pn" />
        </div>
        <div>
            <label for="_telnr">Telefoonnummer: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_telnr" v-model="user.telnr" />
        </div>
        <div class="inlineGroup">
            <div class="large">
                <label for="_street">Straat: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_street" v-model="user.street" />
            </div>
            <div class="small">
                <label for="_streetnr">Nr: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_streetnr" v-model="user.streetnr" />
            </div>
        </div>
        <div class="inlineGroup">
            <div class="small">
                <label for="_postcode">Postcode: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_postcode" v-model="user.postcode" />
            </div>
            <div class="large">
                <label for="_town">Gemeente: </label>
                <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_town" v-model="user.town" />
            </div>
        </div>
        <div v-if="!editMode">
            <label for="_country">Land: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_country" v-model="user.country" />
        </div>
        <div v-else>
            <countrySelector :modelvalue="user.country" v-model="user.country"/> 
        </div>

        <div>
            <label for="_emergencyTelnr">Noodgeval nummer: </label>
            <input type="text" :readonly="!editMode" :class="{'readonly': !editMode}" id="_emergencyTelnr" v-model="user.emergencyTelnr" />
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
import countrySelector from '@/components/countrySelector.vue';

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
    components: {
        countrySelector,
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
  background-color: #e0dedeb6;
  border: 1px solid #000000;
  cursor: not-allowed;

}</style>
