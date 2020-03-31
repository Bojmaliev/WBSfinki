const CreateStudyProgram = {
    template: `
<div>
<h1 class="title">Креирање на студиска програма</h1>
<div class="notification is-danger" v-if="error">
  <button class="delete" v-on:click="error = null"></button>
 {{error}}
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Назив на студиската програма</label>
  </div>
    <div class="field-body">
    <div class="field">
      <p class="control">
        <input class="input" type="text" v-model="rdfs__label" placeholder="Назив на студиската програма">
      </p>
      </div>
    </div>
    
  </div>
<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Задолжителни предмети</label>
  </div>
    <div class="field-body">
    <div class="field">
      <p class="control">
        <div class="select is-multiple is-fullwidth ">
          <select multiple size="8" v-model="mSelectedLeft">
            <option v-bind:value="el.uri" v-for="el in listSubjects">{{el.name}}</option>
          </select>
        </div>
      </p>
      </div>
    <div class="field ">
     <p class="control">
        <button class="button is-large" v-on:click="mandatoryRight()">></button>
    </p>
    <p>
        <button class="button is-large" v-on:click="mandatoryLeft()"><</button>
    </p>
    </div>
      <div class="field">
      <p class="control ">
        <div class="select is-multiple is-fullwidth">
          <select multiple size="8"  v-model="mSelectedRight">
            <option v-bind:value="el.uri" v-for="el in chosenMandatory">{{el.name}}</option>
          </select>
        </div>
      </p>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Изборни предмети</label>
  </div>
    <div class="field-body">
    <div class="field">
      <p class="control">
        <div class="select is-multiple is-fullwidth">
          <select multiple size="8" v-model="oSelectedLeft">
            <option v-bind:value="el.uri" v-for="el in listSubjects">{{el.name}}</option>
          </select>
        </div>
      </p>
      </div>
    <div class="field ">
     <p class="control">
        <button class="button is-large" v-on:click="optionalRight()">></button>
    </p>
    <p>
        <button class="button is-large" v-on:click="optionalLeft()"><</button>
    </p>
    </div>
      <div class="field">
      <p class="control ">
        <div class="select is-multiple is-fullwidth">
          <select multiple size="8"  v-model="oSelectedRight">
            <option v-bind:value="el.uri" v-for="el in chosenOptional">{{el.name}}</option>
          </select>
        </div>
      </p>
      </div>
    </div>
  </div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Исто како</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <input class="input " v-bind="schema__sameAs" type="text" placeholder="RDF линк доколку постои">
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
        <button v-on:click="createStudyProgram()" class="button is-info">
          Зачувај студиската програма
        </button>
      </div>
    </div>
  </div>
</div>
</div>
    `,
    data: function () {
        return {
            error: null,
            rdfs__label: "",
            listSubjects: [],
            // listOptional: [],
            chosenMandatory: [],
            chosenOptional: [],
            mSelectedLeft:[],
            mSelectedRight:[],
            schema__sameAs:"",
            oSelectedLeft:[],
            oSelectedRight:[],
        };
    },
    methods: {
        getAllSubjects() {
            fetch(API + "/get_all_subjects")
                .then(a => a.json())
                .then(a => {
                    this.listSubjects = a;
                })
        },
        mandatoryLeft(){
              this.listSubjects = [
                ...this.listSubjects,
                ...this.chosenMandatory.filter(
                    a=> this.mSelectedRight.indexOf(a.uri) !== -1
                )]
            this.chosenMandatory = this.chosenMandatory.filter(a=> this.mSelectedRight.indexOf(a.uri) === -1);
        },
        mandatoryRight(){
            this.chosenMandatory = [
                ...this.chosenMandatory,
                ...this.listSubjects.filter(
                    a=> this.mSelectedLeft.indexOf(a.uri) !== -1
                )]
            this.listSubjects =  this.listSubjects.filter(a=> this.mSelectedLeft.indexOf(a.uri) === -1);

        },
        optionalLeft(){
              this.listSubjects = [
                ...this.listSubjects,
                ...this.chosenOptional.filter(
                    a=> this.oSelectedRight.indexOf(a.uri) !== -1
                )]
            this.chosenOptional = this.chosenOptional.filter(a=> this.oSelectedRight.indexOf(a.uri) === -1);
        },
        optionalRight(){
            this.chosenOptional = [
                ...this.chosenOptional,
                ...this.listSubjects.filter(
                    a=> this.oSelectedLeft.indexOf(a.uri) !== -1
                )]
            this.listSubjects = this.listSubjects.filter(a=> this.oSelectedLeft.indexOf(a.uri) === -1);

        },
        createStudyProgram() {
            if (!getLogged()) {
                loginModal.open();
                return;
            }
            const {
                rdfs__label,
                schema__sameAs,
            } = this.$data;
            const wbsfinki__hasMandatory = this.chosenMandatory.map(a=>a.uri);
            const wbsfinki__hasOptional = this.chosenOptional.map(a=>a.uri);
            fetch(API + "/create-study-program", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rdfs__label,
                    schema__sameAs,
                    wbsfinki__hasOptional,
                    wbsfinki__hasMandatory,
                    schema__author: getLogged()
                })
            }).then(a => a.json())
                .then(a => {
                    if (a.success) {
                        router.push('/study-programs')
                    }
                    if (a.error) {
                        this.error = a.error;
                    }
                })
        }
    },
    mounted() {
        this.getAllSubjects();
    }
};