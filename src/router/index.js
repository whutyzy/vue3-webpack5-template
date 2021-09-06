import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/',
        redirect: '/about'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
