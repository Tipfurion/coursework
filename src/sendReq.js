export default{
    sendReq:async function(url,options=null){
        let result = await fetch(url, options)
        return result.json()
    }
}