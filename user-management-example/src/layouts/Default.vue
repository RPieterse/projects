<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        aria-label="navigation-drawer"
        v-model="drawer"
        :permanent="isDrawerOpen"
        :temporary="!isDrawerOpen"
        style="height: 100vh"
        class="bg-primary-dark"
      >
        <v-list-item
          class="pa-4 cursor-default"
          prepend-avatar="https://img.freepik.com/free-vector/letter-e-logo-icon-colorfuell_125964-396.jpg?w=2000"
          title="User Manager"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list class="pt-0">
          <div
            v-for="{ name, path, icon, children, title } in navigationItems"
            :key="name"
          >
            <v-list-item
              v-show="isEmpty(children)"
              :aria-label="name"
              active-class=""
              :active="isCurrentPage(path)"
              class="py-4 cursor-pointer nav-item"
              :prepend-icon="icon"
              :title="title"
              @click="navigateTo(path)"
            />

            <v-list-group value="Admin" v-show="!isEmpty(children)">
              <template #activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :aria-label="name"
                  active-class="nav-item active"
                  :active="isCurrentPage(path)"
                  class="py-4 cursor-pointer nav-item"
                  :prepend-icon="icon"
                  :title="title"
                  @click="navigateTo(path)"
                ></v-list-item>
              </template>
              <v-list-item
                v-for="{ name, path, icon, title } in children"
                :key="name"
                :aria-label="name"
                active-class="nav-item active"
                :active="isCurrentPage(path)"
                class="py-4 cursor-pointer nav-item"
                :append-icon="icon"
                :title="title"
                @click="navigateTo(path)"
              />
              <v-list-item
                aria-label="import-users"
                active-class="nav-item active"
                class="py-4 cursor-pointer nav-item"
                append-icon="mdi-file-import"
                title="Import Profiles"
              >
                <v-dialog v-model="importDialog" activator="parent">
                  <v-card>
                    <import-tool
                      @import="runImport"
                      :loading="loadingImport"
                      :fields="[
                        { title: 'First Name', key: 'fName' },
                        { title: 'Last Name', key: 'lName' },
                        { title: 'Email Address', key: 'email' },
                        { title: 'Status', key: 'status' },
                        { title: 'Profile Picture', key: 'profilePicture' },
                      ]"
                    />
                    <v-card-actions>
                      <v-btn color="primary" block @click="importDialog = false"
                        >Cancel</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item>
            </v-list-group>
          </div>
        </v-list>
        <template v-slot:append>
          <v-divider></v-divider>
          <v-list-item
            aria-label="logout"
            class="py-4 cursor-pointer nav-item danger"
            prepend-icon="mdi-lock"
            @click="navigateTo('Logout')"
            title="Logout"
          />
        </template>
      </v-navigation-drawer>
      <v-main>
        <v-toolbar
          ref="toolbar"
          color="white"
          style="height: 72px"
          class="py-1 px-6"
        >
          <div v-if="!isDrawerOpen">
            <v-btn icon @click="toggleDrawer">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <strong class="ml-2">User Management</strong>
          </div>
          <div v-else class="d-flex justify-space-between w-full align-center">
            <h3>{{ pageTitle }}</h3>
            <div class="d-flex">
              <v-btn icon>
                <v-icon color="blue-grey-lighten-3">mdi-bell</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon color="blue-grey-lighten-3">mdi-email</v-icon>
              </v-btn>
              <v-list-item
                prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
                title="John Leider"
                subtitle="john@google.com"
                class="pr-0"
              >
                <template v-slot:append>
                  <v-btn size="small" variant="text" icon>
                    <v-icon>mdi-menu-down</v-icon>
                    <v-menu activator="parent">
                      <v-list>
                        <v-list-item
                          class="cursor-pointer"
                          @click="navigateTo('Logout')"
                        >
                          <v-list-item-title>Sign Out</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-btn>
                </template>
              </v-list-item>
            </div>
          </div>
        </v-toolbar>
        <div class="content">
          <v-breadcrumbs
            v-show="!isEmpty(breadcrumbs)"
            class="pl-6"
            :items="breadcrumbs"
          ></v-breadcrumbs>
          <router-view />
        </div>
      </v-main>
    </v-layout>
    <v-snackbar
      color="success"
      v-model="showImportSuccessSnackbar"
      :timeout="2000"
    >
      Profiles Imported!

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showImportSuccessSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { isEmpty } from "lodash";
import ImportTool from "@/components/ImportTool.vue";
import { mapActions, mapGetters } from 'vuex';
export default {
  components: {
    ImportTool,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      activePage: 1,
      drawer: true,
      loadingImport: false,
      showImportSuccessSnackbar: false,
      importDialog: false,
      navigationItems: [
        {
          name: "dashboard",
          path: "Dashboard",
          title: "Dashboard",
          icon: "mdi-view-dashboard",
        },
        {
          name: "users",
          path: "Users",
          title: "Users",
          icon: "mdi-account-group",
        },
        {
          name: "profiles",
          title: "Profiles",
          icon: "mdi-account",
          children: [
            {
              name: "add-new-user",
              path: "AddNewUser",
              title: "Add New",
              icon: "mdi-plus",
            },
          ],
        },
        {
          name: "history",
          path: "History",
          title: "History",
          icon: "mdi-history",
        },
      ],
    };
  },
  computed: {
    isDrawerOpen() {
      const { mdAndUp } = this.$vuetify.display;
      if (this.drawer && !mdAndUp) {
        this.drawer = true;
      }
      if (!this.drawer && !mdAndUp) {
        this.drawer = false;
      }
      if (mdAndUp) {
        this.drawer = mdAndUp;
      }
      return mdAndUp;
    },
    pageTitle() {
      return this.$route.name;
    },
    ...mapGetters("users", ["getNewId"]),
    breadcrumbs() {
      const path = this.$route.fullPath.split("/").slice(1);
      if (path.length < 2) {
        return [];
      }
      return path.map((name, index) => {
        return {
          text: name.split("")[0].toUpperCase() + name.slice(1),
          disabled: true,
          href: "/" + path.slice(0, index + 1).join("/"),
        };
      });
    },
  },
  mounted() {
    if (!this.$route.name) {
      return this.$router.push({ name: "Dashboard" });
    }
  },
  methods: {
    ...mapActions("users", ["createUser"]),
    runImport({csv, mappings}) {
      let profileId = this.getNewId + 1;
      this.loadingImport = true;
      csv.forEach((row) => {
        const mappedObj = {};
        mappings.forEach((map) => {
          mappedObj[map.key] = row[map.column];
        });
        mappedObj["createdAt"] = Date.now();
        mappedObj["id"] = profileId;
        this.createUser(mappedObj);
        profileId++;
      });
      this.loadingImport = false;
      this.importDialog = false;
      this.showImportSuccessSnackbar = true;
    },
    handleImportSuccess() {},
    isEmpty,
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    isCurrentPage(name) {
      return this.$route.name == name;
    },
    navigateTo(name) {
      if (name) return this.$router.push({ name });
    },
  },
};
</script>

<style scoped>
.content {
  height: calc(100vh - 73px);
  overflow-y: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.content::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
