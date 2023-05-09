<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Product Category Details</h5>
        <Button :label="buttonLabel" class="p-button-success mr-2" @click="changeEdit" />
        <Button v-if="!editDisabled" label="Discard" class="p-button-secondary" @click="discard"></Button>
        <hr />
        <p></p>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-3">
            <label for="category-name">Category Name:</label>
            <InputText type="text" :disabled="editDisabled" v-model="category.category_name" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <template>
    <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
  </template>
</template>
<script>
import RetryField from '../../../components/prompt_field/RetryField.vue'

export default {
  created() {
    this.loadData()
  },
  components: {
    RetryField
  },
  props:{
    navigateToPage:{
      type: Function,
      require: true,
    }
    // userId: {
    //   type: String,
    //   require: true,
    // }
  },  
  data() {
    return {
      editDisabled: true,
      category: {
        category_name: null
      },
      temp: null,
      toLoad: null,
      message: {
        failed: "Error Loading Data. Try again?",
        yesButton: "Yes",
        noButton: "No"
      },
      errorToast: {
        severity: "error",
        summary: "Failed",
        detail: "Error Updating Product",
        life: 3000
      }
    };
  },
  computed: {
    buttonLabel() {
      let label = "";
      if (this.editDisabled) {
        label = "Edit";
      } else {
        label = "Save"
      }
      return label;
    },
  },
  methods: {
    changeEdit() {
      this.editDisabled = !this.editDisabled;
      if (this.editDisabled) {
        this.saveData();
      }
    },
    // when save data
    async saveData() {
      this.toLoad = async () => {
        const newProductCat = await this.$store.dispatch('products/updateProductCategory', {
          categoryName: this.category.category_name,
          id: this.category.id,
          userId: this.category.user_id,
        });
        // await this.$router.push({ name: 'productCategoriesList', query: { id: newProductCat.id, name: newProductCat.category_name }});
        await this.navigateToPage?.(newProductCat);
        this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Category Updated', life: 3000 });
      }
    },
    discard() {
      this.editDisabled = !this.editDisabled;
      this.category = { ...this.temp };
    },
    async loadData() {
      const data = await this.$store.getters["products/prodCategories"].filter((prodCategories) => {
        return prodCategories.id == this.$route.params.id;
      })[0];

      this.category = { ...data }
      this.temp = { ...this.category }
    }
  }
};
</script>