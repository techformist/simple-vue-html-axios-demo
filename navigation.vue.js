/**
 * What is this?
 *      Complete definition of `content`.
 *
 * Usage:
 *      `Navigation` component is used in `Access` and `Content` components.
 *      This demonstrates how components play a role in the real world. They
 *      contain small pieces of reusable code that can be used in other components`
 *      or in pages/views (which assemble components to display the whole page
 *      on the app - technically also a component.)
 *
 * Remarks:
 *      The content here is typically included as a distinct Vue component,
 *      but here it is a plain javascript object.
 *      Everything within this object is the actual definition of the Vue component.
 *
 * */
const Navigation = {
  template: `
      <nav class="navbar navbar-expand-md" style="background-color: #ffffff;">
        <div class="nav-brand font-weight-bold">Vue-Axios Demo</div>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto mt-2 mt-lg-0 font-weight-bold">
            <li>
              <router-link class="nav-link" to="/">
                Access
              </router-link>
            </li>
            <li v-if="authstatus">
              <router-link class="nav-link" to="content">
                    Content
              </router-link>
            </li>
           
           
          </ul>
        </div>
      </nav>
  `,
  computed: {
    authstatus() {
      //  used to show/hide `content` link
      return this.$root.authstatus;
    },
  },
};
