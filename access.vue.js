/**
 * What is this?
 *      Complete definition of `access`.
 *
 * Usage:
 *      The value of `Access` is used to create a vue component in `index.html`
 *
 * Remarks:
 *      The content here is typically included as a distinct Vue component,
 *      but here it is a plain javascript object.
 *      Everything within this object is the actual definition of the Vue component.
 *
 * */
const Access = {
  template: `
    <div>
        <Navigation/>
        <h1>Access</h1>

        <div class="error" v-if="validationErrors.length > 0" style = "color:red; margin-top: 2em; margin-bottom: 1em;">
            {{ validationErrors }}
        </div>
        <div v-else style="margin-top: 2em; margin-bottom: 1em;">&nbsp;</div>

        <form @submit.prevent="validateAndSubmit" id="formLogin">
        
          <div class="field section" style="margin-top:3em">
              <label for="email" >Email:</label>
              <input type="text"  name="email" v-model="email" @input="validate" :disabled="authstatus"/>
              <button style="margin-left:1em" type="submit" :disabled="authstatus">Access</button>
          </div>

          <div class="section">
              <i v-if="authstatus">You have access! </i>
              <i v-else>Verify email to gain access.</i>
          </div>

        </form>
    </div>`,

  data() {
    return {
      email: "",
      validationErrors: [],
    };
  },
  computed: {
    authstatus() {
      // this way of sharing values is ok for small projects.
      // large projects must use Vuex
      return this.$root.authstatus;
    },

    urls() {
      // fetch URLs from root
      return this.$root.apiurls;
    },
  },
  mounted() {
    this.fetchAuthStatus();
  },
  methods: {
    async fetchAuthStatus() {
      // triggered at load. Relevant only when you have a session.
      // for JWT and similar: check against token, and pass refresh token if expired
      console.log("Fetching auth status..");
      const res = await axios.get(this.urls.authget, {
        crossdomain: true,
      });

      const authData = res.data;
      console.log(`GET auth done!`, authData);

      if (authData["auth-status"]) {
        console.log("Auth approved!");
      } else {
        // this is silent error since user will ..
        // .. most likely not have access the first time the screen loads
        console.log("Auth denied..! Re-login.");
      }
      this.$emit("auth-verified", authData["auth-status"]);
    },
    async login() {
      try {
        // main login flow
        const res = await axios.post(this.urls.authpost, { email: this.email });
        const authData = res.data;

        console.log(`POST auth done!`, authData);

        if (!authData["auth-status"]) {
          this.validationErrors.push(
            "Could not verify email. Validate and resubmit."
          );
        }
        this.$emit("auth-verified", authData["auth-status"]);
      } catch (e) {
        this.validationErrors.push[e.message];
        console.error(e);
      }
    },
    validateAndSubmit() {
      // This method will control what gets submitted.
      // Runs validation logic and any pre-flight checks
      // .. before sending the request off to server.
      this.validationErrors = [];
      if (this.validate()) {
        this.login();
      }
    },
    validate() {
      // simple validations
      // replace with something like Vuelidate or ..
      // .. whatever is integrated with styling libraries
      // Note that this logic is called for every change in email..
      // .. typically we should just call validation for the specific field.
      const errors = [];
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!pattern.test(this.email)) errors.push("Invalid email.");

      if (errors) this.validationErrors = errors;
      else this.validationErrors = [];

      return !this.validationErrors.length;
    },
  },
};
