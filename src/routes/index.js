import Home from '@/views/Home.vue'

export const routes = [
    { path: '/', name: "home", component: Home },
    {
        path: '/:dpth1/:dpth2/:dpth3'
        , name: "menu"
        , component: () => import('@/components/TheTab.vue')
    },
    
]

