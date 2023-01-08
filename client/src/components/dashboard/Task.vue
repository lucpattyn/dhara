<template>
  <div>
    <draggable class="list-group text-left mt-14 container" :list="tasks" style="cursor:pointer; min-height: 190px;"
      group="people" ghost-class="ghost" @change="changed(column_id, $event)" :animation="200">

      <div v-for="(element, index) in tasks" :key="index" class="full-card-body" :class="getTaskCustomization"
        :style="getTaskHeight(element)"
        @contextmenu.prevent.stop="e => { element['column_id'] = column_id; taskHandle($event, element) }">

        <span style="float: right; cursor:pointer;  color: red;"
          @click.prevent.stop="e => { element['column_id'] = column_id; taskHandle($event, element) }">
          <i class="fas fa-ellipsis-h"></i>
        </span>


        <div class="title">
          <p style="color:black; padding: 10px;
           font-size: 25px;
           background-color: yellow;
            ">
            {{ element.title }}
          </p>
        </div>
        <div class="description" v-show="element.description">
          <p style="">
            {{ element.description }}
          </p>
        </div>



        <div class="date-time" v-show="element.expireAt">
          <p>
            <i class="fa fa-clock" />
            {{ element.expireAt | moment('MMMM D') }}
          </p>
        </div>


        <p v-show="element.label" :class="`badge badge-${element.labelType}`"
          style="text-transform:capitalize; font-size: 1rem" class="label">
          <i class="fas fa-circle" />
          {{ element.label }}
        </p>


        <img v-show="element.multipleFilePath[0]" src="../icon/icons8-attach-50.png" alt="" class="icon">
        <div class="list" v-show="element.multipleFilePath[0]">
          <ul v-for="(filePath, index) in element.multipleFilePath" :key="index">
            <li style="padding: 5px;"> <a style="color:black;"
                v-bind:href="'http://127.0.0.1:3000/multipleFiles/' + filePath" target="_black" class="file-path"> {{
                    (index + 1)
                }} . {{ filePath[0].slice(8) }} </a>
            </li>
          </ul>
        </div>

      </div>





    </draggable>
  </div>
</template>

<script>
// import Axios from 'axios'
import draggable from "vuedraggable";
import eventBus from "../../eventBus";
export default {
  data() {
    return {
      // user_email: '',
      // users: [],
    }
  },
  props: ["tasks", "column_id", "customization", "column_title"],
  components: {
    draggable
  },
  computed: {
    getTaskCustomization() {
      if (this.customization.theme.selected === "Dark") {
        return "bg-dark text-white";
      }
      return "";
    },



  },
  methods: {


    getTaskHeight(element) {
      if (element.date || element.label) {
        return "min-height: 90px";
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
        let column_title = this.column_title;
        this.$http
          .post("/user/addToColumn", { task_id, column_id, column_title })
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

<style scoped >
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

.full-card-body {
  box-shadow: 3px 3px 3px 3px rgba(139, 131, 131, 0.609);
  padding: 5px;
  border: 1px solid rgb(74, 71, 71);
  min-height: 100px;
  margin-top: 10px;
}

.list {
  background-color: white;
  min-height: 50px;
  max-height: 150px;
  overflow: scroll;
  overflow-x: hidden;
}

.list::-webkit-scrollbar {
  width: 10px;
  background-color: whitesmoke;
}

.list::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 40px;
}


.delete-file-item {
  margin-left: 30px;
  color: white;
  background-color: red;
}

.description>p {
  padding: 10px;
  margin-bottom: 10px;
  background-color: white;
  color: black;
  overflow: scroll;
  min-height: 50px;
  max-height: 150px;
  overflow-x: hidden;
}

.description>p::-webkit-scrollbar {
  width: 10px;
  background-color: #898888;
}

.description>p::-webkit-scrollbar-thumb {
  background-color: white;
  border-radius: 40px;
}

.icon {
  margin-top: 8px;
  width: 147px;
  height: 20px;
  font: white;
}
</style>