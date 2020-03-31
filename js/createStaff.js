const CreateStaff = {
    template: `
<div>
<h1 class="title">Креирање кадар</h1>
<div class="notification is-danger" v-if="error">
  <button class="delete" v-on:click="error = null"></button>
 {{error}}
</div>
<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Име презиме и титула</label>
  </div>
  <div class="field-body">
  <div class="field is-narrow">
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="foaf__title">
            <option value="Студент">Студент</option>
            <option value="Дипломиран">Дипломиран</option>
            <option value="Магистер">Магистер</option>
            <option value="Доктор на науки">Доктор на науки</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <p class="control is-expanded">
        <input class="input" type="text" v-model="foaf__givenName" placeholder="Име">
      </p>
    </div>
    <div class="field">
      <p class="control is-expanded">
        <input class="input" type="text" v-model="foaf__familyName" placeholder="Презиме">
      </p>
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Роден</label>
  </div>
  <div class="field-body">
    <div class="field">
      <p class="control">
        <input class="input" type="text" v-model="dbo__birthPlace" placeholder="URI каде е роден">
      </p>
    </div>
    <div class="field">
      <p class="control ">
        <input class="input" type="text" v-model="dbo__birthDate" placeholder="гггг-мм-дд">
      </p>
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Фотографија</label>
  </div>
  <div class="field-body">
    <div class="field">
      <p class="control">
        <input class="input" type="text" v-model="foaf__img" placeholder="Фотографија">
      </p>
    </div>
    <div class="field">
        <figure class="image is-48x48">
            <img v-bind:src="foaf__img" >
        </figure>
    </div>
  </div>
</div>


<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Веб страница</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <input class="input " v-bind="foaf__homepage" type="text" placeholder="Лична веб страница">
      </div>
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Студирал во</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <input class="input " v-bind="foaf__schoolHomepage" type="text" placeholder="Веб страница од факултетот каде што студирал">
      </div>
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Улога</label>
  </div>
  <div class="field-body">
  <div class="field is-narrow" v-for="(role,i) in wbsfinki__role">
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="wbsfinki__role[i]">
            <option value="aiiso-roles__Associate_Dean">Декан</option>
            <option value="aiiso-roles__Professor">Професор</option>
            <option value="aiiso-roles__Assistant">Асистент</option>
            <option value="aiiso-roles__Admission_Officer">Административец</option>
          </select>
      </div>
      </div>
    </div>
    <div class="field">
     <button class="button is-success" v-on:click="newRole">Нова улога</button>
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
  <div class="field-label is-normal">
    <label class="label">Коментар</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <textarea class="textarea" v-bind="rdfs__comment" placeholder="Коментар за личноста"></textarea>
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
        <button v-on:click="saveStaff()" class="button is-info">
          Зачувај кадар
        </button>
      </div>
    </div>
  </div>
</div>
</div>
`,
    data: function () {
        return {
            error:null,
            foaf__title: "Дипломиран",
            foaf__familyName: "",
            foaf__givenName: "",
            dbo__birthDate: "",
            dbo__birthPlace: "",
            foaf__img: "https://bulma.io/images/placeholders/128x128.png",
            foaf__homepage: "",
            foaf__schoolHomepage: "",
            rdfs__comment: "",
            wbsfinki__role: ["aiiso-roles__Professor"],
            schema__sameAs: "",
        }
    },
    methods: {
        newRole() {
            if (this.wbsfinki__role.length > 2) return;
            this.wbsfinki__role.push("aiiso-roles__Professor")
        },
        saveStaff() {
            if (!getLogged()) {
                loginModal.open();
                return;
            }
            fetch(API + "/create-staff", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        ...this.$data,
                        schema__author: getLogged()
                    })
            }).then(a=>a.json())
                .then(a => {
                    if(a.success){
                        router.push('/staff')
                    }
                    if(a.error){
                        this.error = a.error;
                    }
                })
        }
    }

};