import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 在这里定义全局的路由
export default new Router({
        routes: [
            {
                path:'/',
                redirect:'/home'
            },
            {
                path: '/',
                component: () => import('../components/common/Home.vue'),
                meta: {title: '主页'},
                children: [
                    {
                        path: '/home',
                        component: () => import('../components/page/Index.vue'),
                        meta: { title: '系统首页' }
                    },
                    {
                        path: '/edit',
                        component: () => import('../components/page/Edit.vue'),
                        meta: { title: '绘制页' },
                        children:[
                            {
                                path: '*',
                                component: () => import('../components/common/PaintArea')
                            }
                        ]
                    },
                    {
                        path: '/file',
                        component: () => import('../components/page/File.vue'),
                        meta: { title: '文件上传页' }

                    }
                ]
            }

        ]
    }

)

