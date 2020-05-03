export default{
    sendReq:async function(url,options=null,statusNeed=false){
        let result = await fetch(url, options)
        if(statusNeed){
            return {response:result.json(), status:result.status}
        }
        return result.json()
    }
}