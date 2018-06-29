<template>
    <div class='center' v-loading='true'>
        <!-- 认证中... -->
    </div>
</template>
<script>
import {setsafetyToken,setsafetyUsername,setsafetyUserid} from '@/utils/auth'
import { getToken } from '@/api/safety'
export default {
    data() {
        return {
        };
    },
    created(){
        this.getToken();
    },
    methods: {
        // 获取token
        getToken(){
            // var token = this.$route.query.ticket 
            let url = 'http://172.18.208.18:8091/?ticket=ST-849-L4b6d14wopJksmlamhDn-com.ctg.cas001#/console' ;
            console.log(123,url);
            
            let firstI = url.indexOf('='),
                lastI = url.lastIndexOf('#');
            console.log(123,firstI,lastI);
                
              let  token = url.slice(firstI+1, lastI);
            console.log(123,token);
            this.secondGetToken(token)
        },
        secondGetToken(token){
            // console.log(456,token)
            let ser = 'index';
            let paramsData = '<ticket>'+ token +'</ticket>'
            getToken(ser,paramsData).then(res=>{
                console.log('获取用户登录数据成功', res);
                setsafetyToken(res.token)
                setsafetyUsername(res.userName);
                setsafetyUserid(res.userId)
                this.$router.push('overviewv')
            }).catch(err=>{
                console.log('获取用户登录数据失败', err);
            })
        },
    }
};
</script>
<style lang="scss">
.center {
    // text-align: center;
    width: 100%;
    height: 500px;
}
</style>