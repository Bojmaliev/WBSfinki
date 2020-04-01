const Staff = {
    template: `
<div>
    <div class="level">
        <div class="level-left">
            <h1 class="title">Кадар</h1>
        </div>
        <div class="level-right">
                <router-link to="/create-staff" tag="button" class="button is-info">Креирај кадар</router-link>
        </div>
    </div>
    <div v-for="s in staff" class="field">
        <h2 class="subtitle">{{s.label}}</h2>
        
        <div class="columns " v-for="six in s.list">
            <div v-for="person in six" class="column is-2">
            <router-link :to="{name:'viewStaff', params:{id:person.id}}">
                <div class="card">
                <div class="card-image">
            <figure class="image is-3by3">
              <img v-bind:src="person.img" object-fit="cover" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
                <p class="title is-6">{{person.name}}</p>
                <p class="subtitle is-6">{{person.title}}</p>
          </div>
        </div></router-link>
            </div>   
        
        </div>
    </div>
</div>
`,
    data:function () {
        const url = "http://purl.org/vocab/aiiso-roles/schema#";
        return {
            staff: [
                {
                    label:"Професори",
                    type: url+"Professor",
                    list: []
                },
                {
                    label:"Асистенти",
                    type: url+"Assistant",
                    list: []
                },
                {
                    label:"Административци",
                    type: url+"Admission_Officer",
                    list: []
                }
                ]
        }
    },
    methods:{
        getAllProff() {
            fetch(API + "/get_all_professors")
                .then(a => a.json())
                .then(a => {
                     this.staff.map(b=>{
                        b["list"] = chunk(a.filter(z => z.role === b["type"]));
                        return b;
                    });
                })
        }

    },
    mounted(){
        this.getAllProff();
    }
};