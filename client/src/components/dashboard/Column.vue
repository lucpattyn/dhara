<template>
  <!-- Column -->
  <b-card tag="article" class="mb-2 widget-img kanban-widget text-center p-2" :class="getColumnCustomization"
    :style="getColumnStyle">
    <!-- Column Header -->
    <template>
      <!-- Column Title -->
      <template>
        <h4 class="card-title" @dblclick="edit_component.id_for_title = column._id"
          v-show="edit_component.id_for_title !== column._id" :column_title="edit_component.id_for_title"> {{
              column.title
          }} </h4>
        <b-form-input type="text" @focusout="updateColumnTitle(column._id)" tabindex="0"
          v-if="edit_component.id_for_title === column._id" v-model="column.title"
          @keyup.enter="edit_component.id_for_title = null;" style="width: auto; margin: auto;" />
      </template>
      <!-- End Of Column Title -->

      <!-- Column Menu -->
      <template>
        <span style="position: absolute; top: 0px; right:10px; cursor:pointer;"
          @click.prevent.stop="columnHandle($event, column)">
          <i class="fas fa-ellipsis-h"></i>
        </span>
      </template>
      <!-- End Of Column Menu -->

      <!-- Column Task Size -->
      <template>
        <span class="mb-2" style="display:block;">({{ column.tasks.length }})</span>
      </template>
      <!-- End Of Column Task Size -->

      <!-- Column Icon -->
      <template v-if="!customization.icons.selected">
        <b-img :src="getColumnIcon(column.icon)" @dblclick="changeComponentIconStatus(column._id)" class="mb-3" />
        <div v-if="edit_component.id_for_icon === column._id">
          <i class="fas fa-arrow-circle-left" @click="updateColumnIcon('left', column.icon, column._id)"
            style="cursor: pointer; position: absolute;left: 5%; top:150px; font-size: 25px;"></i>
          <i class="fas fa-arrow-circle-right" @click="updateColumnIcon('right', column.icon, column._id)"
            style="cursor: pointer; position: absolute;right: 5%; top:150px; font-size: 25px;"></i>
        </div>
      </template>
      <!-- End of Column Icon -->
    </template>

    <!-- Column Body -->
    <template>
      <Task :tasks="column.tasks" :column_id="column._id" :customization="customization" />
    </template>
    <!-- End Of Column Body -->

    <!-- Column Footer -->
    <template>
      <hr :style="getHRStyle" />
      <transition name="slide-fade">
        <div class="form" v-if="new_task.column_id === column._id" style="font-size: smaller;">
          <b-form-group label="What's must be done?" class="text-left" :invalid-feedback="invalidTitleFeedback"
            :state="taskTitleChecker">
            <b-form-input v-model="new_task.title" :state="taskTitleChecker" trim size="sm"></b-form-input>
          </b-form-group>
          <b-form-group label="Expiration Date (optional)" class="text-left">
            <b-form-datepicker v-model="new_task.expireAt" class="mb-2" size="sm"></b-form-datepicker>
          </b-form-group>
          <!-- description start -->
          <div class="text-area">
            <label class="text-left" :state="taskTitleChecker">DESCRIPTION</label>
            <textarea v-model="new_task.description" :state="taskTitleChecker" name="" id="" cols="25" rows="5" trim
              size="sm"></textarea>
          </div>
          <!-- description end -->

          <!-- upload multiple photos -- Start -->
          <input type="file" name="images" multiple v-on:change="selectedFiles">
          <input type="submit" value="submit files" @click="multipleFileSubmited">
          <!-- upload multiple photos -- END -->



          <!-- file uploaded message show -- start -->
          <p v-show="isFileuploaded"> {{ uploadMsg }}</p>

          <b-form-group label="Do you wanna label the task?" class="text-left">
            <b-form-radio-group v-model="new_task.isLabeled"
              :options="[{ text: 'Yes', value: true }, { text: 'No', value: false }]"></b-form-radio-group>
          </b-form-group>
          <template v-if="new_task.isLabeled">
            <b-form-group label="Label" class="text-left" :invalid-feedback="invalidLabelFeedback"
              :state="taskLabelChecker">
              <b-form-input v-model="new_task.label" :state="taskLabelChecker" trim size="sm"></b-form-input>
            </b-form-group>
            <b-form-group label="Label Type" class="text-left">
              <b-form-select v-model="new_task.labelType"
                :options="['danger', 'warning', 'primary', 'info', 'dark', 'success']" size="sm"></b-form-select>
            </b-form-group>
          </template>
          <b-form-group>
            <b-button v-if="taskTitleChecker" class="float-left mt-3" type="submit" variant="success"
              style="width: 48%;" @click="createNewTask">
              <i class="fas fa-check mr-2" />Save task
            </b-button>

            <b-button v-if="taskTitleChecker" class="float-right mt-3" type="reset" variant="danger" style="width: 48%;"
              @click="resetNewTask">
              <i class="fas fa-times mr-2" />Cancel
            </b-button>
          </b-form-group>
        </div>
      </transition>
      <i class="fas fa-plus" @click="e => { resetNewTask(); new_task.column_id = column._id; }"
        v-show="new_task.column_id !== column.task_id" style="cursor:pointer;"></i>
      <i class="fas fa-times" @click="resetNewTask" v-show="new_task.column_id === column._id && !taskTitleChecker"
        style="cursor:pointer;"></i>
    </template>
    <!-- End Of Column Footer -->
  </b-card>
  <!-- End of Column -->
