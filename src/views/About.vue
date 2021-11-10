<template>
  <div class="flex justify-center">
    <v-card-text class="w-100 w-50-m w-50-l">
      <v-card color="red lighten-2" class="text-center white--text">
        Only for Managers
      </v-card>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        clearable
      ></v-text-field>
      <v-btn block class="mt3" dark color="green lighten-1" @click="addItem()">
        New Item
      </v-btn>
      <v-data-table
        :mobile-breakpoint="0"
        :headers="headers"
        :items="excelData"
        class="elevation-1 mt3"
        :search="search"
        :loading="dataRefresh"
        loading-text="Loading... Please wait"
        :items-per-page="excelData.length"
        hide-default-footer
      >
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <v-card>
              <v-card-text>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="product"
                        label="Product"
                        :rules="mandatoryRule"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="quantity"
                        label="Quantity"
                        :rules="mandatoryRule"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="mrp"
                        label="MRP"
                        :rules="mandatoryRule"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="amount"
                        label="Amount"
                        :rules="mandatoryRule"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn class="success" block @click="saveItem">
                        Save
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-btn class="warning" block @click="dialog = !dialog">
                        Close
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="dataRow !== -1">
                      <v-btn class="error" block @click="deleteItem()">
                        Delete
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)" color="error">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>

<script>
const { GoogleSpreadsheet } = require("google-spreadsheet");
export default {
  name: "Home",
  data: () => ({
    mandatoryRule: [(v) => !!v || "Mandatory Field"],
    excelData: [],
    sheet: "",
    dialog: false,
    dataRefresh: false,
    dataRow: "",
    product: "",
    quantity: "",
    amount: "",
    mrp: "",
    headers: [
      { text: "Product", value: "Product", sortable: false },
      { text: "Quantity", value: "Quantity", sortable: false },
      { text: "MRP", value: "MRP", sortable: false },
      { text: "Price", value: "Amount", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    search: "",
  }),
  methods: {
    async getData() {
      const creds = require("../excel.json"); // the file saved above
      const doc = new GoogleSpreadsheet(
        "16aK9XzxgzNR2JYpy84jZNJciJrDEoiI7BIrHrYcKOXQ"
      );
      await doc.useServiceAccountAuth(creds);
      await doc.loadInfo();
      this.sheet = doc.sheetsByIndex[1];
      var excelData = await this.sheet.getRows();
      var index = 0;
      for (var i = excelData.length - 1; i >= 0; i--) {
        excelData[i].index = index;
        this.excelData.push(excelData[i]);
        index++;
      }
      this.dataRefresh = false;
      this.$store.commit("setTotalItemsEntered", this.excelData.length);
    },
    editItem(item) {
      this.product = item.Product;
      this.quantity = item.Quantity;
      this.amount = item.Amount;
      this.mrp = item.MRP;
      this.dataRow = item.index;
      this.dialog = true;
    },
    async insertItem() {
      this.dialog = false;
      this.dataRefresh = true;
      this.excelData = [];
      await this.sheet.addRow({
        Product: this.product,
        Quantity: this.quantity,
        Amount: this.amount,
        MRP: this.mrp,
      });
      this.getData();
    },
    async updateitem() {
      this.search = "";
      this.dialog = false;
      this.dataRefresh = true;
      await this.excelData[this.dataRow].delete();
      this.excelData = [];
      await this.sheet.addRow({
        Product: this.product,
        Quantity: this.quantity,
        Amount: this.amount,
        MRP: this.mrp,
      });
      this.getData();
    },
    saveItem() {
      var valid = this.$refs.form.validate();
      if (valid) {
        if (this.dataRow === -1) {
          this.insertItem();
        } else {
          this.updateitem();
        }
      }
    },
    addItem() {
      this.dataRow = -1;
      this.product = "";
      this.quantity = "";
      this.amount = "";
      this.mrp = "";
      this.dialog = true;
    },
    async deleteItem() {
      this.search = "";
      this.dialog = false;
      this.dataRefresh = true;
      await this.excelData[this.dataRow].delete();
      this.excelData = [];
      this.getData();
    },
  },
  mounted() {
    this.dataRefresh = true;
    this.getData();
  },
};
</script>
