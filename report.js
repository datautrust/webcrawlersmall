const fs = require('fs')
function printReport(pages) {
    console.log("=============================================")
    console.log("REPORT")
    console.log("=============================================")
    const sortedPages = sortPages(pages)
    let csvContent =''
    for (const sortedPage of sortedPages) {
        const url = sortedPage[0]
        const hits = sortedPage[1]
        console.log(`Found ${hits} links to page: ${url}`)
        csvContent += `Found ${hits} links to page: ${url}`+ '\n'
        
                
    }
    fs.writeFile('output.csv', csvContent, 'utf8', function (err) {
        if (err) {
          console.log('An error occurred while writing the CSV file:', err);
        } else {
            
          console.log('The CSV file was written successfully.');
        }
      });
      


    console.log("=============================================")
    console.log("END REPORT")
    console.log("=============================================")

}

function sortPages(pages){
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a,b) => {
        aHits = a[1]
        bHits = b[1]
        return b[1] - a[1]
    })
    return pagesArr
}
module.exports = {
    sortPages,
    printReport
}
