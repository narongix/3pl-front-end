<template>
    <Dialog v-model:visible="promptFindRecipient" header="Choose from template" :style="{width: '350px'}">
        <div class="grid">
            <div class="col-12 md:col-12 sm:col-12">
                <DropDownPagination v-model="myContact" :options="getRecipientByUser"
                :disabled="disabled" id="recipient" placeholder="Please select a recipient"
                :validation="validation"
                :whenLoad="onloadRecipientV2" :limit="getRecipientLimit" :whenSearch="findRecipient"
                :showOption="option=>option.full_name"
                :showValue="showValueRecipient" :offset="offset ?? 0" :user="userSelector"
                >
                </DropDownPagination>
            </div>
        </div>

        <template #footer>
            <Button label="Discard" @click="changeRecipientState"></Button>
            <Button label="Select" @click="onConfirmSelectRecipientState"></Button>
        </template>
    </Dialog>
</template>

<script>
    import { mapGetters } from 'vuex';
    import DropDownPagination from '../../../../components/DropDownPagination.vue';

    export default{
    components: { DropDownPagination },
    props: {
        findRecipientState: Boolean,
        userSelector: String,
        validation: Boolean,
        modelValue: String,
        disabled: null,
        offset: Number
    },
    emits: ["update:findRecipientState", "update:modelValue"],
    data() {
        return {
            myContact: null,
        };
    },
    computed: {
        ...mapGetters({
            getRecipientsState: "recipient/getRecipientsState",
            getRecipientLimit: "recipient/getLimit",
        }),
        getRecipientByUser() {
            const newRecipient = this.getRecipientsState.filter((e) => e.user_id == (this.userSelector));
            return newRecipient;
        },
        promptFindRecipient: {
            get() {
                return this.findRecipientState;
            },
            set(newValue) {
                this.$emit("update:findRecipientState", newValue);
            }
        },

        myData:{
            get(){
                return this.modelValue;
            },
            set(newValue){
                this.$emit("update:modelValue", newValue);
            }
        }
    },
    methods: {

        changeRecipientState(){
            this.promptFindRecipient = !this.promptFindRecipient
        },
        
        onConfirmSelectRecipientState(){
            this.myData = this.getRecipientValue();
            this.changeRecipientState()
        },

        showValueRecipient(value) {
            return value?.full_name ?? "Empty";
        },
        async findRecipient(filterValue) {
            await this.$store.dispatch("recipient/getRecipients", {
                offset: 0,
                searchString: filterValue,
                user_id: this.userSelector
            });
        },
        getRecipientValue() {
            const myAddress = this.myContact.street_address ? " - " + this.myContact.street_address : "";
            return this.myContact.full_name + myAddress;
        },
        async onloadRecipientV2(offset) {
            const recipients = await this.$store.dispatch("recipient/getRecipients", {
                offset: offset,
                userId: this.userSelector
            });
            return recipients.length;
        },
    },
    watch: {
        promptFindRecipient: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    // Doing this to ensure that whenever 
                    // a new user in admin is loaded, 
                    // it wouldn't take a contact of the old selected user
                    this.myContact = null;
                    try {
                        // TODO: Fix this, everytime the dialog is tap, 
                        // it shoudl have loaded this,
                        // Temp Fix
                        this.onloadRecipientV2(0);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        },
    },
}
</script>