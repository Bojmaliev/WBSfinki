const Subjects = {
    template: `
<div>
    <div class="level">
        <div class="level-left">
            <h1 class="title">Предмети</h1>
        </div>
        <div class="level-right">
                <router-link to="/create-course" tag="button" class="button is-info">Креирај предмет</router-link>
        </div>
    </div>
<div class="columns ">
<div class="column">
<article class="panel is-link">
  <p class="panel-heading">
    Филтер
  </p>
  <div class="panel-block">
    <p class="control has-icons-left">
      <input v-model="search" class="input is-link" type="text" placeholder="Барај за предмети">
      <span class="icon is-left">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  <div class="panel-block">
  <div class="select is-fullwidth">
  <select v-model="year">
    <option value="0">Сите академски години</option>
    <option value="I">I</option>
    <option value="II">II</option>
    <option value="III">III</option>
    <option value="IV">IV</option>
  </select>
</div>
</div>
  <div class="panel-block">
  <div class="select is-fullwidth">
  <select v-model="semestar">
    <option value="0">Сите семестри</option>
    <option value="Летен">Летен</option>
    <option value="Зимски">Зимски</option>
  </select>
</div>
</div>
<div class="panel-block">
<label class="checkbox">
  <input type="checkbox" v-model="mandatory">
  Задолжителни
</label>
</div>
</article>
</div>
<div class="column is-8">
  <router-link :to="{name:'viewSubject', params:{id:subject.uri}}" class="panel-block" v-for="subject in filtered">
    <span class="panel-icon">
      <i class="fas fa-book" aria-hidden="true"></i>
    </span>
    {{subject.name}}
  </router-link>
</div>
</div>
</div>
</div>
`,
    data:function () {
        return {
            subjects:[],
            year:0,
            semestar:0,
            search:"",
            mandatory:false
        }
    },
    methods:{
      loadSubjects(){
           fetch(API + "/get_all_subjects")
                .then(a => a.json())
                .then(a => {
                    this.subjects = a.map(b=> {
                        b["uri"]= b["uri"].split("#")[1];
                        return b;
                    });
                })
      }
    },
    computed:{
        filtered(){
            return this.subjects.filter(a=>{
                let be = true;
                if(this.year!==0) be = be && a.year === this.year;
                if(this.semestar!==0) be = be && a.semestar === this.semestar;
                if(this.search!=="") be = be && a.name.indexOf(this.search)!==-1;
                if(this.mandatory) be = be && a.mandatory.length > 0;
                return be;
            });
        }
    },
    mounted(){
        this.loadSubjects();
    }
};