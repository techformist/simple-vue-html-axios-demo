/**
 * What is this?
 *      Complete definition of `content`.
 *
 * Usage:
 *      Value of `Content` is used to create a vue component in `index.html`
 *
 * Remarks:
 *      The content here is typically included as a distinct Vue component,
 *      but here it is a plain javascript object.
 *      Everything within this object is the actual definition of the Vue component.
 *
 * */

const Content = {
  template: `
    <div>
      <Navigation/>
      <h1>Content</h1>
      
      <div class="error" v-if="validationErrors.length > 0" style = "color:red; margin-top: 2em; margin-bottom: 1em;">
        {{ validationErrors }}
      </div>
      <div v-else style="margin-top: 2em; margin-bottom: 1em;">&nbsp;</div>

      <div class="field section" style="margin-top:3em">
          <label for="keywords" >Keywords:</label>
          <input type="text"  name="keywords" v-model="keywords"/>
          <button style="margin-left:1em" @click="">Search</button>
      </div>
      
      <div class="field section">
        <label for="posts"><b>Posts</b></label>
      </div>

      <div class="posts" style="margin-left:30%; text-align: left!important">
        <div v-for="(post,index) in posts" :key="index" >
          {{post.id}}. {{post.description}}
        </div>
        <i v-if="!posts || posts.length == 0">No content found.</i>
      </div>
      
      <div class="section" style="margin-top:1em">
        
      </div>

        
    </div>`,
  data() {
    return {
      keywords: "",
      posts: [],
      validationErrors: [],
      currentPage: 0,
      totalPages: 0,
    };
  },
  computed: {
    authstatus() {
      // large projects must used Vuex. This will work for small components and data sets.
      return this.$root.authstatus;
    },

    urls() {
      // a simple way to standardize URLs from root
      return this.$root.apiurls;
    },
  },
  mounted() {
    this.fetchPosts();
  },

  methods: {
    async fetchPosts() {
      if (!this.authstatus)
        // authstatus check here is not quite required, but is just a fall-back
        this.validationErrors.push(
          "Not logged in. You have to login to fetch posts."
        );
      else {
        console.log("Fetching posts..");
        // keywords passed as query - as-is.
        // verify whether server requires any specific format
        const res = await axios.get(
          `${this.urls.postget}?query=${this.keywords}&page=${
            this.currentPage + 1
          }`,
          {
            crossdomain: true,
          }
        );

        const postData = res.data;
        console.log(`GET posts done!`, postData);

        if (!postData["auth-status"]) {
          // auth-status is returned by post requests too!
          console.log("Auth denied..! Re-login.");
          this.validationErrors.push("Access is denied.");
        }

        this.posts = postData["posts"] ? postData["posts"] : [];
        this.currentPage = postData["currentpage"]
          ? postData["currentpage"]
          : 0;
        this.totalPages = postData["totalpages"] ? postData["totalpages"] : 0;

        // pagination logic yet to be implemented to navigate to subsequent pages
        console.log(".. posts fetched!");
      }
    },
  },

  validateAndSubmit() {
    //  there are no validations at this time.

    this.validationErrors = [];

    this.fetchPosts();
  },
};