</template>

<script>
import eventBus from "../../eventBus";
import Task from "./Task";
export default {
  props: ["customization", "column", "column_title"],
  components: {
    Task
  },
  data() {
    return {

      multipleFileSelect: [],
      filePath: '',
      uploadMsg: '',
      cloumnTitle: '',
      isFileuploaded: false,
      multipleFilePath: [],
      multipleFileName: [],


      available_icons: [
        "todo",
        "inprogress",
        "done",
        "programming",
        "mobile-testing",
        "usability-testing",
        "mobile-messages",
        "review",
        "code-review",
        "survey",
        "report",
        "design-notes"
      ],
      edit_component: {
        id_for_title: "",
        id_for_icon: null
      },
      new_task: {
        title: "",
        description: '',
        selectedFile: '',

        label: "",
        labelType: null,
        expireAt: null,
        column_id: null,
        isLabeled: false
      }
    };
  },
  computed: {
    taskTitleChecker() {
      return this.new_task.title.length >= 3 ? true : false;
    },
    taskLabelChecker() {
      return this.new_task.label.length >= 3 ? true : false;
    },
    invalidTitleFeedback() {
      if (this.new_task.title.length > 3) {
        return "";
      } else if (this.new_task.title.length > 0) {
        return "Enter at least 3 characters";
      } else {
        return "Please enter something";
      }
    },
    invalidLabelFeedback() {
      if (this.new_task.label.length > 3) {
        return "";
      } else if (this.new_task.label.length > 0) {
        return "Enter at least 3 characters";
      } else {
        return "Please enter something";
      }
    },
    getColumnCustomization() {
      if (this.customization.theme.selected === "Dark") {
        return "text-white";
      }
      return "";
    },
    getColumnStyle() {
      if (this.customization.theme.selected === "Dark") {
        return "background-color: #1e242b; border: 2px double #ffffff1c;";
      }
      return "background-color: rgb(241, 241, 241);";
    },
    getHRStyle() {
      if (this.customization.theme.selected === "Dark") {
        return "border-top: 1px solid rgba(255, 255, 255, 0.21)";
      }
      return "";
    }
  },
  methods: {

    onFileSelected(event) {
      this.new_task.selectedFile = event.target.files[0];

    },

    selectedFiles(event) {
      this.new_task.filesSelected = event.target.files;
      console.log(event.target.files.length);
      for (let i = 0; i < event.target.files.length; i++) {
        this.multipleFileSelect.push(event.target.files[i]);
      }
    },


    multipleFileSubmited() {
      const files = this.multipleFileSelect
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i], files[i].name)
      }

      this.$http.post('/user/multipleFileUpload', formData).then(res => {
        if (res.status === 200) {
          this.uploadMsg = 'Your file was uploaded!'
          this.isFileuploaded = true
        }
        const result = res.data.file;
        for (let i = 0; i < result.length; i++) {
          this.multipleFilePath.push(result[i].path)
          this.multipleFileName.push(result[i].filename)
        }
      })
    },


    // send request back end for store data in local mechine -- end
    createNewTask() {

      let {
        // selectedFile,
        title,
        description,
        label,
        labelType,
        expireAt,
        column_id,
        isLabeled
      } = this.new_task;

      let multipleFileName = this.multipleFileName
      let multipleFilePath = this.multipleFilePath


      let data = { title, column_id, description, multipleFileName, multipleFilePath };
      if (column_id !== null) {
        if (expireAt !== null) {
          expireAt = new Date(expireAt);
          data["expireAt"] = expireAt;
        }
        if (label !== null && isLabeled) {
          data["label"] = label;
          if (labelType !== null) {
            data["labelType"] = labelType;
          } else {
            data["labelType"] = "dark";
          }
        }
        this.$http
          .post("/user/tasks", data)
          .then(res => {

            if (res.data.status === true) {
              this.$swal({
                position: "bottom-end",
                icon: "success",
                toast: true,
                title: "Task successfully created",
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              this.$swal({
                position: "bottom-end",
                icon: "error",
                toast: true,
                title: "Error occurred creating the task",
                showConfirmButton: false,
                timer: 1500
              });
            }
            eventBus.$emit("load-project"); // load project again.
            this.resetNewTask();
          })
          .catch(err => {
            if (err.response.status === 401) {
              this.$router.push("/login");
            } else if (err.response.status === 429) {
              this.$swal({
                position: "bottom-end",
                icon: "error",
                toast: true,
                title: `${err.response.data.message}`,
                showConfirmButton: false,
                timer: 2000
              });
            }
          });
      } else {
        // warning...
      }
    },

    resetNewTask() {
      this.uploadMsg = '',
        this.new_task = {
          textArea: '',
          title: "",
          label: "",
          labelType: null,
          expireAt: null,
          column_id: null,
          isLabeled: false
        };
    },
    columnHandle(event, item) {
      eventBus.$emit("column-option-handled", { event, item });
    },
    getColumnIcon(icon) {
      return require(`../../assets/svg/${icon}.svg`);
    },
    updateColumnTitle(column_id) {

      this.edit_component.id_for_title = null;
      this.$http
        .put("/user/columns", { column_id })
        .then(res => {
          console.log(res);
          if (res.data.status === true) {
            this.$swal({
              position: "bottom-end",
              icon: "success",
              toast: true,
              title: "Column title updated",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            this.$swal({
              position: "bottom-end",
              icon: "error",
              toast: true,
              title: "Error occurred updating column title",
              showConfirmButton: false,
              timer: 1500
            });
          }
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.$router.push("/login");
          }
        });
    },
    changeComponentIconStatus(column_id) {
      if (this.edit_component.id_for_icon === null) {
        this.edit_component.id_for_icon = column_id;
      } else {
        this.edit_component.id_for_icon = null;
      }
    },
    updateColumnIcon(cursor_direction, current_icon, column_id) {
      let index = this.available_icons.indexOf(current_icon);
      let icon = "";
      if (cursor_direction === "right") {
        if (index < this.available_icons.length - 1) {
          icon = this.available_icons[index + 1];
        } else {
          icon = this.available_icons[0];
        }
      } else {
        if (index === 0) {
          icon = this.available_icons[this.available_icons.length - 1];
        } else {
          icon = this.available_icons[index - 1];
        }
      }

      this.$http
        .put("/user/columns", { column_id, icon })
        .then(res => {
          if (res.data.status === true) {
            this.$swal({
              position: "bottom-end",
              icon: "success",
              toast: true,
              title: "Column icon successfully updated",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            this.$swal({
              position: "bottom-end",
              icon: "error",
              toast: true,
              title: "Error occurred updating column icon",
              showConfirmButton: false,
              timer: 1500
            });
          }
          eventBus.$emit("load-project"); // load project again.
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.$router.push("/login");
          }
        });
    }
  }
};
</script>

<style scoped>
input[type='file'] {
  background-color: rgb(255, 81, 81);
  border: 2px solid rgb(255, 81, 81);
  width: 190px;
}

input[type='submit'] {
  color: white;
  width: 110px;
  margin: 2px;
  background-color: green;
  border: none;
  padding: 5px;
}
</style>