const Subjects = {template: '<div>DMASDJLASK <br /> DKJLAKLJDASJK<br /> DKJLAKLJDASJK<br /> DKJLAKLJDASJK<br /> DKJLAKLJDASJK<br /> DKJLAKLJDASJK<br /> DKJLAKLJDASJKLDKLJSA</div>'};
const StudyPrograms = {template: '<div>study</div>'};
const Home = {template: '<div>Welcome</div>'};


const routes = [
    {path: '/', component: Home},
    {path: '/study-programs', component: StudyPrograms},
    {path: '/subjects', component: Subjects},
    {path: '/staff', component: Staff},
    {path: '/create-staff', component: CreateStaff}
];

const router = new VueRouter({
    routes
});

const app = new Vue({
    router,
}).$mount('#app')