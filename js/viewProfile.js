const ViewProfile = {
    template: `
    <div>
    <div class='columns'>
        <div class='container profile'>
            <div class='section profile-heading'>
                <div class='columns  is-multiline'>
                    <div class="column is-3">
                    <figure class="image is-square">
                      <img v-bind:src="user.img" alt="">
                    </figure>
                    <div class="content">
                        <table class="table is-fullwidth">
                            <tr>
                                <td>Титула:</td>
                                <td><b>{{user.title}}</b></td>
                            </tr>
                            <tr>
                                <td>Улога:</td>
                                <td><b>{{user.roles}}</b></td>
                            </tr>
                            <tr v-if="user.birthDate">
                                <td>Роден на:</td>
                                <td><b>{{user.birthDate}}</b></td>
                            </tr>
                            <tr v-if="user.birthPlace">
                                <td>Роден во:</td>
                                <td><b><a v-bind:href="user.birthPlace">{{user.birthPlace.split("/")[4]}}</a></b></td>
                            </tr>
                            <tr v-if="user.homepage">
                                <td>Веб страница:</td>
                                <td><b>{{user.homepage}}</b></td>
                            </tr>
                            <tr v-if="user.schoolHomepage">
                                <td>Студирал на:</td>
                                <td><b>{{user.schoolHomepage}}</b></td>
                            </tr>
                        </table>
                    </div>
                    </div>
                    <div class='column is-12-mobile '>
                        <h1 class='title is-bold'>{{user.name}}</h1>
                        <div class="tabs is-medium">
                          <ul>
                            <li v-bind:class="{'is-active': tabs===0}" v-on:click="tabs=0"><a>Кратка биографија</a></li>
                            <li v-bind:class="{'is-active': tabs===1}" v-on:click="tabs=1"><a>Предмети</a></li>
                            <li v-bind:class="{'is-active': tabs===2}" v-on:click="tabs=2"><a>Публикации</a></li>
                          </ul>
                        </div>
                    <p v-if="tabs===0" class='tagline'>
                        {{user.comment  || "Нема биографија"}}
                    </p>
                      <table class="table is-fullwidth" v-if="tabs===1">
                        <thead><tr><th>Код</th><th>Назив</th></tr></thead>
                        <tbody>
                            <tr v-for="s in user.subjects">
                            <td>{{s.uri}}</td><td><router-link :to="{name:'viewSubject', params:{id:s.uri}}">{{s.name}}</router-link></td>
                            </tr>
                        </tbody>
                      </table>
                     <p v-if="tabs===2" class='tagline'>
                        Оваа опција не е достапна сеуште
                    </p>
                </div>



            </div>
        </div>
    </div>
</div>
</div>

    `,
    data: function () {
        return {
            user: {},
            tabs:0
        }
    },
    methods: {
        loadStaff(id) {
            fetch(API + "/staff/" + id)
                .then(a => a.json())
                .then(a => {
                    a["roles"] = a["roles"].map(z=> getRole(z)).join(", ");
                    this.user = a;
                })
        }
    },
    watch: {
    '$route.params.id': function (id) {
      this.loadStaff(id)
    }
  },
    mounted() {
        const id = this.$route.params.id;
        this.loadStaff(id)
    },
};