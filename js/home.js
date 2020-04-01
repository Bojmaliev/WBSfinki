const Home = {
    template: `
<div>
    <div class="columns">
    <div class="column is-8">
    <div class="content">
        <h1 class="title">{{finki.label}}</h1>

    {{finki.abstract}}
</div>
</div>
<div class="column is-4">
<iframe width="100%" height="350" frameborder="0" scrolling="no"
marginheight="0" marginwidth="0"
src="https://www.openstreetmap.org/export/embed.html?bbox=21.406918%2C42.002648%2C21.411825%2C42.005436&amp;layer=mapnik&amp;marker=42.0041057,21.4094932"
style="border: 1px solid black"></iframe>
</div>
</div>
<nav class="level is-primary">
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Студиски програми</p>
      <p class="title">{{finki.noProgrammes}}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Кадар</p>
      <p class="title">{{finki.noStaff}}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Предмети</p>
      <p class="title">{{finki.noSubjects}}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Коментари</p>
      <p class="title">{{finki.noComments}}</p>
    </div>
  </div>
</nav>
    <div class="level">
        <div class="level-left">
            <h3 class="title">Коментари</h3>
        </div>
        <div class="level-right">
                <button v-on:click="commentModal = true" class="button is-info">Напиши коментар</button>
        </div>
    </div>
<div class="columns is-multiline">
<div class="column is-one-quarter"  v-for="comment in finki.comments">
<div class="card">
  <div class="card-content">
    <div class="content">
      {{comment}}
    </div>
  </div>
</div>
</div>
</div>

    <div class="modal" v-bind:class="{'is-active': commentModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Напиши коментар</p>
                <button v-on:click="closeComment()" class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Вашиот коментар за ФИНКИ</label>
                    <div class="control">
                        <textarea class="textarea" v-model="comment" placeholder="Внесете корисничко име"></textarea>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" v-on:click="writeComment()">Испрати</button>
                <button class="button" v-on:click="closeComment()">Откажи</button>
            </footer>
        </div>
    </div>
</div>
    `,
    data:function () {
        return {
            commentModal: false,
            comment:"",
            dbo__abstract:"",
            finki:{
                noStaff:0,
                noProgrammes:0,
                noSubjects:0,
                noComments:0,
                label:"Добредојдовте на ФИНКИ WIKI ",
                abstract:"Fakultetot za informaticka nauka i kompjutersko inzenerstvoFakultetot za informaticka nauka i kompjutersko inzenerstvoFakultetot za informaticka nauka i kompjutersko inzenerstvoFakultetot za informaticka nauka i kompjutersko inzenerstvoFakultetot za informaticka nauka i kompjutersko inzenerstvoFakultetot za informaticka nauka i kompjutersko inzenerstvo",
            }
        };
    },
    methods:{
        closeComment(){
            this.comment = "";
            this.commentModal = false;
        },
        loadHomepage(){
            fetch(API+"/get_homepage")
                .then(a=>a.json())
                .then(a=>{
                    this.finki = a;
                })
        },
        writeComment(){
            if (!getLogged()) {
                loginModal.open();
                return;
            }
             fetch(API + "/write-comment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        rdfs__comment:this.comment,
                        schema__author: getLogged()
                    })
            }).then(a=>a.json()).then(a=>{
                this.loadHomepage();
                this.closeComment();
             })
        }
    },
    mounted(){
        this.loadHomepage();
    }
};