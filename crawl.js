const {JSDOM} = require('jsdom')
async function crawlPage(baseURL,currentURL,pages) {
   
// lets make sure we are crawling pages from 1 site, not different sites
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    console.log("pages ",pages)
    console.log("baseURLObj", baseURLObj)
    console.log("curentURLObj ", currentURLObj)
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    } 
    // now lets check if we already crawled this page
    //we do this by checking this currentURL exists in the pages object
    const normalizedCurrentURL = normalizeURL(currentURL)
    if (pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }
//init pages
    pages[normalizedCurrentURL] = 1
    console.log("actively crawling ", `${currentURL}`)

    try{
       const resp = await fetch(currentURL)
       if (resp.status > 399) {
        console.log(`error in fetch with status code ${resp.status}
        on pagexxx: ${currentURL}`)
        return pages
       }
//check for valid html content by looking at the header
       const contentType = resp.headers.get("content-type")
       if (!contentType.includes("text/html")) {
        console.log("non html response, content type",
        `${contentType}`," on page ",`${currentURL}`)
        return pages
       }
//console.log(await resp.text())  //earlier in labs we used .json but here we just want the html text
       const htmlBody = await resp.text();
//now we traverse & extract all the links 
       const nextURLs = getURLsFromHTML(htmlBody,baseURL)
       for (const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL,pages)

       }
       
    } catch (err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    return pages;
   
}
function getURLsFromHTML(htmlBody, baseURL){
//htmlbody = the html string
//baseURL what we are crawling
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements =  dom.window.document.querySelectorAll('a')
    const junk = dom.window.document.querySelector("nft")
    console.log("dummyxxxxxxxxxx xxxx",junk)
    for (const linkElement of linkElements){
        // logic for relative urls
        //c console.log("in for loop",linkElement.href)
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
                 //c console.log("in for loop absolute",linkElement.href)
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
