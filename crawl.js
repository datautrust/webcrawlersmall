const {JSDOM} = require('jsdom')
async function crawlPage(currentURL) {
    console.log("actively crawling ", `${currentURL}`)
    try{
       const resp = await fetch(currentURL)
       if (resp.status > 399) {
        console.log(`error in fetch with status code ${resp.status}
        on pagexxx: ${currentURL}`)
        return
       }
//check for valid html content by looking at the header
       const contentType = resp.headers.get("content-type")
       if (!contentType.includes("text/html")) {
        console.log("non html response, content type",
        `${contentType}`," on page ",`${currentURL}`)
        return
       }

       console.log(await resp.text())  //earlier in labs we used .json but here we just want the html text
    } catch (err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }

   
}
function getURLsFromHTML(htmlBody, baseURL){
//htmlbody = the html string
//baseURL what we are crawling
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements =  dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        // logic for relative urls
        console.log("in for loop",linkElement.href)
        if (linkElement.href.slice(0,1) === '/') {
            //this is a relative url.
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`) //to handle bad urls
                // before urls.push(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with relative url: ${err.message}`)
            }
            
        } else{
                // this for absolute url
                try{
                  console.log("in for loop absolute",linkElement.href)
                  const urlObj = new URL(linkElement.href)
                  urls.push(urlObj.href) 
                }  catch(err){
                    console.log('error with asbsolute url: ${err.message}')
                }
                
        }
    }
    return urls

}

function normalizeURL(urlString){
    const urlObj = new URL(urlString)
    //console.log(urlObj)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) == '/'){
        return hostPath.slice(0,-1)
    }
    return hostPath
}




module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
}
