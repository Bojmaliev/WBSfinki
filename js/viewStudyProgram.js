const ViewStudyProgram = {
    template: `
    <div>
        <div class="columns">
        <div class="column is-1">
            <router-link to="/study-programs" tag="button" class="button is-info">Назад</router-link>
        </div>
        <div class="column">
            <h1 class="title">Студиски програми</h1>
        </div>
        </div>
     <div  v-for="opt in options" class="content">
        <h4 class="title is-4">{{opt.year}} година, {{opt.semestar}} семестар</h4>
       <div class="list is-hoverable">
          <a class="list-item" v-on:click="openSubject(item.subject)" v-for="item in opt.subjects" >
            {{item.label}}
          </a>
    </div>
    </div>
</div>
    `,
    data: function () {
        return {
            options: [
                {year: "I", semestar: "Зимски", subjects:[]},
                {year: "I", semestar: "Летен", subjects:[]},
                {year: "II", semestar: "Зимски", subjects:[]},
                {year: "II", semestar: "Летен", subjects:[]},
                {year: "III", semestar: "Зимски", subjects:[]},
                {year: "III", semestar: "Летен", subjects:[]},
                {year: "IV", semestar: "Зимски", subjects:[]},
                {year: "IV", semestar: "Летен", subjects:[]},
            ]
        }
    },
    methods: {
        loadSubjects(studyProgram) {
            fetch(API + "/get-subjects/" + studyProgram)
                .then(a => a.json())
                .then(a => {
                    this.options.map(b=>{
                        b["subjects"] = a.filter(z => z.academicYear === b["year"] && z.semestar === b["semestar"]);
                        return b;
                    });
                })
        },
        openSubject(sub){
            sub = sub.split("#")[1];
            router.push("/subjects/"+sub)
        }
    },
    mounted(){
        const program = this.$route.params.studyProgram;
        this.loadSubjects(program)
    }
};