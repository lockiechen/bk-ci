const Vue = window.Vue
const vue = new Vue()
const prefix = 'store/api'
const processPerfix = 'process/api'

export default {
    getMemberView (params) {
        return vue.$ajax.get(`${prefix}/user/market/desk/store/member/view`, { params })
    },

    getMemberList (params) {
        return vue.$ajax.get(`${prefix}/user/market/desk/store/member/list`, { params })
    },

    requestDeleteMember (params) {
        return vue.$ajax.delete(`${prefix}/user/market/desk/store/member/delete`, { params })
    },

    requestAddMember (params) {
        return vue.$ajax.post(`${prefix}/user/market/desk/store/member/add`, params)
    },

    requestChangeProject (params) {
        return vue.$ajax.put(`${prefix}/user/market/desk/store/member/test/project/change?projectCode=${params.projectCode}&storeCode=${params.storeCode}&storeType=${params.storeType}&storeMember=${params.storeMember}`)
    },

    requestStaticChartData (storeType, storeCode, params) {
        return vue.$ajax.get(`${prefix}/user/store/statistic/types/${storeType}/codes/${storeCode}/trend/data`, { params })
    },

    requestStatisticPipeline (code, params) {
        return vue.$ajax.get(`${processPerfix}/user/pipeline/atoms/${code}/rel/list`, { params })
    },

    requestSavePipelinesAsCsv (code, params) {
        const query = []
        for (const key in params) {
            const val = params[key]
            if (val) query.push(`${key}=${val}`)
        }
        return fetch(`${processPerfix}/user/pipeline/atoms/${code}/rel/csv/export?${query.join('&')}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        })
    }
}
