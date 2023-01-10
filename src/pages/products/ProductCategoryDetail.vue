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
            <InputText
              type="text"
              :disabled="editDisabled"
              v-model="category.category_name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editDisabled: true,
      category: {
        category_name: null
      },
      temp:null,
    };
  },
  created(){
    this.loadData()
  },
  methods: {
    changeEdit() {
      this.editDisabled = !this.editDisabled;
      if (this.editDisabled) {
        this.saveData();
      }
    },
    saveData() {
     
      console.log("Update Id " + JSON.stringify(this.category));
      this.$store.dispatch('products/updateProductCategory', {
        payload: this.category,
      });
      this.$router.replace('/product-categories');
    },
    discard() {
      this.editDisabled = !this.editDisabled;
      this.category = this.temp;
    },
    async loadData() {

      this.category = await this.$store.getters["products/prodCategories"].filter((prodCategories) => {
        return prodCategories.id == this.$route.params.id;
      })[0];
      this.temp= {...this.category}
      // console.log("temp: "+JSON.stringify(this.temp))
    },
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
  }
};
</script>