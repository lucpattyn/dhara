<template>
  <div>
    <draggable class="list-group text-left mt-4" :list="tasks" style="cursor:move; min-height: 100px;" group="people"
      ghost-class="ghost" @change="changed(column_id, $event)" :animation="200">
      <b-card class="mb-2 text-left task" :class="getTaskCustomization" :style="getTaskHeight(element)"
        v-for="(element) in tasks"
        @contextmenu.prevent.stop="e => { element['column_id'] = column_id; taskHandle($event, element) }"
        :key="element._id">
        <div class="titleAndButton">
          <h5 class="card-title"> {{ element.title }} </h5>
          <span style=" top: 0px; cursor:pointer;"
            @click.prevent.stop="e => { element['column_id'] = column_id; taskHandle($event, element) }">
            <i class="fas fa-ellipsis-h"></i>
          </span>

        </div>

        <div class="expireAt">
          <p style="top:50px" v-if="element.expireAt">
            <i class="fa fa-clock" />
            {{ element.expireAt | moment('MMMM D') }}
          </p>
        </div>

        <div class="description">
          <p style="max-height: 100px; overflow-y: scroll;"> {{ element.description }} </p>
        </div>
      </b-card>
    </draggable>
  </div>
</template>

<script>
import eventBus from "../../eventBus";

import draggable from "vuedraggable";
export default {
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
        return "min-height: 190px";
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