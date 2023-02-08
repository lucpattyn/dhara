<template>
  <div>
    <draggable class="list-group text-left mt-4" :list="tasks" style="cursor:pointer; min-height: 100px;" group="people"
      ghost-class="ghost" @change="changed(column_id, $event)" :animation="200">
      <b-card class="mb-2 text-left" :class="getTaskCustomization" :style="getTaskHeight(element)"
        v-for="(element) in tasks"
        @contextmenu.prevent.stop="e => { element['column_id'] = column_id; taskHandle($event, element) }"
        :key="element._id">
        <h4 class="card-title">{{ element.title }}</h4>
        <p class="card-text description" style="" v-if="element.description">
          {{ element.description }}
        </p>
        <span style="position: absolute; top: 0px; cursor:pointer;"
          @click.prevent.stop="e => { element['column_id'] = column_id; taskHandle($event, element) }">
          <i class="fas fa-ellipsis-h"></i>
        </span>
        <p v-if="element.filePath.length > 1"> FIELS</p>
        <div class="images-link" v-if="element.filePath.length > 1">
          <b-list-group v-for="filePath in element.filePath" :key="filePath">
            <a :href="imageENVvariable + filePath" target="_blank"> {{ filePath.substring(8, 23) }} </a>
          </b-list-group>
        </div>
        <div>
          <p v-if="element.expireAt">
            <i class="fa fa-clock" />
            {{ element.expireAt | moment('MMMM D') }}
          </p>
          <span :class="`badge badge-${element.labelType}`" style="text-transform:capitalize; font-size: 0.635rem"
            v-if="element.labelType">
            <i class="fas fa-circle" />
            {{ element.label }}
          </span>
        </div>
        <p> Members:</p>
        <div class="assing-user" v-for="(user, index) in element.assignUserInTask" :key="index">
          {{ user.substring(0, 1) }}
        </div>
      </b-card>
    </draggable>
  </div>
</template>

<script>
import eventBus from "../../eventBus";

import draggable from "vuedraggable";
export default {
  data() {
    return {
      imageENVvariable: process.env.VUE_APP_IMAGE_URL
    }
  },
  props: ["tasks", "column_id", "customization"],
  components: {
    draggable
  },
  computed: {
    getTaskCustomization() {
      if (this.customization.theme.selected === "Dark") {
        return "bg-dark text-white";
      }
      return "";
    }
  },
  methods: {
    getTaskHeight(element) {

      if (element.date || element.label || element.description) {
        return "min-height: 100px";
      } else {
        return "min-height: 80px";
      }
    },
    taskHandle(event, item) {
      eventBus.$emit("task-option-handled", { event, item });
    },

    changed: function (column_id, evt) {
      if (evt.added) {
        let task_id = evt.added.element._id;
        this.$http
          .post("/user/addToColumn", { task_id, column_id })
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            if (err.response.status === 401) {
              this.$router.push("/login");
            }
          });
      } else if (evt.removed) {
        let task_id = evt.removed.element._id;
        this.$http
          .post("/user/removeFromColumn", { task_id, column_id })
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            if (err.response.status === 401) {
              this.$router.push("/login");
            }
          });
      } else {
        console.log("Unknown process.");
      }
    }
  }
};
</script>

<style>
.description {
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 15px;
  line-height: 19px;
  overflow-y: scroll;
  max-height: 100px;
}

.description::-webkit-scrollbar {
  width: 12px;
}

.description::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background-color: rgb(213, 207, 207);
}

.user {
  color: white;
  background-color: #172B4D;
  font-size: 31px;
  cursor: pointer;
  margin: 1px;
  border-radius: 50%;
}

.images-link {
  height: 100px;
  overflow-y: scroll;
}

.images-link::-webkit-scrollbar {
  width: 12px;
}


.images-link::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background-color: rgb(213, 207, 207);
}

.assing-user {
  margin-top: 2px;
  display: inline-block;
  margin-left: 10px;
  color: white;
  font: bold;
  text-align: center;
  background-color: red;
  height: 30px;
  width: 30px;
  border-radius: 40px;
}
</style>