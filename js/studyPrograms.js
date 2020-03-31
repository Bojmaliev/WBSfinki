const StudyPrograms = {
    template: `
<div class=''>
    <div class="level">
        <div class="level-left">
            <h1 class="title">Студиски програми</h1>
        </div>
        <div class="level-right">
                <router-link to="/create-study-program" tag="button" class="button is-info">Креирај студиска програма</router-link>
        </div>
    </div>
<div class="list is-hoverable">
  <a class="list-item" v-for="item in listStudyPrograms"  v-on:click="viewStudyProgram(item.uri)">
    {{item.label}}
  </a>
</div>

</div>
 `,
    data:function () {
        return {
            listStudyPrograms:[],
        }
    },
    methods:{
        getStudyPrograms(){
            fetch(API + "/get-all-study-programs")
                .then(a => a.json())
                .then(a => {
                    this.listStudyPrograms = a;
                })
        },
        viewStudyProgram(uri){
            let subject = uri.split("#")[1];
            router.push("study-programs/"+subject);
        }
    },
    mounted(){
        this.getStudyPrograms();
    }
};
