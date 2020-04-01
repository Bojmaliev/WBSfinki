const routes = [
    {path: '/', component: Home},
    {path: '/study-programs', component: StudyPrograms},
    {path: '/subjects', component: Subjects},
    {path: '/subjects/:id', name:"viewSubject", component: ViewSubject},
    {path: '/staff', component: Staff},
    {path: '/staff/:id', name:"viewStaff", component: ViewProfile},
    {path: '/create-staff', component: CreateStaff},
    {path: '/edit-course/:id', name:"editCourse", component: EditSubject},
    {path: '/create-course', component: CreateSubject},
    {path: '/create-study-program', component: CreateStudyProgram},
    {path: '/study-programs/:studyProgram', name:"viewStudyProgram", component: ViewStudyProgram},
];

const router = new VueRouter({
    routes
});

const app = new Vue({
    router,
    data: {
        logged: null,
        mobileMenu:false
    },
    methods: {
        login() {
            loginModal.open();
        },
        logout() {
            setLogout();
            this.logged = null;
        },
        isRoute(route){
            return router.currentRoute.path.indexOf(route) === -1;
        }
    },
    mounted() {
        this.logged = getLogged()
    }
}).$mount('#app')
let loginModal = new Vue({
    el: "#loginForm",
    data: {
        username: "",
        opened: false
    },
    methods: {
        login() {
            if (this.username.length < 4) return "";
            setLogged(this.username);
            app.logged = this.username;
            this.close();
        },
        close() {
            this.username = "";
            this.opened = false;
        },
        open() {
            this.opened = true;
        }
    }
});