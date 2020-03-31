const ViewSubject = {
    template: `
<div>
    <section class="hero is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        {{subject.name}}
      </h1>
      <h2 class="subtitle">
        Се учи во {{subject.year}} година, <span class="tag is-white is-medium">{{subject.semestar}}</span> семестар
        <router-link tag="button" :to="{name:'editCourse', params:{id:uri}}" class="is-pulled-right button">Предложи измена</router-link>
      </h2>
    </div>
  </div>
</section>    
<div class="columns">
<div class="column is-4">
<div class="card">
  <div class="card-content">
    <p class="subtitle">
      Задолжителен на:
    </p>
    <p v-if="subject.mandatory && subject.mandatory.length === 0">Нема такви</p>
    <div class="list">
    <router-link class="list-item" :to="{name:'viewStudyProgram', params:{studyProgram:item.uri}}" v-for="item in subject.mandatory">{{item.label}}</router-link>
</div>
</ul>
    <p class="subtitle">
      Изборен на:
    </p>
    <p v-if="subject.optional && subject.optional.length === 0">Нема такви</p>
        <div class="list">
    <router-link class="list-item" :to="{name:'viewStudyProgram', params:{studyProgram:item.uri}}" v-for="item in subject.optional">{{item.label}}</router-link>
    </div>
     <p class="subtitle">
      Предуслов слушани предмети:
    </p>
    <p v-if="subject.listen && subject.listen.length === 0">Нема такви</p>
        <div class="list">
    <router-link class="list-item" :to="{name:'viewSubject', params:{id:item.uri}}" v-for="item in subject.listen">{{item.label}}</router-link>
    </div>
        <p class="subtitle">
      Предуслов положени предмети:
    </p>
    <p v-if="subject.passed && subject.passed.length === 0">Нема такви</p>
        <div class="list">
    <router-link class="list-item" :to="{name:'viewSubject', params:{id:item.uri}}" v-for="item in subject.passed">{{item.label}}</router-link>
    </div>
  </div>
</div>
</div>
<div class="column is-8">
<div class="tabs">
  <ul>
    <li v-bind:class="{'is-active': -1===tabs}" v-on:click="tabs=-1"><a>Опис на предметот</a></li>
    <li v-bind:class="{'is-active':i===tabs}" v-for="(prof, i) in subject.professors" v-on:click="tabs = i"><a>Опис кај {{prof.profName}}</a></li>
  </ul>
</div>
<div class="content">
    <div class="content" v-if="tabs===-1">
    <p v-if="subject.comment">
    {{subject.comment}}
    </p>
    <p v-else>Сеуште нема информации</p>
    </div>
    <div class="content" v-if="tabs===i"  v-for="(prof, i) in subject.professors">
        <p v-if="prof.comment">
    {{prof.comment}}
    </p>
    <p v-else>Сеуште нема информации</p>
    </div>
    
<h4 class="subtitle is-4">Како се полага:</h4>
<p v-if="subject.waysToPass">
{{subject.waysToPass}}
</p>
<p v-else>Сеуште нема информации</p>
</div>
</div>
</div>
</div>

    `,
    data: function () {
        return {
            uri:this.$route.params.id,
            subject:{},
            tabs:-1
        }
    },
    methods: {
        loadSubject(id) {
            fetch(API + "/subjects/" + id)
                .then(a => a.json())
                .then(a => {
                    this.subject = a;
                })
        }
    },
    mounted() {
        this.loadSubject(this.uri)
    },
};