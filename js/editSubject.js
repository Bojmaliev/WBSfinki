const EditSubject = {
    template: `
<div>
<h1 class="title">Измена на предмет</h1>
<div class="notification is-danger" v-if="error">
  <button class="delete" v-on:click="error = null"></button>
 {{error}}
</div>
<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Код и Назив на предметот</label>
  </div>
  <div class="field-body">
    <div class="field">
      <p class="control is-expanded">
        <input class="input" type="text" v-model="code" disabled>
      </p>
    </div>
    <div class="field">
      <p class="control is-expanded">
        <input class="input" type="text" v-model="rdfs__label"  disabled>
      </p>
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Академска година и семестар</label>
  </div>
  <div class="field-body">
    <div class="field">
      <p class="control is-expanded">
        <div class="select is-fullwidth">
          <select v-model="wbsfinki__academicYear">
            <option value="I" >I</option>
            <option value="II" >II</option>
            <option value="III" >III</option>
            <option value="IV" >IV</option>
          </select>
      </div>
      </p>
    </div>
    <div class="field">
      <p class="control is-expanded">
        <div class="select is-fullwidth">
          <select v-model="wbsfinki__semestar">
            <option value="Зимски" >Зимски</option>
            <option value="Летен" >Летен</option>
          </select>
      </div>
      </p>
    </div>
  </div>
</div>


<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Професори</label>
  </div>
  <div class="field-body">
  <div class="field is-narrow" v-for="(prof,i) in aiiso__responsibilityOf">
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="aiiso__responsibilityOf[i]">
            <option v-for="p in professorsList" v-bind:value="p.uri" >{{p.name}}</option>
          </select>
      </div>
      </div>
    </div>
    <div class="field">
     <button class="button is-success" v-on:click="newProfessor">Додај професор</button>
</div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Пред услов предмети слушани</label>
  </div>
  <div class="field-body">
  <div class="field is-narrow" v-for="(subj,i) in wbsfinki__mustListenBefore">
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="wbsfinki__mustListenBefore[i]">
            <option v-for="p in subjectsList" v-bind:value="p.uri" >{{p.name}}</option>
          </select>
      </div>
      </div>
    </div>
    <div class="field">
     <button class="button is-success" v-on:click="newListenCourse">Додај предмет</button>
</div>
  </div>
</div>


<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Пред услов предмети положени</label>
  </div>
  <div class="field-body">
  <div class="field is-narrow" v-for="(subj,i) in wbsfinki__mustPassedBefore">
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="wbsfinki__mustPassedBefore[i]">
            <option v-for="p in subjectsList" v-bind:value="p.uri" >{{p.name}}</option>
          </select>
      </div>
      </div>
    </div>
    <div class="field">
     <button class="button is-success" v-on:click="newPassedCourse">Додај предмет</button>
</div>
  </div>
</div>


<div class="field is-horizontal" v-for="(prof, i) in rdfs__comment">
  <div class="field-label is-normal">
    <label class="label">{{i ===0 ? "Опис на предметот" : "Опис за предметот кај "+getProfNameByRef(aiiso__responsibilityOf[i-1])}}</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <textarea class="textarea" v-model="rdfs__comment[i]" placeholder="Како е организиран предметот"></textarea>
      </div>
    </div>
  </div>
</div>
<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Начин на полагање</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <textarea class="textarea" v-model="wbsfinki__waysToPass" placeholder="Наџин на полагање"></textarea>
      </div>
    </div>
  </div>
</div>



<div class="field is-horizontal">
  <div class="field-label">
    <!-- Left empty for spacing -->
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <button v-on:click="editCourse()" class="button is-info">
          Зачувај предмет
        </button>
      </div>
    </div>
  </div>
</div>
</div>
    `,
    data: function () {
        return {
            uri: this.$route.params.id,
            error: null,
            rdfs__label: "",
            code: "",
            professorsList: [],
            subjectsList: [],
            aiiso__responsibilityOf: [],
            wbsfinki__academicYear: "I",
            wbsfinki__semestar: "Зимски",
            wbsfinki__waysToPass: "",
            rdfs__comment: [""],
            wbsfinki__mustListenBefore: [],
            wbsfinki__mustPassedBefore: []
        };
    },
    methods: {
        newProfessor() {
            if (this.aiiso__responsibilityOf.length > 8) return;
            if (this.professorsList.length === 0) {
                this.error = "Нема професори";
                return;
            }
            this.rdfs__comment.push("");
            this.aiiso__responsibilityOf.push(this.professorsList[0].uri)
        },
        getAllProff() {
            fetch(API + "/get_all_professors")
                .then(a => a.json())
                .then(a => {
                    this.professorsList = a;
                })
        },
        newListenCourse() {
            if (this.subjectsList.length === 0 || this.subjectsList.length === this.wbsfinki__mustListenBefore.length) {
                this.error = "Нема предмети";
                return;
            }
            this.wbsfinki__mustListenBefore.push(this.subjectsList[0].uri)
        },
        newPassedCourse() {
            if (this.subjectsList.length === 0 || this.subjectsList.length === this.wbsfinki__mustPassedBefore.length) {
                this.error = "Нема предмети";
                return;
            }
            this.wbsfinki__mustPassedBefore.push(this.subjectsList[0].uri)
        },
        getAllSubjects() {
            fetch(API + "/get_all_subjects")
                .then(a => a.json())
                .then(a => {
                    this.subjectsList = a;
                })
        },
        getProfNameByRef(ref) {
            return this.professorsList.find(a => a.uri === ref).name;
        },
        editCourse() {
            if (!getLogged()) {
                loginModal.open();
                return;
            }
            const {
                code,
                aiiso__responsibilityOf,
                wbsfinki__academicYear,
                wbsfinki__semestar,
                wbsfinki__waysToPass,
                rdfs__comment,
                wbsfinki__mustListenBefore,
                wbsfinki__mustPassedBefore
            } = this.$data;
            fetch(API + "/edit-course/"+code, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    aiiso__responsibilityOf,
                    wbsfinki__academicYear,
                    wbsfinki__semestar,
                    wbsfinki__waysToPass,
                    rdfs__comment,
                    wbsfinki__mustListenBefore,
                    wbsfinki__mustPassedBefore,
                    schema__author: getLogged()
                })
            }).then(a => a.json())
                .then(a => {
                    if (a.success) {
                        router.push('/subjects')
                    }
                    if (a.error) {
                        this.error = a.error;
                    }
                })
        },
        loadAndMapSubject() {
            fetch(API + "/subjects/" + this.uri)
                .then(a => a.json())
                .then(a => {
                    console.log(a);
                    this.wbsfinki__semestar = a.semestar;
                    this.wbsfinki__academicYear = a.year;
                    this.aiiso__responsibilityOf = a.professors.map(b=> RDF+b.uriProf);
                    this.rdfs__comment = [a.comment, ...a.professors.map(b=> b.comment)];
                    this.wbsfinki__mustListenBefore = a.listen.map(b=> RDF+b.uri);
                    this.wbsfinki__mustPassedBefore = a.passed.map(b=> RDF+b.uri);
                    this.wbsfinki__waysToPass = a.waysToPass;
                    this.rdfs__label= a.name;
                    this.code = this.uri;
                    console.log(a.passed.map(b=> RDF+b.uri))
                })
        },
    },
    mounted() {
        this.loadAndMapSubject();
        this.getAllProff();
        this.getAllSubjects();
    }
};