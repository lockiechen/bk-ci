import Vue from 'vue'
import Router from 'vue-router'
import { updateRecentVisitServiceList, urlJoin, getServiceAliasByPath, importScript, importStyle } from '../utils/util'

import compilePath from '../utils/pathExp'
import * as cookie from 'js-cookie'
import eventBus from '@/utils/eventBus'

// 首页 - index
const Index = () => import('../views/Index.vue')

const Home = () => import('../views/Home.vue')

const IFrame = () => import('../views/IFrame.vue')

const ProjectManage = () => import('../views/ProjectManage.vue')

const Maintaining = () => import('../views/503.vue')
const NotFound = () => import('../views/404.vue')

Vue.use(Router)

let mod: Route[] = []
for (const key in window.Pages) {
    mod = mod.concat(window.Pages[key].routes)
}

const iframeRoutes = window.serviceObject.iframeRoutes.map(r => ({
    path: urlJoin('/console', r.path, ':restPath*'),
    name: r.name,
    component: IFrame,
    meta: r.meta,
    pathToRegexpOptions: {
        strict: true,
        end: false
    }
}))

const routes = [
    {
        path: '/console',
        component: Index,
        children: [
            {
                path: '',
                name: 'home',
                component: Home,
                meta: {
                    showProjectList: false,
                    showNav: true
                }
            },
            {
                path: 'pm',
                name: 'pm',
                component: ProjectManage,
                meta: {
                    showProjectList: false,
                    showNav: true
                }
            },
            ...iframeRoutes,
            ...mod,
            {
                path: 'maintaining',
                name: '503',
                component: Maintaining
            }
        ]
    },
    {
        path: '*',
        name: '404',
        component: NotFound
    }
]

function isAmdModule (currentPage: subService): boolean {
    return currentPage && currentPage.inject_type === 'amd'
}

const createRouter = (store: any, dynamicLoadModule: any, i18n: any) => {
    const router = new Router({
        mode: 'history',
        routes: routes
    })
    
    let loadedModule = {}

    if (isAmdModule(window.currentPage)) {
        const serviceAlias = getServiceAliasByPath(window.currentPage.link_new)
        loadedModule = {
            [serviceAlias]: true
        }
    }
    
    router.beforeEach(async (to, from, next) => {
        const serviceAlias = getServiceAliasByPath(to.path)
        const currentPage = window.serviceObject.serviceMap[serviceAlias]
        const preCurrentPage = window.currentPage
        updateCurrentPage(currentPage, store) // update currentPage
        if (!currentPage) { // console 首页
            next()
            return
        }
        
        const { css_url, js_url } = currentPage
        if (isAmdModule(currentPage) && !loadedModule[serviceAlias]) {
            try {
                store.dispatch('toggleModuleLoading', true)
                await Promise.all([
                    importStyle(css_url, document.head),
                    importScript(js_url, document.body),
                    dynamicLoadModule(serviceAlias, i18n.locale)
                ])
                loadedModule[serviceAlias] = true
                const module = window.Pages[serviceAlias]
                store.registerModule(serviceAlias, module.store)
                const dynamicRoutes = [{
                    path: '/console/',
                    component: Index,
                    children: module.routes
                }]
                
                router.addRoutes(dynamicRoutes)
                // @ts-ignore
                const matchedRoute = router.match(to.path)
                goNext(matchedRoute, next)
            } catch (error) {
                eventBus.$bkMessage({
                    message: error.message,
                    theme: 'error'
                })
                console.log('catch')
                updateCurrentPage(preCurrentPage, store) // update currentPage
                store.dispatch('toggleModuleLoading', false)
            }
        } else if (isAmdModule(currentPage) && loadedModule[serviceAlias]) {
            await dynamicLoadModule(serviceAlias, i18n.locale)
            goNext(to, next)
        } else {
            goNext(to, next)
        }
    })

    router.afterEach(route => {
        updateRecentVisitServiceList(route.path)
        store.dispatch('upadteHeaderConfig', updateHeaderConfig(route.meta))
        console.log('after')
        store.dispatch('toggleModuleLoading', false)
    })
    return router
}

function updateHeaderConfig ({ showProjectList, showNav }) {
    return {
        showProjectList: showProjectList || (window.currentPage && window.currentPage.show_project_list && typeof showProjectList === 'undefined'),
        showNav: showNav || (window.currentPage && window.currentPage.show_nav && typeof showNav === 'undefined')
    }
}

function updateCurrentPage (currentPage, store) {
    window.currentPage = currentPage
    store.dispatch('updateCurrentPage', currentPage) // update currentPage
}

function getProjectId (params): string {
    try {
        const cookiePid = cookie.get(X_DEVOPS_PROJECT_ID)
        const projectId = window.GLOBAL_PID || cookiePid
        return String(params.projectId) !== '0' && params.projectId ? params.projectId : projectId
    } catch (e) {
        return ''
    }
}

function initProjectId (to): string[] {
    try {
        const { matched, params } = to
        const projectId: string = getProjectId(params)
        const lastMatched = matched[matched.length - 1]
        const options = projectId ? {
            ...params,
            projectId
        } : params
        const compiledPath = matched.length ? compilePath(lastMatched.path)(options) : to.path

        return [compiledPath, projectId]
    } catch (e) {
        console.log(e)
        return [to.path, '']
    }
}

function goNext (to, next) {
    const [newPath, projectId] = initProjectId(to)
    if (projectId) {
        window.setProjectIdCookie(projectId)
    }
    if (to.path !== newPath) {
        next({
            path: newPath,
            query: to.query,
            hash: to.hash
        })
    } else {
        next()
    }
}

export default createRouter
